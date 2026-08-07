import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ConfirmResponse, ExtractResponse, StructureResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class IngestService {
  private readonly api = inject(ApiService);

  upload(file: File): Observable<ExtractResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<ExtractResponse>('/ingest/upload', formData);
  }

  structure(documentId: string, rawText: string): Observable<StructureResponse> {
    return this.api.post<StructureResponse>('/ingest/structure', {
      document_id: documentId,
      raw_text: rawText,
    });
  }

  confirm(
    file: File,
    payload: { document_id: string; filename: string; raw_text: string; structured_data: unknown },
  ): Observable<ConfirmResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_id', payload.document_id);
    formData.append('filename', payload.filename);
    formData.append('raw_text', payload.raw_text);
    formData.append('structured_data', JSON.stringify(payload.structured_data));
    return this.api.upload<ConfirmResponse>('/ingest/confirm', formData);
  }

  cancel(documentId: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/ingest/cancel/${documentId}`);
  }
}
