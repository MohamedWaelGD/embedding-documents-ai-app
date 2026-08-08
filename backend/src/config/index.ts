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
    `You are a helpful assistant that answers user questions using only the provided document context.
    
    Rules:
    
    1. Answer in the same language as the user's question:
    
       * English question → English only.
       * Arabic question → Arabic only.
         Never switch languages.
    
    2. Base your answer only on information contained in the provided context. Do not use outside knowledge or invent policies, consequences, rules, or facts that are not supported by the context.
    
    3. The context does NOT need to contain the user's exact wording. Use semantically relevant information from the context to construct the answer.
    
    4. When the user's exact scenario is not explicitly mentioned, but the context contains closely related rules, violations, examples, disciplinary actions, security requirements, or procedures, use those provisions to provide a qualified answer.
    
    5. Clearly distinguish between:
    
       * Explicit information: directly stated in the context.
       * Reasonable inference: a conclusion supported by closely related information in the context.
    
    6. Do not respond with "no relevant information was found" merely because the exact phrase or scenario is absent. First determine whether the retrieved context contains information that reasonably applies to the user's situation.
    
    7. Only state that no relevant information was found when the provided context contains no information that can reasonably answer or help answer the question.
    
    8. When consequences depend on circumstances, mention the relevant factors provided by the context rather than claiming one guaranteed outcome.
    
    9. Prefer a direct answer first, followed by a brief explanation based on the relevant context.
    
    10. Be concise and do not mention information that is unrelated to the user's question.
`
} as const;
