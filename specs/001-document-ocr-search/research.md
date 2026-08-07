# Research: Document OCR, Ingestion & Semantic Search

**Feature**: 001-document-ocr-search
**Date**: 2026-08-07

## 1. PDF Text Extraction

**Decision**: Use `pdf-parse` (Node.js wrapper for Mozilla's pdf.js) as primary extraction, with `tesseract.js` (v5) as OCR fallback.

**Rationale**:
- `pdf-parse` extracts text directly from text-based PDFs with high accuracy and minimal dependencies. It's widely used (700k+ weekly downloads), works on Node.js, and preserves page-level information.
- `tesseract.js` v5 provides browser-compatible OCR with WASM-based engine. However, for a Node.js backend, `sharp` + `tesseract.js` can process image-based pages extracted from PDFs via `pdf-parse`'s render API.
- The combined approach: extract text via `pdf-parse` first; if per-page text is empty/below threshold, render that page as image and run OCR.

**Alternatives considered**:
- `pdfjs-dist`: Direct pdf.js usage, more complex API; `pdf-parse` wraps it conveniently.
- `pdf2json`: Simpler but less page-level detail.
- Cloud OCR services (Google Vision, Azure Form Recognizer): Adds external dependency, cost, and complexity — rejected for POC.
- `unpdf`: Newer library with better browser support but less mature ecosystem.

## 2. Text Filtering & Cleaning

**Decision**: Apply regex-based cleanup pipeline with configurable patterns via env vars.

**Rationale**: POC-level cleaning. Common PDF noise: excessive whitespace, page numbers, headers/footers, line-break artifacts. A simple pipeline with configurable regex patterns handles this without heavy dependencies.

**Implementation**:
- Collapse multiple newlines → double newline
- Remove page number patterns (`^\d+$` lines)
- Normalize Unicode (NFKC) for Arabic+English mixed content
- Strip non-printable characters
- Configurable via `TEXT_FILTER_PATTERNS` env var (JSON array of regex:replacement pairs)

**Alternatives considered**:
- Dedicated NLP cleaning libraries: Overkill for POC
- LLM-based cleaning: Adds latency and cost; better done as part of structuring step

## 3. Text Chunking

**Decision**: Use `@langchain/textsplitters`'s `RecursiveCharacterTextSplitter`.

**Rationale**:
- LangChain's recursive splitter is production-tested and handles Arabic+English text well since it operates on characters, not word boundaries.
- Configurable `chunkSize` and `chunkOverlap` via env vars (`CHUNK_SIZE`, `CHUNK_OVERLAP`).
- Default separators: `["\n\n", "\n", ". ", "، ", " ", ""]` — handles both English periods and Arabic commas.

**Alternatives considered**:
- Custom splitter: Unnecessary when LangChain provides exactly what's needed.
- Semantic chunking: Higher quality but requires LLM calls per chunk — too expensive for POC.
- Fixed-size chunking: Doesn't respect paragraph/sentence boundaries.

## 4. LLM Structuring (Regulation Schema)

**Decision**: Use OpenAI SDK chat completions with structured output (JSON mode / response_format) to transform raw chunks into the regulation→types→actions schema.

**Rationale**:
- OpenAI SDK v4+ supports `response_format: { type: "json_schema", json_schema: { ... } }` for guaranteed JSON output matching a specified schema.
- The schema is fixed for the POC (regulation with types and actions), defined in a TypeScript config file, and sent as the response format specification.
- System prompt instructs the LLM to extract regulations, their types, and actions with bilingual (Arabic/English) naming from the chunks.

**Implementation**:
- Combine all chunks for a document into a single structuring call
- Use `AI_MODEL` env var for the model
- Set `response_format` to enforce the regulation schema
- Handle failures with retry (per FR-015)
- Results displayed in tabbed UI for user review/edit

**Alternatives considered**:
- Function calling / tool use: Works but JSON schema mode gives stricter output control for fixed schemas.
- Multiple LLM calls (one per chunk): Increases cost and latency; single call with full text is simpler and often more coherent.
- LangChain structured output chain: Adds unnecessary abstraction; direct SDK call is cleaner.

## 5. Embedding Generation

**Decision**: Use OpenAI SDK `embeddings.create()` with model from `AI_EMBEDDING_MODEL` env var (fallback to `AI_MODEL`).

**Rationale**:
- OpenAI embeddings (text-embedding-3-large: 3072d, text-embedding-3-small: 1536d) are state-of-the-art for multilingual content including Arabic.
- The RPC function's vector dimension must match the embedding model. Default to 1536 (text-embedding-3-small) for cost efficiency; configurable.
- Batch embedding (multiple chunks per API call) reduces round-trips.

**Implementation**:
- After user confirms structured data, generate embeddings for each chunk in batches
- Dimension documented in env var `EMBEDDING_DIMENSION` (default 1536)
- Store in Supabase vector table with chunk metadata and document reference

**Alternatives considered**:
- Local embedding models (sentence-transformers): Requires Python subprocess or ONNX runtime; adds complexity.
- Supabase built-in embedding generation: Vendor lock-in; violates AI Provider Config principle.

## 6. Supabase Integration

**Decision**: Use `@supabase/supabase-js` v2+ client for all Supabase operations.

**Components**:
- **Relational tables**: `documents`, `regulation_actions`, `regulation_types`, `structured_regulations` — standard PostgreSQL tables in Supabase
- **Vector table**: `document_chunks` with `pgvector` extension — stores chunk text + embedding vectors
- **Storage**: Supabase Storage bucket `documents` — stores uploaded PDF files
- **RPC**: `match_document_chunks` function — performs cosine similarity search

**Client configuration**:
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` for backend (full access)
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` for frontend (if direct access needed, limited by RLS)
- Since this is a no-auth POC, the backend proxies all Supabase operations

**Database setup**: SQL migration scripts provided in `backend/supabase/` directory covering:
1. Enable pgvector extension
2. Create tables (documents, structured_regulations, regulation_types, regulation_actions, document_chunks)
3. Create RPC function for vector similarity search
4. Set up Storage bucket

**Alternatives considered**:
- Raw PostgreSQL driver (pg): Loses Supabase Storage and RPC convenience
- Neon Postgres + Supabase split: Adds deployment complexity; rejected per clarify

## 7. Vector Similarity Search RPC

**Decision**: Create a Supabase RPC function `match_document_chunks` that performs cosine similarity search and returns chunks above threshold.

**SQL signature**:
```sql
match_document_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
) returns table(
  id uuid,
  document_id uuid,
  content text,
  page_number int,
  similarity float
)
```

**Rationale**:
- RPC functions execute server-side, reducing round-trips
- Cosine similarity via `<=>` operator with pgvector
- Returns chunk content + metadata + similarity score
- Configurable threshold and count from env vars (or per-request)

**Alternatives considered**:
- Client-side similarity calculation: Requires fetching all embeddings — doesn't scale
- Supabase `ai.embed()` + `match_` functions: Vendor lock-in; violates AI Provider Config principle

## 8. Backend Architecture

**Decision**: Express 4 with TypeScript, layered architecture: routes → controllers → services.

**Layers**:
- **Routes**: Thin routing layer mapping HTTP methods + paths to controllers
- **Controllers**: Request parsing, validation, response formatting
- **Services**: Business logic (OCR service, chunking service, embedding service, structuring service, search service, document service)
- **Middleware**: Error handler, request logger, timeout handler
- **Config**: Environment variable parsing, client instantiation (OpenAI, Supabase)

**Dependencies**: express, cors, multer (file upload), openai, @supabase/supabase-js, @langchain/textsplitters, pdf-parse, tesseract.js, dotenv, uuid

**Dev Dependencies**: typescript, tsx (dev runner), vitest, supertest, @types/*

**Alternatives considered**:
- Fastify: Slightly faster but smaller ecosystem; Express is simpler for a POC
- NestJS: Heavy framework, overkill for this scope
- Serverless (Supabase Edge Functions): Limited runtime (Deno only), harder to run OCR

## 9. Frontend Architecture

**Decision**: Angular 21 with standalone components, no auth, hash routing.

**Pages/Routes**:
- `/upload` — Upload PDF → extract → review structured data → confirm (P1)
- `/search` — Chat interface with semantic search (P2)
- `/documents` — Document list with download/delete (P3)

**Component Tree**:
```
AppComponent
├── NavigationComponent (tabs: Upload | Search | Documents)
├── UploadPage
│   ├── FileUploadComponent (drag-and-drop zone)
│   ├── PlainTextEditorComponent (editable textarea for raw text)
│   ├── StructuredViewerComponent (JSON editor/viewer)
│   └── StatusIndicatorComponent (loading/error/success states)
├── SearchPage
│   ├── ChatMessagesComponent (message list)
│   ├── ChatInputComponent (query input + send)
│   └── ContextReferencesComponent (shows matched chunks)
└── DocumentsPage
    ├── DocumentListComponent (table/cards of documents)
    └── DocumentActionsComponent (download/delete buttons)
```

**Services**:
- `IngestService` — Upload PDF, poll for extraction/structuring status
- `SearchService` — Send queries, receive answers
- `DocumentService` — List, download, delete documents

**State management**: Signals + services (no NgRx needed for POC)

**Alternatives considered**:
- React/Vue: Angular is the project's established frontend framework
- Server-side rendering: Not needed for POC; CSR works fine

## 10. System Prompt Configuration

**Decision**: The system prompt for the chat/search LLM is configured via `SYSTEM_PROMPT` env var with a sensible default.

**Default system prompt**:
```
You are a helpful assistant that answers questions based on provided document context.
Answer in the same language as the user's question (Arabic or English).
Only use information from the provided context. If the context doesn't contain the answer,
clearly state that no relevant information was found.
Be concise and cite specific regulation names when referencing them.
```

## 11. Embedding Dimension Configuration

**Decision**: `EMBEDDING_DIMENSION` env var with default 1536, used to configure the pgvector column type and RPC function signature.

**Rationale**: Different embedding models produce different dimensions. OpenAI text-embedding-3-small = 1536, text-embedding-3-large = 3072. Configuring this via env allows model swaps.

## Summary of Environmental Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `AI_PROVIDER_URL` | No | OpenAI default | Custom AI provider base URL |
| `AI_API_KEY` | Yes | - | AI provider auth key |
| `AI_MODEL` | Yes | - | Chat/completion model |
| `AI_EMBEDDING_MODEL` | No | `AI_MODEL` | Embedding model |
| `SUPABASE_URL` | Yes | - | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | - | Supabase service role key (backend) |
| `SUPABASE_ANON_KEY` | No | - | Supabase anon key (frontend dev only) |
| `CHUNK_SIZE` | No | 1000 | Character count per chunk |
| `CHUNK_OVERLAP` | No | 200 | Character overlap between chunks |
| `SIMILARITY_THRESHOLD` | No | 0.7 | Minimum cosine similarity for search |
| `MATCH_COUNT` | No | 4 | Max chunks returned per search |
| `MAX_FILE_SIZE_MB` | No | 50 | Max upload file size in MB |
| `LLM_TIMEOUT_MS` | No | 30000 | LLM call timeout in ms |
| `SYSTEM_PROMPT` | No | (built-in default) | System prompt for chat LLM |
| `EMBEDDING_DIMENSION` | No | 1536 | Vector dimension for embeddings |
| `SERVER_PORT` | No | 3000 | Backend server port |
