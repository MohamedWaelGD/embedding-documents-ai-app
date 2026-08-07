# Tasks: Document OCR, Ingestion & Semantic Search

**Input**: Design documents from `/specs/001-document-ocr-search/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per the constitution. Every user story MUST include test tasks covering both happy paths and error paths.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, frontend tests co-located with source (`*.spec.ts`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and database schema

- [x] T001 Scaffold backend Node.js/Express/TypeScript project in `backend/` (package.json, tsconfig.json, .env.example, .gitignore)
- [x] T002 [P] Install backend dependencies: express, cors, multer, openai, @supabase/supabase-js, @langchain/textsplitters, pdf-parse, tesseract.js, dotenv, uuid in `backend/`
- [x] T003 [P] Install backend dev dependencies: typescript, tsx, vitest, supertest, @types/express, @types/multer, @types/cors, @types/uuid in `backend/`
- [x] T004 [P] Create Supabase migration SQL file with all 5 tables + RPC function + indexes in `backend/supabase/migration.sql`
- [x] T005 [P] Create Supabase Storage setup script/documentation in `backend/supabase/storage-setup.sql`
- [x] T006 [P] Install frontend HTTP dependency (@angular/common/http is included; add @supabase/supabase-js if needed in `frontend/`)
- [x] T007 [P] Configure frontend dev proxy to backend (localhost:3000) in `frontend/angular.json` or `frontend/proxy.conf.json`
- [x] T008 [P] Create frontend .env.example with API base URL in `frontend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Backend Core

- [x] T009 Create config module with env var parsing and validation in `backend/src/config/index.ts`
- [x] T010 [P] Create OpenAI client singleton factory in `backend/src/config/openai.ts`
- [x] T011 [P] Create Supabase client singleton factory (service_role) in `backend/src/config/supabase.ts`
- [x] T012 Create Express app skeleton with CORS, JSON parsing, request logging middleware in `backend/src/index.ts`
- [x] T013 [P] Create error handling middleware with standardized error response format in `backend/src/middleware/error-handler.ts`
- [x] T014 [P] Create request timeout middleware (configurable per route) in `backend/src/middleware/timeout.ts`
- [x] T015 [P] Create shared TypeScript interfaces/ types for all entities in `backend/src/models/index.ts`

### Frontend Core

- [x] T016 Create Angular routing module with 3 routes (upload, search, documents) and default redirect in `frontend/src/app/app.routes.ts`
- [x] T017 Create AppComponent shell with navigation (tabs: Upload | Search | Documents) and router outlet in `frontend/src/app/app.component.ts`
- [x] T018 [P] Create API base service with HttpClient wrapper in `frontend/src/app/services/api.service.ts`
- [x] T019 [P] Create shared StatusIndicatorComponent for loading/error/success/empty states in `frontend/src/app/components/status-indicator.component.ts`

**Checkpoint**: Foundation ready - backend and frontend shells run, routing works, API calls reach backend

---

## Phase 3: User Story 1 - Upload, Extract & Structure Document (Priority: P1) 🎯 MVP

**Goal**: User uploads a PDF, system extracts text, cleans/chunks it, LLM structures into regulation schema, user reviews (edit/re-structure/cancel) and confirms save. PDF + embeddings + structured data persisted in Supabase.

