# embedding-documents-ai-app — AGENTS.md

## Project Identity

Document embedding AI application with vector search. Monorepo: Angular 21 frontend + Node.js/Express backend.
Neon Postgres (relational) + Supabase pgvector (embeddings) + OpenAI SDK for AI.

## Skill Usage (ALWAYS)

Load skills before writing code. Available and expected usage:

| Skill                    | When                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| `angular-developer`      | Any Angular component, service, pipe, signal, route, or DI work          |
| `nodejs-backend-patterns`| Creating Express routes, middleware, error handling, service layers      |
| `tailwind-design-system` | Styling, design tokens, layout, responsive work                          |
| `supabase`               | Supabase client setup, schema, RLS, pgvector queries, auth               |
| `neon-postgres`          | Neon connection strings, pooling, migrations, branching                  |
| `impeccable`             | UI polish, visual hierarchy, empty/error/loading states, animations      |
| `frontend-design`        | Distinctive visual design, typography, aesthetic direction               |
| `review-animations`      | Review animation/motion code quality                                     |

Invoke via the `skill` tool before writing related code.

## Essential Commands

All commands run from their project subdirectory (`frontend/` or `backend/`), not the repo root.

### Frontend (`frontend/`)

```pwsh
npm start              # dev server on http://localhost:4200
npm test               # Vitest (single run)
npm run build          # production build → dist/
npx ng generate <schematic>  # Angular CLI scaffolding
```

Use `workdir: frontend` in bash tool calls.

### Backend (`backend/`)

```pwsh
# Not yet scaffolded — create with Express + TypeScript when needed
npm test               # unit + integration tests (framework TBD)
```

## Architecture & Conventions

### Frontend (Angular 21, standalone components)

- **Entry**: `frontend/src/main.ts` boots `App` with `appConfig`
- **Config**: `app.config.ts` — add providers here (router, http, global error listeners)
- **Prefix**: `app-` (selector) from `angular.json`
- **Style**: Tailwind CSS 4 via PostCSS (`@import 'tailwindcss'` in `styles.css`)
- **Reactivity**: Prefer `signal()`, `computed()`, `effect()` over manual subscriptions
- **Change Detection**: Use `OnPush` for feature components
- **Test files**: Co-located with source as `*.spec.ts` (Vitest + TestBed)
- **Build budgets**: initial 500kB warn / 1MB error; component styles 4kB/8kB

### Backend (Node.js/Express — planned)

- Layer: `routes/` → `controllers/` → `services/` → `models/`
- Input validation on all request params (body, query, params)
- Async error handling mandatory on every route
- Use Express middleware composition; avoid monolith handlers

### Formatting

- **Prettier**: `printWidth: 100`, `singleQuote: true`, Angular parser for `.html`
- **EditorConfig**: 2-space indent, UTF-8, LF endings, trim trailing whitespace
- No lint script configured yet; TypeScript strict mode is enabled

### AI Provider Configuration (non-negotiable)

All AI config comes from **env vars only**. The OpenAI SDK must be instantiated agnostically:

| Variable             | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `AI_PROVIDER_URL`    | Custom base URL. If unset → OpenAI default     |
| `AI_API_KEY`         | Provider auth key                              |
| `AI_MODEL`           | Chat/completion model ID                       |
| `AI_EMBEDDING_MODEL` | Embedding model ID (falls back to `AI_MODEL`)  |

To swap providers (OpenAI → OpenRouter → Hugging Face), change env vars only. Never add
provider-specific headers or logic in code. All AI calls go through the OpenAI SDK v4+.

Maintain a `.env.example` (never commit `.env`).

### Database

| Service | Env Vars                                         | Role               |
| ------- | ------------------------------------------------ | ------------------ |
| Neon PG | `DATABASE_URL` (pooled connection)               | Relational data    |
| Supabase| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Vector embeddings  |

### Feature Workflow (from constitution)

1. Spec → `specs/###-feature-name/spec.md`
2. Plan must pass Constitution Check before Phase 0
3. Tests mandatory for every user story (happy + error paths)
4. Only Tailwind utilities; custom CSS only for inaccessible properties

## Key Constraints

- Never commit `.env` files. Always create `.env.example` with placeholder values.
- Tests are mandatory — new features without tests violate the constitution.
- API response times: CRUD <200ms p95. AI ops have 30s timeout; async if >1s.
- Frontend LCP <2.5s, TTI <3s.
- Interactive elements must have hover, focus, active states.
- Loading states required for async ops >300ms.
- Default AI provider is OpenAI; SDK uses no custom `baseURL` when `AI_PROVIDER_URL` is empty.
