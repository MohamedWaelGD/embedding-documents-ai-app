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
        class="rounded-md border border-navy-300 px-3 py-1.5 text-xs font-medium text-navy-600 transition-colors hover:border-navy-500 hover:text-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 active:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download
      </button>
      <button
        type="button"
        (click)="onDelete()"
        [disabled]="busy()"
        class="rounded-md border border-burgundy-300 px-3 py-1.5 text-xs font-medium text-burgundy-600 transition-colors hover:border-burgundy-500 hover:text-burgundy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-500 active:bg-burgundy-50 disabled:cursor-not-allowed disabled:opacity-50"
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
