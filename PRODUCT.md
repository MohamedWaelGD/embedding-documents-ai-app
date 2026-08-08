# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Legal and compliance professionals who need to review, structure, and search across dense regulatory documents. They work with bilingual (Arabic/English) regulation PDFs and need to extract structured regulation data — regulations, types, and specific actions (penalties, additions) with their values — without manual transcription or spreadsheet work.

## Product Purpose

DocIntelligence turns regulatory PDFs into a searchable, structured knowledge base. A user uploads a PDF, the system extracts and cleans the text, chunks it, sends it to an LLM for bilingual schema structuring, and after the user reviews and confirms, generates embeddings and persists everything. The user can then ask natural language questions and get grounded answers backed by the actual document content.

Success means a legal professional can go from PDF to structured regulation data and semantic search in minutes, not hours of manual work.

## Positioning

End-to-end simplicity. Competitors often require complex setup, schema configuration, or multi-tool pipelines. DocIntelligence is a single flow: upload, review, search. No configuration wizards, no schema editing — the LLM handles structuring, and the user only reviews and confirms.

The system is AI-provider-agnostic by design: switching from OpenAI to any compatible provider requires only environment variable changes, no code modifications.

## Operating Context

- Used at a desk in a professional legal/compliance setting
- Documents are regulatory PDFs containing Arabic and English text
- Users are technically comfortable enough to review structured JSON output
- Single-user for the current POC stage; no multi-tenant isolation or authentication
- Workflow: upload → review raw text and structured data → edit if needed → confirm → semantic search

## Capabilities and Constraints

**Capabilities:**
- PDF text extraction with OCR fallback (tesseract.js) for image-based PDFs
- Recursive character-based text chunking with configurable size and overlap
- LLM-powered bilingual schema structuring (regulation → type → action with penalty/addition values)
- Tabbed review interface: raw text + structured JSON, with edit-and-restructure and direct JSON editing
- Embedding generation and pgvector similarity search with configurable threshold
- Grounded LLM answers with source chunk references
- Document lifecycle: list, download original PDF, cascade-delete

**Constraints:**
- No authentication or multi-user isolation (single-user POC)
- File upload limit: 50MB per PDF (configurable)
- LLM calls have a configurable timeout; failures show error with retry
- All AI configuration via environment variables only (provider, key, model, embedding model)
- Structured output schema (regulation/types/actions) is fixed for the POC
- Handwriting OCR is not required
- CRUD latency <200ms p95; AI ops 30s timeout; async if >1s
- Frontend LCP <2.5s, TTI <3s

**Undecided:**
- Whether authentication and multi-user support will be added post-POC
- Target deployment environment and hosting strategy

## Brand Commitments

None. DocIntelligence is a greenfield concept name with no existing visual identity, logo, voice, or brand assets.

## Evidence on Hand

- Feature spec with acceptance scenarios, edge cases, and data model (`specs/001-document-ocr-search/spec.md`)
- Working Angular 21 frontend with Upload, Search, and Documents pages
- Working Express backend with ingest pipeline, search, and document management endpoints
- Supabase SQL migration (`backend/supabase/migration.sql`)
- No real user feedback, testimonials, or production usage data yet (POC stage)
- No visual design system or style guide

## Product Principles

1. **Speed to insight.** The user should go from PDF upload to structured answers in the shortest possible path — every extra click or configuration step is failure.
2. **Trust through transparency.** The user sees the raw extracted text and structured output side by side and confirms before anything is saved. AI output is always reviewable.
3. **Provider independence.** No lock-in. The AI pipeline works identically regardless of which provider sits behind it.
4. **Bilingual as baseline.** Arabic and English are not afterthoughts — the schema, extraction, and search are designed for both from the start.
5. **Cautious answers.** When the system doesn't know, it says so. No hallucinated answers, no confident-sounding fabrications.

## Accessibility & Inclusion

No product-specific accessibility requirements have been established. The POC targets a web platform with standard accessibility expectations (keyboard navigation, screen reader compatibility, sufficient color contrast) but has no defined compliance target (e.g., WCAG 2.1 AA).
