# Backend

Express + TypeScript backend for the Document OCR, Ingestion & Semantic Search app.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in the `.env` file with your AI provider and Supabase credentials.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_API_KEY` | Yes | AI provider auth key |
| `AI_MODEL` | Yes | Chat/completion model |
| `AI_EMBEDDING_MODEL` | No | Embedding model (defaults to `AI_MODEL`) |
| `AI_PROVIDER_URL` | No | Custom provider base URL (unset = OpenAI) |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `CHUNK_SIZE` | No | Chunk size (default 1000) |
| `CHUNK_OVERLAP` | No | Chunk overlap (default 200) |
| `SIMILARITY_THRESHOLD` | No | Search threshold (default 0.7) |
| `MATCH_COUNT` | No | Results per search (default 4) |
| `MAX_FILE_SIZE_MB` | No | Upload limit (default 50) |
| `LLM_TIMEOUT_MS` | No | AI timeout (default 30000) |
| `EMBEDDING_DIMENSION` | No | Vector dimension (default 1536) |
| `SERVER_PORT` | No | Port (default 3000) |

## Database Setup

Run the SQL in `supabase/migration.sql` in the Supabase SQL editor, then `supabase/storage-setup.sql`
to create the storage bucket.

## Development

```bash
npm run dev
```

## Tests

```bash
npm test
```

## Scripts

- `npm run dev` — watch mode via tsx
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled output
- `npm test` — run Vitest suite
