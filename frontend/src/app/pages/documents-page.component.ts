import { Component } from '@angular/core';
import { DocumentListComponent } from '../components/document-list.component';

@Component({
  selector: 'app-documents-page',
  imports: [DocumentListComponent],
  template: `
    <div class="mx-auto max-w-4xl">
      <header class="mb-8">
        <h1 class="font-serif-display text-3xl font-semibold italic text-navy-900">Documents</h1>
        <p class="mt-1.5 max-w-lg font-serif-body text-sm leading-relaxed text-navy-500">
          Browse, download, or delete your uploaded documents. Deleting a document also removes its
          embeddings and structured data.
        </p>
      </header>
      <app-document-list />
    </div>
  `,
})
export class DocumentsPageComponent {}
