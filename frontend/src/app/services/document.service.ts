import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DocumentRecord } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly api = inject(ApiService);

  list(): Observable<{ documents: DocumentRecord[] }> {
    return this.api.get<{ documents: DocumentRecord[] }>('/documents');
  }

  download(id: string): Observable<Blob> {
    return this.api.download(`/documents/${id}/download`);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/documents/${id}`);
  }
}
