-- ============================================================
-- Supabase Migration: document-ocr-search
-- Run this in the Supabase SQL Editor (or via `supabase db push`)
-- ============================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents (created_at DESC);

-- 3. Document chunks with embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  embedding vector(1536) NOT NULL,
  chunk_index int NOT NULL,
  page_number int,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON document_chunks (document_id);

-- NOTE: IVFFlat index is created after data is inserted (see migration notes).
-- CREATE INDEX idx_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 4. Structured regulations
CREATE TABLE IF NOT EXISTS structured_regulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  description_ar text,
  description_en text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_regulations_document_id ON structured_regulations (document_id);

-- 5. Regulation types
CREATE TABLE IF NOT EXISTS regulation_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regulation_id uuid REFERENCES structured_regulations(id) ON DELETE CASCADE NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_types_regulation_id ON regulation_types (regulation_id);

-- 6. Regulation actions
CREATE TABLE IF NOT EXISTS regulation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id uuid REFERENCES regulation_types(id) ON DELETE CASCADE NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_actions_type_id ON regulation_actions (type_id);

-- 7. Vector similarity search RPC
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
