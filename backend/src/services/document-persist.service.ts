import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { getSupabase } from '../config/supabase';
import { AppError, ErrorCode } from '../models/errors';
import { StructuredRegulation } from '../models';
import { chunkText } from './chunking.service';
import { embedTexts } from './embedding.service';

export interface PersistResult {
  document_id: string;
  chunks_count: number;
}

export async function persistDocument(
  fileBuffer: Buffer,
  filename: string,
  rawText: string,
  structured: StructuredRegulation,
): Promise<PersistResult> {
  const supabase = getSupabase();
  const documentId = structured.document_id || uuidv4();
  const storagePath = `${documentId}/${uuidv4()}-${filename}`;

  const uploadResult = await supabase.storage
    .from(config.supabase.storageBucket)
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: false,
    });
  if (uploadResult.error) {
    throw new AppError(ErrorCode.STORAGE_ERROR, 'Failed to store PDF file', 502, {
      cause: uploadResult.error.message,
    });
  }

  const docResult = await supabase
    .from('documents')
    .insert({ id: documentId, filename, storage_path: storagePath })
    .select()
    .single();
  if (docResult.error) {
    await supabase.storage.from(config.supabase.storageBucket).remove([storagePath]);
    throw new AppError(ErrorCode.STORAGE_ERROR, 'Failed to insert document record', 502, {
      cause: docResult.error.message,
    });
  }

  try {
    await insertStructuredData(supabase, documentId, structured);

    const chunks = await chunkText(rawText);
    const embeddings = await embedTexts(chunks.map((c) => c.content));

    const rows = chunks.map((chunk, i) => ({
      document_id: documentId,
      content: chunk.content,
      embedding: embeddings[i] ?? [],
      chunk_index: chunk.index,
      page_number: null,
    }));

    const chunkResult = await supabase.from('document_chunks').insert(rows);
    if (chunkResult.error) {
      throw new AppError(ErrorCode.EMBEDDING_ERROR, 'Failed to persist document chunks', 502, {
        cause: chunkResult.error.message,
      });
    }

    return { document_id: documentId, chunks_count: rows.length };
  } catch (err) {
    await supabase.from('documents').delete().eq('id', documentId);
    await supabase.storage.from(config.supabase.storageBucket).remove([storagePath]);
    throw err;
  }
}

async function insertStructuredData(
  supabase: ReturnType<typeof getSupabase>,
  documentId: string,
  structured: StructuredRegulation,
): Promise<void> {
  const regResult = await supabase
    .from('structured_regulations')
    .insert({
      id: structured.id,
      document_id: documentId,
      name_ar: structured.name_ar,
      name_en: structured.name_en,
      description_ar: structured.description_ar,
      description_en: structured.description_en,
    })
    .select()
    .single();
  if (regResult.error) {
    throw new AppError(ErrorCode.STORAGE_ERROR, 'Failed to persist regulation', 502, {
      cause: regResult.error.message,
    });
  }

  for (const type of structured.regulationTypes) {
    const typeId = type.id || uuidv4();
    const typeResult = await supabase
      .from('regulation_types')
      .insert({
        id: typeId,
        regulation_id: structured.id,
        name_ar: type.name_ar,
        name_en: type.name_en,
      })
      .select()
      .single();
    if (typeResult.error) {
      throw new AppError(ErrorCode.STORAGE_ERROR, 'Failed to persist regulation type', 502, {
        cause: typeResult.error.message,
      });
    }

    for (const action of type.regulationActions) {
      const actionResult = await supabase.from('regulation_actions').insert({
        id: action.id || uuidv4(),
        type_id: typeId,
        action_ar: action.action_ar,
        action_en: action.action_en,
        action_type: action.action_type,
        penalty_value_type: action.penalty_value_type,
        addition_value_type: action.addition_value_type,
        text_value: action.text_value,
        decimal_value: action.decimal_value,
        days_value: action.days_value,
        percentage_value: action.percentage_value,
      });
      if (actionResult.error) {
        throw new AppError(ErrorCode.STORAGE_ERROR, 'Failed to persist regulation action', 502, {
          cause: actionResult.error.message,
        });
      }
    }
  }
}
