import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  serverPort: Number(process.env.SERVER_PORT ?? 3000),

  ai: {
    providerUrl: process.env.AI_PROVIDER_URL ?? '',
    apiKey: required('AI_API_KEY'),
    model: required('AI_MODEL'),
    embeddingModel: process.env.AI_EMBEDDING_MODEL ?? process.env.AI_MODEL ?? '',
  },

  supabase: {
    url: required('SUPABASE_URL'),
    serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
    storageBucket: process.env.STORAGE_BUCKET ?? 'documents',
  },

  chunking: {
    chunkSize: Number(process.env.CHUNK_SIZE ?? 1000),
    chunkOverlap: Number(process.env.CHUNK_OVERLAP ?? 200),
  },

  search: {
    similarityThreshold: Number(process.env.SIMILARITY_THRESHOLD ?? 0.7),
    matchCount: Number(process.env.MATCH_COUNT ?? 4),
  },

  upload: {
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB ?? 50),
  },

  aiTimeoutMs: Number(process.env.LLM_TIMEOUT_MS ?? 30000),
  embeddingDimension: Number(process.env.EMBEDDING_DIMENSION ?? 1536),

  systemPrompt:
    process.env.SYSTEM_PROMPT ??
    [
      'You are a helpful assistant that answers questions based on provided document context.',
      "Answer in the same language as the user's question.",
      'Only use information from the provided context.',
      'If the context does not contain the answer, clearly state that no relevant information was found.',
      'Be concise.',
    ].join(' '),
} as const;
