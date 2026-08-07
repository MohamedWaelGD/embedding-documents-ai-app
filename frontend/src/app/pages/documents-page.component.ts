import { Component } from '@angular/core';
import { DocumentListComponent } from '../components/document-list.component';

@Component({
  selector: 'app-documents-page',
  imports: [DocumentListComponent],
  template: `
    <div class="mx-auto max-w-3xl">
      <h1 class="mb-1 text-2xl font-semibold tracking-tight">Documents</h1>
      <p class="mb-6 text-sm text-slate-500">
        Browse, download, or delete your uploaded documents. Deleting a document also removes its
        embeddings and structured data.
      </p>
      <app-document-list />
    </div>
  `,
})
export class DocumentsPageComponent {}