**Independent Test**: Upload a sample PDF, view extracted text and structured JSON in tabbed UI, edit text or JSON, cancel or confirm save. Verify data exists in Supabase.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T020 [P] [US1] Unit test for OCR service (pdf-parse + tesseract fallback) in `backend/tests/services/ocr.service.spec.ts`
- [x] T021 [P] [US1] Unit test for text cleaning & chunking service in `backend/tests/services/chunking.service.spec.ts`
- [x] T022 [P] [US1] Unit test for LLM structuring service (happy path + malformed JSON + timeout) in `backend/tests/services/structuring.service.spec.ts`
- [x] T023 [P] [US1] Unit test for embedding generation service in `backend/tests/services/embedding.service.spec.ts`
- [x] T024 [P] [US1] Integration test for POST /api/ingest/upload endpoint in `backend/tests/integration/ingest-upload.spec.ts`
- [x] T025 [P] [US1] Integration test for POST /api/ingest/structure and POST /api/ingest/restructure endpoints in `backend/tests/integration/ingest-structure.spec.ts`
- [x] T026 [P] [US1] Integration test for POST /api/ingest/confirm and DELETE /api/ingest/cancel endpoints in `backend/tests/integration/ingest-confirm.spec.ts`
- [x] T027 [P] [US1] Component test for FileUploadComponent (drag-drop, validation, error states) in `frontend/src/app/components/file-upload.component.spec.ts`
- [x] T028 [P] [US1] Component test for PlainTextEditorComponent (edit, re-structure trigger) in `frontend/src/app/components/plain-text-editor.component.spec.ts`
- [x] T029 [P] [US1] Component test for StructuredViewerComponent (JSON viewer, direct edit) in `frontend/src/app/components/structured-viewer.component.spec.ts`

### Backend Implementation for User Story 1

- [x] T030 [P] [US1] Implement OCR service: pdf-parse extraction + tesseract.js OCR fallback in `backend/src/services/ocr.service.ts`
- [x] T031 [P] [US1] Implement text cleaning service: regex-based filtering, Unicode normalization in `backend/src/services/text-cleaner.service.ts`
- [x] T032 [US1] Implement chunking service: LangChain RecursiveCharacterTextSplitter with configurable size/overlap in `backend/src/services/chunking.service.ts` (depends on T031)
- [x] T033 [US1] Implement LLM structuring service: OpenAI chat completion with JSON schema response_format in `backend/src/services/structuring.service.ts` (depends on T032)
- [x] T034 [P] [US1] Implement embedding service: OpenAI embeddings.create with batching in `backend/src/services/embedding.service.ts`
- [x] T035 [US1] Implement document persist service (save PDF to Storage, chunks+embeddings to DB, structured data to relational tables) in `backend/src/services/document-persist.service.ts` (depends on T034)
- [x] T036 [US1] Implement ingest controller: upload extraction, structuring orchestrator in `backend/src/controllers/ingest.controller.ts`
- [x] T037 [US1] Create ingest routes (POST /api/ingest/upload, POST /api/ingest/structure, POST /api/ingest/restructure, POST /api/ingest/confirm, DELETE /api/ingest/cancel/:id) in `backend/src/routes/ingest.routes.ts`
- [x] T038 [US1] Configure multer for PDF upload (file size limit, file type filter) in `backend/src/middleware/upload.ts`

### Frontend Implementation for User Story 1

- [x] T039 [US1] Create IngestService (upload, structure, restructure, confirm, cancel API calls) in `frontend/src/app/services/ingest.service.ts`
- [x] T040 [P] [US1] Create FileUploadComponent (drag-and-drop zone, file validation, upload progress) in `frontend/src/app/components/file-upload.component.ts`
- [x] T041 [P] [US1] Create PlainTextEditorComponent (editable textarea, re-structure button) in `frontend/src/app/components/plain-text-editor.component.ts`
- [x] T042 [US1] Create StructuredViewerComponent (JSON viewer with syntax highlight, editable fields) in `frontend/src/app/components/structured-viewer.component.ts`
- [x] T043 [US1] Create UploadPage with tabbed interface (Plain Text | Structured Data tabs), status indicator, confirm/cancel actions in `frontend/src/app/pages/upload-page.component.ts`

**Checkpoint**: Full ingestion pipeline works end-to-end — upload PDF → extract → clean → chunk → structure → review/edit → confirm → data persists in Supabase

---

## Phase 4: User Story 2 - Semantic Search & Chat (Priority: P2)

**Goal**: User types a natural language question, system embeds query, finds top matching chunks via Supabase RPC, sends context + system prompt to LLM, returns context-grounded answer.

**Independent Test**: Submit a query against ingested documents, verify the answer is grounded in document content, verify "no results" message when nothing matches.

### Tests for User Story 2

