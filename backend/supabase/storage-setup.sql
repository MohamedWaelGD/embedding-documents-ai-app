-- ============================================================
-- Supabase Storage Setup: document-ocr-search
--
-- Execute AFTER running migration.sql. This script creates the
-- storage bucket used for storing uploaded PDF files.
--
-- Alternatively, create the bucket via the Supabase dashboard:
--   Storage > New Bucket
--   Name: documents
--   Public: Disabled (files are served via the backend API)
--   File size limit: 50MB (match MAX_FILE_SIZE_MB env var)
-- ============================================================

-- Create the storage bucket if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Restrict the bucket to the documents folder for clarity
-- (storage policies are intentionally open for this no-auth POC:
--  access is only possible with the service role key from the backend)
