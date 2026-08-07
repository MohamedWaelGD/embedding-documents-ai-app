import { config } from '../config';
import { getOpenAI } from '../config/openai';
import { AppError, ErrorCode } from '../models/errors';

const BATCH_SIZE = 32;

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const client = getOpenAI();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.aiTimeoutMs);

  try {
    const results: number[][] = [];
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const response = await client.embeddings.create(
        { model: config.ai.embeddingModel, input: batch },
        { signal: controller.signal },
      );
      for (const item of response.data) {
        results.push(item.embedding);
      }
    }
    return results;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new AppError(ErrorCode.EMBEDDING_ERROR, 'Embedding request timed out', 408);
    }
    throw new AppError(ErrorCode.EMBEDDING_ERROR, 'Embedding generation failed', 502, {
      cause: err instanceof Error ? err.message : String(err),
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function embedText(text: string): Promise<number[]> {
  const [vector] = await embedTexts([text]);
  return vector;
}