- [x] T044 [P] [US2] Unit test for search service (embedding + RPC call + LLM response) in `backend/tests/services/search.service.spec.ts`
- [x] T045 [P] [US2] Integration test for POST /api/search (happy path + no-match + empty query) in `backend/tests/integration/search.spec.ts`
- [x] T046 [P] [US2] Component test for ChatMessagesComponent (message rendering, loading state) in `frontend/src/app/components/chat-messages.component.spec.ts`
- [x] T047 [P] [US2] Component test for ChatInputComponent (submit, empty validation, loading state) in `frontend/src/app/components/chat-input.component.spec.ts`

### Backend Implementation for User Story 2

- [x] T048 [US2] Implement search service: embed query → call match_document_chunks RPC → compose context → call LLM with system prompt in `backend/src/services/search.service.ts`
- [x] T049 [US2] Implement search controller with query validation in `backend/src/controllers/search.controller.ts`
- [x] T050 [US2] Create search route (POST /api/search) in `backend/src/routes/search.routes.ts`

### Frontend Implementation for User Story 2

- [x] T051 [US2] Create SearchService (send query, receive answer + matched chunks) in `frontend/src/app/services/search.service.ts`
- [x] T052 [P] [US2] Create ChatMessagesComponent (message list with user/assistant roles, markdown rendering) in `frontend/src/app/components/chat-messages.component.ts`
- [x] T053 [P] [US2] Create ChatInputComponent (text input, send button, loading state) in `frontend/src/app/components/chat-input.component.ts`
- [x] T054 [US2] Create ContextReferencesComponent (expandable matched chunks with similarity scores) in `frontend/src/app/components/context-references.component.ts`
- [x] T055 [US2] Create SearchPage composing chat messages, input, and context references in `frontend/src/app/pages/search-page.component.ts`

**Checkpoint**: Semantic search works end-to-end — query → embedding → RPC → context → LLM answer displayed with source chunks

---

## Phase 5: User Story 3 - Document Management (List, Download, Delete) (Priority: P3)

**Goal**: User browses all uploaded documents, downloads original PDFs, and deletes documents (cascade-deletes embeddings, chunks, structured data).

**Independent Test**: View document list, download a PDF, delete a document, verify cascade deletion in database.

### Tests for User Story 3

- [x] T056 [P] [US3] Unit test for document service (list, download, delete with cascade) in `backend/tests/services/document.service.spec.ts`
- [x] T057 [P] [US3] Integration test for GET /api/documents (list) in `backend/tests/integration/documents-list.spec.ts`
- [x] T058 [P] [US3] Integration test for GET /api/documents/:id/download in `backend/tests/integration/documents-download.spec.ts`
- [x] T059 [P] [US3] Integration test for DELETE /api/documents/:id (verify cascade) in `backend/tests/integration/documents-delete.spec.ts`
- [x] T060 [P] [US3] Component test for DocumentListComponent (list display, empty state) in `frontend/src/app/components/document-list.component.spec.ts`

### Backend Implementation for User Story 3

- [x] T061 [US3] Implement document service: list all, get by ID, get download URL, delete with cascade (DB + Storage) in `backend/src/services/document.service.ts`
- [x] T062 [US3] Implement document controller in `backend/src/controllers/document.controller.ts`
- [x] T063 [US3] Create document routes (GET /api/documents, GET /api/documents/:id/download, DELETE /api/documents/:id) in `backend/src/routes/document.routes.ts`

### Frontend Implementation for User Story 3

- [x] T064 [US3] Create DocumentService (list, download, delete API calls) in `frontend/src/app/services/document.service.ts`
- [x] T065 [P] [US3] Create DocumentListComponent (table/card list with filename, date, download/delete actions) in `frontend/src/app/components/document-list.component.ts`
- [x] T066 [US3] Create DocumentActionsComponent (download button, delete button with confirmation dialog) in `frontend/src/app/components/document-actions.component.ts`
- [x] T067 [US3] Create DocumentsPage composing document list with actions in `frontend/src/app/pages/documents-page.component.ts`

