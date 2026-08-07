import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SearchResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly api = inject(ApiService);

  search(query: string): Observable<SearchResponse> {
    return this.api.post<SearchResponse>('/search', { query });
  }
}
