import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentListComponent } from '../components/document-list.component';

@Component({
  selector: 'app-documents-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DocumentListComponent],
  template: `
    <div class="mx-auto max-w-6xl">
      <header class="flex flex-col gap-6 border-b border-navy-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="font-serif-display text-4xl font-medium tracking-[-0.035em] text-navy-900 sm:text-5xl">Your evidence library.</h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-navy-500">Browse reviewed documents, download the original source, or remove a document and all of its searchable data.</p>
        </div>
        <a routerLink="/upload" class="inline-flex min-h-10 items-center justify-center rounded-md bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500">Add document</a>
      </header>
      <section class="mt-8" aria-label="Documents"><app-document-list /></section>
    </div>
  `,
})
export class DocumentsPageComponent {}