**Checkpoint**: Full document lifecycle works — list → download → delete with complete cascade

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T068 [P] Add proper loading states (spinner/skeleton) across all pages in frontend components
- [x] T069 [P] Add empty state messaging (e.g., "No documents uploaded yet. Upload your first document.") in frontend pages
- [x] T070 [P] Add responsive design checks for 320px-1920px viewport in frontend components
- [x] T071 [P] Add keyboard accessibility (tab order, focus indicators) for all interactive elements
- [x] T072 [P] Add hover/focus/active states for all buttons and links per Tailwind conventions
- [x] T073 [P] Verify all AI configuration is env-var driven only (no hardcoded values) in `backend/src/config/`
- [x] T074 Run through quickstart.md validation — clean setup from scratch
- [x] T075 Code cleanup: remove debug logs, ensure consistent error messages, verify Prettier formatting

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - No dependencies on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational - Needs US1 data to exist for testing, but independently testable with pre-seeded data
- **User Story 3 (Phase 5)**: Depends on Foundational - Needs US1 data to exist for testing, but independently testable with pre-seeded data
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — Independent
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Needs existing documents for meaningful testing; can use test fixtures seeded by US1 tests
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Needs existing documents; can use test fixtures seeded by US1 tests

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models/types before services
- Services before controllers/routes
- Backend endpoints before frontend integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Within US1: T030, T031, T034 (models/services) can run in parallel; so can T040, T041 (components)
- Within US2: T052, T053 (components) can run in parallel
- Within US3: T065 (component) is independent
- All test tasks within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members once Foundational is done

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for OCR service in backend/tests/services/ocr.service.spec.ts"
Task: "Unit test for chunking service in backend/tests/services/chunking.service.spec.ts"
Task: "Unit test for structuring service in backend/tests/services/structuring.service.spec.ts"
Task: "Unit test for embedding service in backend/tests/services/embedding.service.spec.ts"
Task: "Integration test for upload endpoint in backend/tests/integration/ingest-upload.spec.ts"
Task: "Integration test for structure endpoints in backend/tests/integration/ingest-structure.spec.ts"
Task: "Integration test for confirm/cancel endpoints in backend/tests/integration/ingest-confirm.spec.ts"
Task: "Component test for FileUploadComponent in frontend/src/app/components/file-upload.component.spec.ts"
Task: "Component test for PlainTextEditorComponent in frontend/src/app/components/plain-text-editor.component.spec.ts"
Task: "Component test for StructuredViewerComponent in frontend/src/app/components/structured-viewer.component.spec.ts"

# Launch all parallel backend services together:
Task: "Implement OCR service in backend/src/services/ocr.service.ts"
Task: "Implement text cleaning service in backend/src/services/text-cleaner.service.ts"
Task: "Implement embedding service in backend/src/services/embedding.service.ts"

# Launch all parallel frontend components together:
Task: "Create FileUploadComponent in frontend/src/app/components/file-upload.component.ts"
Task: "Create PlainTextEditorComponent in frontend/src/app/components/plain-text-editor.component.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T019)
3. Complete Phase 3: User Story 1 (T020-T043)
4. **STOP and VALIDATE**: Upload a PDF, extract, structure, review, confirm — verify data in Supabase
5. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational → App shells running, route works
2. Add User Story 1 → Upload PDF, extract, structure, save → **MVP ready!**
3. Add User Story 2 → Semantic search and chat → **Core value delivered!**
4. Add User Story 3 → Document management → **Full POC complete!**
5. Polish → Production-ready polish

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (upload & ingest pipeline)
   - Developer B: User Story 2 (search & chat) — using pre-seeded test data
   - Developer C: User Story 3 (document management) — using pre-seeded test data
3. Integration test across all stories after merge
4. Polish together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Frontend component templates/HTML co-locate with `.component.ts` files per Angular conventions
- All AI config from environment variables only — verify with T073
- Backend runs on port 3000, frontend dev server on port 4200 with proxy
- Tesseract.js requires worker data download on first run; ensure this is handled in OCR service
