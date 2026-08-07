<!--
  Sync Impact Report
  ==================
  Version change: [unset] → 1.0.0 (initial constitution)
  Modified principles: N/A (first real constitution, replaced all template placeholders)
  Added sections:
    - 5 Core Principles (Code Quality, Testing Standards, UX Consistency, Performance, AI Provider Config)
    - Technology Stack
    - Development Workflow
    - Governance
  Removed sections: None (placeholder sections replaced with concrete content)
  Templates requiring updates:
    - .specify/templates/plan-template.md   ✅ aligned (Constitution Check section references this file)
    - .specify/templates/spec-template.md   ✅ aligned (no constitution-specific constraints)
    - .specify/templates/tasks-template.md  ✅ aligned (phase structure compatible)
    - .specify/templates/agent-file-template.md ✅ aligned (auto-generated, no principles embedded)
    - .specify/templates/checklist-template.md  ✅ aligned (auto-generated, no principles embedded)
  Follow-up TODOs: None
-->

# Embedding Documents AI App Constitution

## Core Principles

### I. Code Quality

All code MUST follow established conventions for the project's languages and frameworks.

**Angular (Frontend):**
- Components, services, and modules MUST follow Angular style guide conventions.
- Signals and reactive patterns are preferred over manual subscriptions where feasible.
- Component selectors MUST use the project prefix (default: `app-`).
- All TypeScript code MUST pass `ng lint` and type-checking without errors.
- Services MUST be provided via Angular's dependency injection; no manual instantiation.
- Tailwind CSS utility classes MUST be used for styling; custom CSS is permitted only for
  Tailwind-inaccessible properties.

**Node.js / Express (Backend):**
- Follow Express best practices: separate route handlers, middleware, and service layers.
- API routes MUST be organized by resource domain (e.g., `/api/documents`, `/api/embeddings`).
- All async operations MUST use proper error handling (try/catch or `.catch()`); unhandled
  promise rejections are not tolerated.
- Input validation MUST be applied to all request bodies, query params, and URL params.
- Middleware MUST be composable and reusable; avoid monolithic handler functions.

**Cross-cutting:**
- Code MUST be formatted with Prettier using the project's configuration.
- Every file MUST have a single clear responsibility.
- Magic numbers and hardcoded strings MUST be extracted into named constants or configuration.

### II. Testing Standards

Testing is mandatory and MUST follow a structured approach.

**Frontend Testing (Vitest):**
- Unit tests MUST be written for all services, pipes, and utility functions.
- Component tests MUST cover DOM rendering, user interactions, and input/output bindings.
- Test files MUST be co-located with source files (e.g., `foo.service.spec.ts` next to
  `foo.service.ts`).
- Mocking: External dependencies (HTTP, router, services) MUST be mocked using Vitest spies
  or Angular's TestBed utilities; tests MUST NOT make real network calls.

**Backend Testing:**
- Unit tests MUST cover all service-layer business logic.
- Integration tests MUST verify API endpoints using an in-memory or test database.
- Contract tests SHOULD be written for public API endpoints to enforce request/response shapes.

**Coverage Gates:**
- New features MUST include tests that exercise both happy paths and error paths.
- Critical paths (authentication, data persistence, AI calls) MUST achieve >80% line coverage.
- Tests MUST be runnable via a single command (`npm test` in each project root).
- CI pipeline (if configured) MUST fail on test failures.

### III. User Experience Consistency

The user interface MUST deliver a consistent, polished experience across all views.

- All UI components MUST follow the established design tokens (spacing scale, color palette,
  typography scale, border radius set) provided by the Tailwind CSS configuration.
- Common interactive patterns (loading, empty, error, success states) MUST be handled by
  shared, reusable components or directives — not duplicated per feature.
- Loading states MUST be shown during any async operation that exceeds 300ms.
- Error states MUST display user-friendly messages; raw stack traces or technical errors
  MUST NOT be exposed in the UI.
