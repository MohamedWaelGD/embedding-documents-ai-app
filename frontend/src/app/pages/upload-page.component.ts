import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FileUploadComponent } from '../components/file-upload.component';
import { PlainTextEditorComponent } from '../components/plain-text-editor.component';
import { StructuredFormComponent } from '../components/structured-form.component';
import { ChunksViewerComponent } from '../components/chunks-viewer.component';
import { StatusIndicatorComponent } from '../components/status-indicator.component';
import { IngestService } from '../services/ingest.service';
import { ConfirmResponse, ExtractResponse, StructuredRegulation, StructureResponse, TextChunk } from '../models';

type Step = 'idle' | 'extracting' | 'review' | 'structuring' | 'saving' | 'done';

@Component({
  selector: 'app-upload-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FileUploadComponent, PlainTextEditorComponent, StructuredFormComponent, ChunksViewerComponent, StatusIndicatorComponent],
  template: `
    <div class="mx-auto max-w-6xl">
      @if (step() === 'idle' || step() === 'extracting') {
        <header class="grid items-end gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)] lg:gap-16">
          <h1 class="max-w-3xl text-balance font-serif-display text-4xl font-medium leading-[1.06] tracking-[-0.035em] text-navy-900 sm:text-5xl lg:text-6xl">
            Bring a regulation into focus.
          </h1>
          <p class="max-w-xl text-base leading-7 text-navy-500">
            Begin with a PDF. You will see the source text and its structured interpretation before anything becomes searchable.
          </p>
        </header>

        <div class="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div [class]="step() === 'extracting' ? 'pointer-events-none opacity-55' : ''">
            <app-file-upload (fileSelected)="onFileSelected($event)" />
          </div>

          <aside class="rounded-xl bg-parchment-200 p-6 sm:p-7" aria-labelledby="review-path-title">
            <h2 id="review-path-title" class="font-serif-display text-2xl font-medium tracking-[-0.02em] text-navy-900">What happens next</h2>
            <ol class="mt-5">
              <li class="grid grid-cols-[1.75rem_1fr] gap-3 border-t border-navy-200 py-4">
                <span class="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-navy-700">1</span>
                <span class="text-sm leading-6 text-navy-700">We extract the text, using OCR when needed.</span>
              </li>
              <li class="grid grid-cols-[1.75rem_1fr] gap-3 border-t border-navy-200 py-4">
                <span class="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-navy-700">2</span>
                <span class="text-sm leading-6 text-navy-700">AI organizes regulations, types, and actions.</span>
              </li>
              <li class="grid grid-cols-[1.75rem_1fr] gap-3 border-t border-navy-200 py-4">
                <span class="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-navy-700">3</span>
                <span class="text-sm leading-6 text-navy-700">You inspect every field before saving.</span>
              </li>
            </ol>
            <p class="mt-4 border-t border-navy-200 pt-5 text-xs leading-5 text-navy-600">
              <strong class="text-navy-900">You remain in control.</strong><br />Nothing is indexed until you confirm the result.
            </p>
          </aside>
        </div>

        @if (step() === 'extracting') {
          <div class="mt-5 rounded-xl border border-navy-200 bg-white"><app-status-indicator variant="loading" message="Extracting text from your PDF…" /></div>
        }
      } @else {
        <header class="flex flex-col gap-5 border-b border-navy-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="font-serif-display text-4xl font-medium tracking-[-0.035em] text-navy-900 sm:text-5xl">Review the evidence.</h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-navy-500">Compare the extracted source with its structured interpretation, correct anything that needs attention, then confirm it for search.</p>
          </div>
          <div class="flex items-center gap-2 text-xs text-navy-500">
            <span class="rounded-full bg-parchment-200 px-3 py-1.5 font-semibold text-navy-800">Source complete</span>
            <span aria-hidden="true">→</span>
            <span class="rounded-full border border-navy-200 bg-white px-3 py-1.5 font-semibold">Review</span>
            <span aria-hidden="true">→</span>
            <span>Index</span>
          </div>
        </header>
      }

      @if (error(); as message) {
        <div class="mt-6"><app-status-indicator variant="error" [message]="message" /></div>
      }

      @if (step() === 'review' || step() === 'structuring' || step() === 'saving') {
        <section class="mt-8">
          <nav class="flex overflow-x-auto border-b border-navy-200" role="tablist" aria-label="Document review views">
            @for (tab of reviewTabs; track tab.id) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === tab.id"
                (click)="activeTab.set(tab.id)"
                class="min-w-fit border-b-2 px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                [class]="activeTab() === tab.id ? 'border-gold-500 text-navy-900' : 'border-transparent text-navy-400 hover:text-navy-800'"
              >{{ tab.label }}</button>
            }
          </nav>

          @if (step() === 'structuring') {
            <div class="my-5 rounded-xl border border-navy-200 bg-white"><app-status-indicator variant="loading" message="Structuring the document…" /></div>
          }

          <div class="mt-6 animate-fade-in">
            @if (activeTab() === 'text') {
              <app-plain-text-editor [text]="rawText()" [restructuring]="step() === 'structuring'" (textChange)="rawText.set($event)" (restructureRequested)="restructure()" />
            } @else if (activeTab() === 'structured') {
              <app-structured-form [(data)]="structured" />
            } @else {
              <app-chunks-viewer [chunks]="chunks()" />
            }
          </div>

          <div class="mt-9 flex flex-col-reverse gap-3 border-t border-navy-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" (click)="cancel()" class="rounded-md border border-navy-300 px-5 py-2.5 text-sm font-semibold text-navy-600 transition-colors hover:bg-white hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500">Cancel review</button>
            <button type="button" (click)="confirm()" [disabled]="!canConfirm() || step() === 'saving'" class="rounded-md bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:cursor-not-allowed disabled:opacity-50">
              {{ step() === 'saving' ? 'Saving document…' : 'Confirm and index' }}
            </button>
          </div>
        </section>
      }

      @if (step() === 'done') {
        <section class="mx-auto mt-10 max-w-2xl rounded-xl border border-navy-200 bg-white p-8 text-center sm:p-12">
          <app-status-indicator variant="success" [message]="'Document saved successfully. ' + savedChunks() + ' passages are now searchable.'" />
          <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" (click)="reset()" class="rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500">Upload another document</button>
            <a routerLink="/search" class="rounded-md border border-navy-300 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:bg-parchment-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500">Ask a question</a>
          </div>
        </section>
      }
    </div>
  `,
})
export class UploadPageComponent {
  private readonly ingestService = inject(IngestService);
  protected readonly reviewTabs = [
    { id: 'text' as const, label: 'Source text' },
    { id: 'structured' as const, label: 'Structured data' },
    { id: 'chunks' as const, label: 'Search passages' },
  ];
  protected readonly step = signal<Step>('idle');
  protected readonly activeTab = signal<'text' | 'structured' | 'chunks'>('text');
  protected readonly rawText = signal('');
  protected readonly structured = signal<StructuredRegulation | null>(null);
  protected readonly chunks = signal<TextChunk[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly savedChunks = signal(0);
  private documentId = '';
  private selectedFile: File | null = null;
  private filename = '';

  protected canConfirm(): boolean { return !!this.selectedFile && !!this.structured() && this.step() === 'review'; }
  onFileSelected(file: File): void {
    this.selectedFile = file; this.filename = file.name; this.error.set(null); this.step.set('extracting');
    this.ingestService.upload(file).subscribe({
      next: (response: ExtractResponse) => { this.documentId = response.document_id; this.rawText.set(response.raw_text); this.step.set('review'); this.structure(); },
      error: (err: Error) => { this.error.set(err.message); this.step.set('idle'); },
    });
  }
  structure(): void {
    this.error.set(null); this.step.set('structuring');
    this.ingestService.structure(this.documentId, this.rawText()).subscribe({
      next: (response: StructureResponse) => { this.structured.set(response.structured_data); this.chunks.set(response.chunks ?? []); this.step.set('review'); },
      error: (err: Error) => { this.error.set(err.message); this.step.set('review'); },
    });
  }
  restructure(): void { this.structure(); }
  confirm(): void {
    const file = this.selectedFile; const structured = this.structured(); if (!file || !structured) return;
    this.error.set(null); this.step.set('saving');
    this.ingestService.confirm(file, { document_id: this.documentId, filename: this.filename, raw_text: this.rawText(), structured_data: structured }).subscribe({
      next: (response: ConfirmResponse) => { this.savedChunks.set(response.chunks_count); this.step.set('done'); },
      error: (err: Error) => { this.error.set(err.message); this.step.set('review'); },
    });
  }
  cancel(): void { this.ingestService.cancel(this.documentId).subscribe({ next: () => this.reset(), error: () => this.reset() }); }
  reset(): void {
    this.step.set('idle'); this.activeTab.set('text'); this.rawText.set(''); this.structured.set(null); this.chunks.set([]); this.error.set(null); this.selectedFile = null; this.documentId = '';
  }
}
