# Implementation Plan: Document OCR, Ingestion & Semantic Search

**Branch**: `001-document-ocr-search` | **Date**: 2026-08-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-document-ocr-search/spec.md`

## Summary

Build a web application (Angular frontend + Node.js/Express backend) that ingests PDF documents, extracts text (direct extraction with OCR fallback), chunks content via LangChain recursive splitting, structures the data into regulation/action schemas using an LLM, and stores everything in Supabase (relational tables, vector embeddings, and PDF storage). Users can then perform semantic search via a Supabase RPC function and receive context-grounded LLM answers. Full CRUD for documents with cascade deletion of embeddings.

## Technical Context

**Language/Version**: TypeScript 5.9+ (frontend + backend)
**Primary Dependencies**: Angular 21, Express 4, OpenAI SDK v4+, @langchain/textsplitters, pdf-parse, tesseract.js, @supabase/supabase-js
**Storage**: Supabase (PostgreSQL with pgvector extension + Storage buckets)
**Testing**: Vitest (frontend), Vitest + supertest (backend)
**Target Platform**: Web browser (frontend), Node.js 20+ server (backend)
**Project Type**: Web application (monorepo: frontend/ + backend/)
**Performance Goals**: API CRUD <200ms p95, AI operations configurable timeout (default 30s), search answer <10s
**Constraints**: No authentication, single-user POC, AI provider swappable via env vars only, PDF upload max 50MB (configurable)
**Scale/Scope**: Single user, <100 documents, demo/POC

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality | ✅ PASS | Angular standalone components + Express layered architecture planned |
| II. Testing Standards | ✅ PASS | Vitest for frontend/backend, co-located tests, happy + error paths |
| III. UX Consistency | ✅ PASS | Tailwind CSS 4, shared loading/error/empty states, responsive 320px-1920px |
| IV. Performance | ✅ PASS | Lazy loading, OnPush CD, AI ops with configurable timeout, API indexing |
| V. AI Provider Config | ✅ PASS | All AI config from env vars; OpenAI SDK with optional baseURL override |

### Constitution Deviations

| Item | Deviation | Justification |
|------|-----------|---------------|
| Neon Postgres (Relational DB) | Using Supabase PostgreSQL for ALL data (relational + vectors + storage) | POC simplification: single database reduces deployment complexity. Spec clarify session confirmed. Constitution technology stack will need update post-POC if this pattern is adopted long-term. |
| Auth testing gates | Not applicable | Feature is explicitly a no-auth POC; auth-related principles are out of scope for this feature. |

## Project Structure

### Documentation (this feature)

```text
specs/001-document-ocr-search/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.yaml         # OpenAPI 3.0 API contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── routes/          # Express route handlers (/api/documents, /api/search, /api/ingest)
│   ├── controllers/     # Request handling, validation, response formatting
│   ├── services/        # Business logic (ocr, chunking, embedding, structuring, search)
│   ├── models/          # TypeScript interfaces + Supabase query helpers
│   ├── middleware/       # Error handling, timeout, request logging
│   ├── config/          # Environment variable parsing, OpenAI client setup, Supabase client
│   └── index.ts         # Express app entry point + server start
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore

frontend/
├── src/
│   ├── app/
│   │   ├── components/  # Shared UI (file-upload, status-indicator, tabs, etc.)
│   │   ├── pages/       # Page components (upload, documents, search)
│   │   ├── services/    # API service layer, Supabase client
│   │   ├── models/      # TypeScript interfaces
│   │   └── app.config.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── package.json
├── angular.json
└── .env.example (dev proxy config)
```

**Structure Decision**: Web application monorepo (Option 2). Frontend already scaffolded via Angular CLI. Backend will be scaffolded manually with Express + TypeScript. Both projects share type definitions where practical.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Neon Postgres not used | Unified Supabase simplifies single-user POC deployment | Two databases add deployment complexity without value for a POC |
