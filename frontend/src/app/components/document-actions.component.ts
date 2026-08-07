import { Component, inject, input, output, signal } from '@angular/core';
import { DocumentService } from '../services/document.service';
import { DocumentRecord } from '../models';

@Component({
  selector: 'app-document-actions',
  template: `
    <div class="flex items-center justify-end gap-2">
      <button
        type="button"
        (click)="onDownload()"
        [disabled]="busy()"
        class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download
      </button>
      <button
        type="button"
        (click)="onDelete()"
        [disabled]="busy()"
        class="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  `,
})
export class DocumentActionsComponent {
  private readonly documentService = inject(DocumentService);

  readonly document = input.required<DocumentRecord>();
  readonly deleted = output<void>();

  protected readonly busy = signal(false);

  onDownload(): void {
    const doc = this.document();
    this.busy.set(true);
    this.documentService.download(doc.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.filename;
        link.click();
        URL.revokeObjectURL(url);
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  onDelete(): void {
    const doc = this.document();
    if (
      !window.confirm(
        `Delete "${doc.filename}"? This will also remove its embeddings and structured data.`,
      )
    ) {
      return;
    }
    this.busy.set(true);
    this.documentService.delete(doc.id).subscribe({
      next: () => {
        this.busy.set(false);
        this.deleted.emit();
      },
      error: () => this.busy.set(false),
    });
  }
}
