# Data Model: Document OCR, Ingestion & Semantic Search

**Feature**: 001-document-ocr-search
**Date**: 2026-08-07

## Entity Relationship Diagram

```
documents (1) ─────< structured_regulations (N)
documents (1) ─────< document_chunks (N)
structured_regulations (1) ─────< regulation_types (N)
regulation_types (1) ─────< regulation_actions (N)
```

## Tables

### `documents`

Relational table for document metadata and PDF storage reference.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Unique document identifier |
| `filename` | `text` | NOT NULL | Original filename |
| `storage_path` | `text` | NOT NULL | Path in Supabase Storage bucket |
| `created_at` | `timestamptz` | DEFAULT now() | Upload timestamp |

**Indexes**: `idx_documents_created_at` on `created_at DESC`

### `document_chunks`

Vector-enabled table for chunked text with embeddings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Unique chunk identifier |
| `document_id` | `uuid` | FK → documents(id) ON DELETE CASCADE | Parent document |
| `content` | `text` | NOT NULL | Chunk text content |
| `embedding` | `vector(1536)` | NOT NULL | Embedding vector (dimension configurable) |
| `chunk_index` | `int` | NOT NULL | Position in document (0-based) |
| `page_number` | `int` | NULLABLE | Source page number |
| `created_at` | `timestamptz` | DEFAULT now() | Creation timestamp |

**Indexes**:
- `idx_chunks_document_id` on `document_id`
- `idx_chunks_embedding` — IVFFlat index on `embedding vector_cosine_ops` (for similarity search performance)

### `structured_regulations`

LLM-extracted regulation from a document.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Unique regulation identifier |
| `document_id` | `uuid` | FK → documents(id) ON DELETE CASCADE | Parent document |
| `name_ar` | `text` | NOT NULL | Regulation name in Arabic |
| `name_en` | `text` | NOT NULL | Regulation name in English |
| `description_ar` | `text` | NULLABLE | Description in Arabic |
| `description_en` | `text` | NULLABLE | Description in English |
| `created_at` | `timestamptz` | DEFAULT now() | Creation timestamp |

### `regulation_types`

Category/type within a regulation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Unique type identifier |
| `regulation_id` | `uuid` | FK → structured_regulations(id) ON DELETE CASCADE | Parent regulation |
| `name_ar` | `text` | NOT NULL | Type name in Arabic |
| `name_en` | `text` | NOT NULL | Type name in English |
| `created_at` | `timestamptz` | DEFAULT now() | Creation timestamp |

### `regulation_actions`

Individual action/penalty/addition within a regulation type.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Unique action identifier |
| `type_id` | `uuid` | FK → regulation_types(id) ON DELETE CASCADE | Parent regulation type |
| `action_ar` | `text` | NOT NULL | Action name in Arabic |
| `action_en` | `text` | NOT NULL | Action name in English |
| `action_type` | `text` | NOT NULL | 'Penalty' or 'Addition' |
| `penalty_value_type` | `text` | NULLABLE | 'Amount', 'Text', 'Days', 'Percentage' |
| `addition_value_type` | `text` | NULLABLE | 'Amount', 'Text', 'Days', 'Percentage' |
| `text_value` | `text` | NULLABLE | Value when type is Text |
| `decimal_value` | `numeric` | NULLABLE | Value when type is Amount |
| `days_value` | `numeric` | NULLABLE | Value when type is Days (supports fractional days) |
| `percentage_value` | `numeric` | NULLABLE | Value when type is Percentage |
| `created_at` | `timestamptz` | DEFAULT now() | Creation timestamp |

## TypeScript Interfaces

### Backend interfaces

```typescript
interface Document {
  id: string;
  filename: string;
  storage_path: string;
  created_at: string;
}

interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  embedding: number[];
  chunk_index: number;
  page_number: number | null;
  created_at: string;
}

interface StructuredRegulation {
  id: string;
  document_id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  regulationTypes: RegulationType[];
}

interface RegulationType {
  id: string;
  regulation_id: string;
  name_ar: string;
  name_en: string;
  regulationActions: RegulationAction[];
}

interface RegulationAction {
  id: string;
  type_id: string;
  action_ar: string;
  action_en: string;
  action_type: 'Penalty' | 'Addition';
  penalty_value_type: 'Amount' | 'Text' | 'Days' | 'Percentage' | null;
  addition_value_type: 'Amount' | 'Text' | 'Days' | 'Percentage' | null;
  text_value: string | null;
  decimal_value: number | null;
  days_value: number | null;
  percentage_value: number | null;
}

// Search
interface SearchRequest {
  query: string;
}

interface MatchedChunk {
  id: string;
  document_id: string;
  content: string;
  page_number: number | null;
  similarity: number;
}

interface SearchResponse {
  answer: string;
  matched_chunks: MatchedChunk[];
}

// Ingestion pipeline
interface IngestResponse {
  raw_text: string;
  structured_data: StructuredRegulation | null;
  error: string | null;
}

interface ConfirmIngestRequest {
  filename: string;
  raw_text: string;
  structured_data: StructuredRegulation;
}
```

## Deletion Cascade

When a document is deleted (`DELETE FROM documents WHERE id = ?`):

1. `document_chunks` rows → auto-deleted via `ON DELETE CASCADE`
2. `structured_regulations` rows → auto-deleted via `ON DELETE CASCADE`
3. `regulation_types` rows → auto-deleted via `ON DELETE CASCADE` (parent: regulation)
4. `regulation_actions` rows → auto-deleted via `ON DELETE CASCADE` (parent: type)
5. Supabase Storage file → manually deleted by backend service after DB deletion
6. IVFFlat index entries → auto-cleaned by pgvector on VACUUM

This satisfies SC-003: 100% cascade completeness.
