# Frontend

Angular 21 frontend for the Document OCR, Ingestion & Semantic Search app.

## Setup

```bash
npm install
```

## Environment

In development, `/api/*` requests are proxied to `http://localhost:3000` via `proxy.conf.json`.
No frontend `.env` is required for local development.

## Development server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The backend must be running on `http://localhost:3000` (see `backend/`).

## Building

```bash
npm run build
```

## Running unit tests

```bash
npm test
```

## Routes

- `/upload` — Upload a PDF, review extracted text and structured data, confirm save
- `/search` — Semantic search over uploaded documents
- `/documents` — List, download, and delete documents