- Empty states MUST provide clear guidance on the expected next action (e.g., "Upload a
  document to get started").
- All interactive elements MUST have appropriate hover, focus, and active styles.
- The application MUST be responsive and functional at viewport widths from 320px to
  1920px minimum.
- Accessibility: Semantic HTML elements and ARIA attributes MUST be used where appropriate;
  form controls MUST have labels; interactive elements MUST be keyboard-navigable.

### IV. Performance Requirements

Performance is a first-class concern and MUST be measured and maintained.

**Frontend:**
- Initial page load (LCP) MUST be under 2.5 seconds on a simulated Fast 3G connection.
- Time to Interactive (TTI) MUST be under 3 seconds.
- Angular lazy loading MUST be used for feature modules; no monolithic application bundle.
- Image assets MUST be optimized and served in modern formats (WebP, AVIF) where supported.
- Unnecessary re-renders MUST be avoided: use `OnPush` change detection or Signals to
  minimize change detection cycles.
- Third-party dependencies MUST be audited for bundle size impact before introduction.

**Backend:**
- API response times for standard CRUD operations MUST be under 200ms p95.
- AI/embedding operations MUST have configurable timeouts (default: 30s) and MUST be
  handled asynchronously where response time exceeds 1s.
- Database queries MUST use appropriate indexes; N+1 query patterns are prohibited.
- Neon Postgres connection pooling MUST be used for serverless/edge deployment contexts.

**Monitoring:**
- All API endpoints MUST log request duration, status code, and (for errors) full trace.
- Frontend MUST log uncaught errors to the console and, if a monitoring service is
  configured, to that service.

### V. Environment-Driven AI Provider Configuration

AI provider integration MUST be swappable without code changes.

- ALL AI provider configuration MUST be read from environment variables only.
- The following environment variables MUST be used:
  - `AI_PROVIDER_URL` — Custom provider base URL (e.g., OpenRouter, local model). If unset
    or empty, the OpenAI SDK default (`https://api.openai.com/v1`) is used.
  - `AI_API_KEY` — Authentication key for the AI provider.
  - `AI_MODEL` — Model identifier (e.g., `gpt-4o`, `text-embedding-3-large`).
  - `AI_EMBEDDING_MODEL` — Embedding-specific model, defaults to `AI_MODEL` if unset.
- The OpenAI SDK MUST be instantiated with `baseURL` set to `AI_PROVIDER_URL` when
  the variable is defined and non-empty; otherwise, use the SDK's default (OpenAI).
- No provider-specific logic (Hugging Face headers, OpenRouter auth patterns) is permitted
  in application code. Provider differences are handled exclusively via:
  - `AI_PROVIDER_URL` (endpoint routing)
  - `AI_API_KEY` (authentication)
  - `AI_MODEL` / `AI_EMBEDDING_MODEL` (model selection)
- Adding a new provider MUST require only environment variable changes — zero code changes.
- Environment files (`.env`) MUST NOT be committed to version control. A `.env.example`
  file listing all required variables with placeholder values MUST be maintained.

## Technology Stack

The project uses the following technology stack. All code and configuration MUST be
compatible with these versions and integrations.

| Layer              | Technology                                            |
|--------------------|-------------------------------------------------------|
| Frontend Framework | Angular 21+                                           |
| UI Styling         | Tailwind CSS 4+                                       |
| Backend Runtime    | Node.js with Express                                  |
| Relational Database| Neon Postgres (serverless PostgreSQL)                 |
| Vector Database    | Supabase (pgvector) for embedding storage and search  |
| AI SDK             | OpenAI Node.js SDK (v4+)                              |
| Frontend Testing   | Vitest                                                |
| Formatting         | Prettier                                              |

**Key Constraints:**
- Supabase client MUST be configured to connect to the project's Supabase instance via
  environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- Neon Postgres connection MUST use the pooled connection string (`DATABASE_URL`) from
  environment variables.
- The OpenAI SDK MUST be used for all AI interactions (chat completions, embeddings); no
  alternative SDKs or raw HTTP calls to AI APIs.

## Development Workflow

- All features MUST start from a specification under `specs/###-feature-name/spec.md`.
- Implementation plans MUST pass the Constitution Check gate before Phase 0 research begins.
- Code reviews MUST verify compliance with all five core principles before merge.
- Environment configuration (`.env` files) MUST be set up by each developer locally and
  MUST NOT be shared or committed.
- Database schema changes MUST be applied via migrations tracked in version control.
- The `README.md` in each project root (`frontend/`, `backend/`) MUST contain up-to-date
  setup and run instructions.

## Governance

This constitution supersedes all other project practices. Any deviation from these
principles MUST be documented with a clear rationale in the relevant implementation plan
under the "Complexity Tracking" section.

**Amendment Procedure:**
1. Proposed amendments MUST be documented in a pull request with a summary of changes.
2. All affected templates (plan, spec, tasks, checklist) MUST be reviewed for consistency.
3. The `CONSTITUTION_VERSION` MUST be incremented per semantic versioning:
   - MAJOR: Principle removal or redefinition that breaks existing compliance.
   - MINOR: New principle or section added.
   - PATCH: Clarifications, wording fixes, non-semantic refinements.
4. The `LAST_AMENDED_DATE` MUST be updated to the date the amendment is accepted.

**Compliance Review:**
- Every implementation plan (`plan.md`) MUST include a completed Constitution Check section
  that gates progress to Phase 0.
- Feature completion reviews MUST confirm no unresolved constitution violations remain.
- Periodic audits (at milestone boundaries) SHOULD re-verify all active principles.

**Version**: 1.0.0 | **Ratified**: 2026-08-07 | **Last Amended**: 2026-08-07
