export interface DocumentRecord {
  id: string;
  filename: string;
  created_at: string;
}

export interface RegulationAction {
  id: string;
  type_id: string;
  action_ar: string;
  action_en: string;
  action_type: 'Penalty' | 'Addition';
  penalty_value_type: 'Amount' | 'Text' | 'Days' | 'Percentage' | null;
  addition_value_type: 'Amount' | 'Text' | 'Days' | 'Percentage' | null;
  text_value: string | null;
  decimal_value: number | null;
  days_value: number | null;
  percentage_value: number | null;
}

export interface RegulationType {
  id: string;
  regulation_id: string;
  name_ar: string;
  name_en: string;
  regulationActions: RegulationAction[];
}

export interface StructuredRegulation {
  id: string;
  document_id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  regulationTypes: RegulationType[];
}

export interface MatchedChunk {
  id: string;
  document_id: string;
  content: string;
  page_number: number | null;
  similarity: number;
}

export interface SearchResponse {
  answer: string;
  matched_chunks: MatchedChunk[];
}

export interface ExtractResponse {
  document_id: string;
  raw_text: string;
  page_count: number;
  filename: string;
  extraction_method: 'direct' | 'ocr';
}

export interface TextChunk {
  content: string;
  index: number;
}

export interface StructureResponse {
  document_id: string;
  raw_text: string;
  structured_data: StructuredRegulation | null;
  chunks: TextChunk[];
}

export interface ConfirmResponse {
  document_id: string;
  chunks_count: number;
  filename: string;
}

export interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}
