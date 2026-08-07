# Quickstart: Document OCR, Ingestion & Semantic Search

**Feature**: 001-document-ocr-search
**Date**: 2026-08-07

## Prerequisites

- Node.js 20+ and npm 11+
- Supabase project with pgvector extension enabled
- AI provider API key (OpenAI or compatible)

## Setup

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Environment Configuration

Copy example env files and fill in values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend (for dev proxy config)
cp frontend/.env.example frontend/.env
```

**Backend `.env`** required variables:

```env
# AI Provider
AI_API_KEY=sk-...
AI_MODEL=gpt-4o
AI_EMBEDDING_MODEL=text-embedding-3-small
# AI_PROVIDER_URL=  (unset for OpenAI, set for OpenRouter etc.)

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional overrides
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
SIMILARITY_THRESHOLD=0.7
MATCH_COUNT=4
MAX_FILE_SIZE_MB=50
LLM_TIMEOUT_MS=30000
EMBEDDING_DIMENSION=1536
SERVER_PORT=3000
```

### 3. Supabase Database Setup

Run the migration SQL in your Supabase SQL editor:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Document chunks with embeddings
CREATE TABLE document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  content text NOT NULL,
  embedding vector(1536) NOT NULL,
  chunk_index int NOT NULL,
  page_number int,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_chunks_document_id ON document_chunks(document_id);

-- Structured regulations
CREATE TABLE structured_regulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  description_ar text,
  description_en text,
  created_at timestamptz DEFAULT now()
);

-- Regulation types
CREATE TABLE regulation_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regulation_id uuid REFERENCES structured_regulations(id) ON DELETE CASCADE,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Regulation actions
CREATE TABLE regulation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id uuid REFERENCES regulation_types(id) ON DELETE CASCADE,
  action_ar text NOT NULL,
  action_en text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('Penalty', 'Addition')),
  penalty_value_type text CHECK (penalty_value_type IN ('Amount', 'Text', 'Days', 'Percentage')),
  addition_value_type text CHECK (addition_value_type IN ('Amount', 'Text', 'Days', 'Percentage')),
  text_value text,
  decimal_value numeric,
  days_value numeric,
  percentage_value numeric,
  created_at timestamptz DEFAULT now()
);

-- Vector similarity search RPC
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  content text,
  page_number int,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    dc.id,
    dc.document_id,
    dc.content,
    dc.page_number,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- IVFFlat index for performance (run after inserting data)
-- CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### 4. Supabase Storage Setup

Create a storage bucket via Supabase dashboard:
- Bucket name: `documents`
- Public access: Disabled (served via backend API)
- File size limit: 50MB

### 5. Run

```bash
# Terminal 1 - Backend
cd backend
npm run dev    # http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm start      # http://localhost:4200
```

The frontend dev server proxies `/api/*` requests to `http://localhost:3000`.

### 6. Verify

1. Open `http://localhost:4200/upload` — Upload a PDF
2. Review extracted text and structured JSON
3. Confirm to save
4. Open `http://localhost:4200/search` — Ask a question about the document
5. Open `http://localhost:4200/documents` — Browse, download, or delete documents
