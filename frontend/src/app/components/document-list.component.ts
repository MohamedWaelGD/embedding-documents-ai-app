import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../services/document.service';
import { DocumentRecord } from '../models';
import { StatusIndicatorComponent } from './status-indicator.component';
import { DocumentActionsComponent } from './document-actions.component';

@Component({
  selector: 'app-document-list',
  imports: [CommonModule, StatusIndicatorComponent, DocumentActionsComponent],
  template: `
    @if (loading()) {
      <app-status-indicator variant="loading" message="Loading documents…" />
    } @else if (error(); as message) {
      <app-status-indicator variant="error" [message]="message" />
    } @else if (documents().length === 0) {
      <app-status-indicator
        variant="empty"
        message="No documents uploaded yet. Upload your first document to get started."
        icon="📁"
      />
    } @else {
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table class="w-full text-left text-sm">
          <thead
            class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"
          >
            <tr>
              <th class="px-4 py-3 font-medium">Name</th>
              <th class="px-4 py-3 font-medium">Uploaded</th>
              <th class="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (doc of documents(); track doc.id) {
              <tr>
                <td class="px-4 py-3 font-medium text-slate-800">{{ doc.filename }}</td>
                <td class="px-4 py-3 text-slate-500">{{ doc.created_at | date: 'medium' }}</td>
                <td class="px-4 py-3 text-right">
                  <app-document-actions [document]="doc" (deleted)="reload()" />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class DocumentListComponent {
  private readonly documentService = inject(DocumentService);

  protected readonly documents = signal<DocumentRecord[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.documentService.list().subscribe({
      next: (response) => {
        this.documents.set(response.documents);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
