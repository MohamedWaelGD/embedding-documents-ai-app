import { config } from '../config';
import { getSupabase } from '../config/supabase';
import { getOpenAI } from '../config/openai';
import { AppError, ErrorCode, validationError } from '../models/errors';
import { MatchedChunk, SearchResponse } from '../models';
import { embedText } from './embedding.service';

export async function searchDocuments(query: string): Promise<SearchResponse> {
  if (typeof query !== 'string' || query.trim().length === 0) {
    throw validationError('query is required and must be non-empty.');
  }

  const supabase = getSupabase();
  const queryEmbedding = await embedText(query);

  const { data: matches, error } = await supabase.rpc('match_document_chunks', {
    query_embedding: queryEmbedding,
    match_threshold: config.search.similarityThreshold,
    match_count: config.search.matchCount,
  });

  if (error) {
    throw new AppError(ErrorCode.SEARCH_ERROR, 'Vector search failed', 502, {
      cause: error.message,
    });
  }

  const matchedChunks = (matches ?? []) as unknown as MatchedChunk[];

  if (matchedChunks.length === 0) {
    return {
      answer: 'No relevant information found in the uploaded documents.',
      matched_chunks: [],
    };
  }

  const answer = await generateAnswer(query, matchedChunks);
  return { answer, matched_chunks: matchedChunks };
}

async function generateAnswer(query: string, chunks: MatchedChunk[]): Promise<string> {
  const client = getOpenAI();
  const context = chunks
    .map((chunk, i) => `[Chunk ${i + 1}] (document: ${chunk.document_id})\n${chunk.content}`)
    .join('\n\n---\n\n');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.aiTimeoutMs);

  try {
    const response = await client.chat.completions.create(
      {
        model: config.ai.model,
        messages: [
          { role: 'system', content: config.systemPrompt },
          { role: 'user', content: `Context:\n${context}\n\nQuestion: ${query}` },
        ]
      },
      { signal: controller.signal },
    );

    const answer = response.choices[0]?.message?.content;
    if (!answer) {
      throw new AppError(ErrorCode.SEARCH_ERROR, 'LLM returned an empty answer', 502);
    }
    return answer.trim();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw new AppError(ErrorCode.TIMEOUT, 'Answer generation timed out', 408);
    }
    throw new AppError(ErrorCode.SEARCH_ERROR, 'Answer generation failed', 502, {
      cause: err instanceof Error ? err.message : String(err),
    });
  } finally {
    clearTimeout(timer);
  }
}
