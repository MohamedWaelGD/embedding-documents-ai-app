import { config } from '../config';
import { getSupabase } from '../config/supabase';
import { AppError, ErrorCode } from '../models/errors';
import { Document } from '../models';

export async function listDocuments(): Promise<Document[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    throw new AppError(ErrorCode.STORAGE_ERROR, 'Failed to list documents', 502, {
      cause: error.message,
    });
  }
  return (data ?? []) as Document[];
}

export async function getDocument(id: string): Promise<Document> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();
  if (error || !data) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Document not found', 404);
  }
  return data as Document;
}

export async function downloadDocument(
  id: string,
): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
  const doc = await getDocument(id);
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from(config.supabase.storageBucket)
    .download(doc.storage_path);
  if (error || !data) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Document file not found', 404, {
      cause: error?.message,
    });
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  return { buffer, filename: doc.filename, contentType: 'application/pdf' };
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = getSupabase();

  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError || !doc) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Document not found', 404);
  }

  const document = doc as Document;

  const { error: deleteError } = await supabase.from('documents').delete().eq('id', id);
  if (deleteError) {
    throw new AppError(ErrorCode.STORAGE_ERROR, 'Failed to delete document record', 502, {
      cause: deleteError.message,
    });
  }

  if (document.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(config.supabase.storageBucket)
      .remove([document.storage_path]);
    if (storageError) {
      console.warn(`Failed to remove storage file for document ${id}:`, storageError.message);
    }
  }
}
