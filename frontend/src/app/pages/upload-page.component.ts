import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FileUploadComponent } from '../components/file-upload.component';
import { PlainTextEditorComponent } from '../components/plain-text-editor.component';
import { StructuredFormComponent } from '../components/structured-form.component';
import { ChunksViewerComponent } from '../components/chunks-viewer.component';
import { StatusIndicatorComponent } from '../components/status-indicator.component';
import { IngestService } from '../services/ingest.service';
import {
  ConfirmResponse,
  ExtractResponse,
  StructuredRegulation,
  StructureResponse,
  TextChunk,
} from '../models';

type Step = 'idle' | 'extracting' | 'review' | 'structuring' | 'saving' | 'done';

@Component({
  selector: 'app-upload-page',
  imports: [
    CommonModule,
    RouterLink,
    FileUploadComponent,
    PlainTextEditorComponent,
    StructuredFormComponent,
    ChunksViewerComponent,
    StatusIndicatorComponent,
  ],
  template: `
    <div class="mx-auto max-w-5xl">
      <header class="mb-8">
        <h1 class="font-serif-display text-3xl font-semibold italic text-navy-900">Upload a Document</h1>
        <p class="mt-1.5 max-w-lg font-serif-body text-sm leading-relaxed text-navy-500">
          Upload a regulatory PDF. The system extracts the text, structures it into regulation types
          and actions, and generates embeddings for semantic search.
        </p>
      </header>

      @if (step() === 'idle' || step() === 'extracting') {
        <div class="mx-auto max-w-xl">
          <app-file-upload
            (fileSelected)="onFileSelected($event)"
            [class]="step() === 'extracting' ? 'pointer-events-none opacity-50' : ''"
          />
          @if (step() === 'extracting') {
            <div class="mt-6">
              <app-status-indicator variant="loading" message="Extracting text from PDF…" />
            </div>
          }
        </div>
      }

      @if (error(); as message) {
        <div class="mx-auto mt-6 max-w-xl">
          <app-status-indicator variant="error" [message]="message" />
        </div>
      }

      @if (step() === 'review' || step() === 'structuring') {
        <div class="mt-2">
          <nav class="mb-6 flex gap-1 rounded-lg border border-navy-200 bg-white p-1" role="tablist" aria-label="Review tabs">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === 'text'"
              (click)="activeTab.set('text')"
              class="flex-1 rounded-md px-4 py-2 font-serif-display text-sm font-medium italic transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              [class]="
                activeTab() === 'text'
                  ? 'bg-navy-900 text-parchment-100'
                  : 'text-navy-500 hover:text-navy-800'
              "
            >
              Plain Text
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === 'structured'"
              (click)="activeTab.set('structured')"
              class="flex-1 rounded-md px-4 py-2 font-serif-display text-sm font-medium italic transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              [class]="
                activeTab() === 'structured'
                  ? 'bg-navy-900 text-parchment-100'
                  : 'text-navy-500 hover:text-navy-800'
              "
            >
              Structured Data
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === 'chunks'"
              (click)="activeTab.set('chunks')"
              class="flex-1 rounded-md px-4 py-2 font-serif-display text-sm font-medium italic transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              [class]="
                activeTab() === 'chunks'
                  ? 'bg-navy-900 text-parchment-100'
                  : 'text-navy-500 hover:text-navy-800'
              "
            >
              Chunks
            </button>
          </nav>

          @if (step() === 'structuring') {
            <div class="mb-6">
              <app-status-indicator variant="loading" message="Structuring content with the LLM…" />
            </div>
          }

          @if (activeTab() === 'text') {
            <app-plain-text-editor
              [text]="rawText()"
              [restructuring]="step() === 'structuring'"
              (textChange)="rawText.set($event)"
              (restructureRequested)="restructure()"
            />
          } @else if (activeTab() === 'structured') {
            <app-structured-form [(data)]="structured" />
          } @else {
            <app-chunks-viewer [chunks]="chunks()" />
          }

          <div class="mt-8 flex items-center justify-between border-t border-navy-200 pt-6">
            <button
              type="button"
              (click)="cancel()"
              class="rounded-md border border-navy-300 px-5 py-2.5 font-serif-display text-sm font-medium italic text-navy-500 transition-colors hover:border-navy-500 hover:text-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 active:bg-navy-50"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="confirm()"
              [disabled]="!canConfirm() || step() === 'saving'"
              class="rounded-md bg-navy-900 px-6 py-2.5 font-serif-display text-sm font-medium italic text-parchment-100 transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 active:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ step() === 'saving' ? 'Saving…' : 'Confirm & Save' }}
            </button>
          </div>
        </div>
      }

      @if (step() === 'done') {
        <div class="mx-auto max-w-xl">
          <app-status-indicator
            variant="success"
            [message]="'Document saved successfully (' + savedChunks() + ' chunks indexed).'"
          />
          <div class="mt-6 flex justify-center gap-4">
            <button
              type="button"
              (click)="reset()"
              class="rounded-md bg-navy-900 px-5 py-2.5 font-serif-display text-sm font-medium italic text-parchment-100 transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 active:bg-navy-950"
            >
              Upload another document
            </button>
            <a
              routerLink="/search"
              class="rounded-md border border-navy-300 px-5 py-2.5 font-serif-display text-sm font-medium italic text-navy-600 transition-colors hover:border-navy-500 hover:text-navy-800"
            >
              Try searching
            </a>
          </div>
        </div>
      }
    </div>
  `,
})
export class UploadPageComponent {
  private readonly ingestService = inject(IngestService);

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

  protected canConfirm(): boolean {
    return !!this.selectedFile && !!this.structured() && this.step() === 'review';
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.filename = file.name;
    this.error.set(null);
    this.step.set('extracting');

    this.ingestService.upload(file).subscribe({
      next: (response: ExtractResponse) => {
        this.documentId = response.document_id;
        this.rawText.set(response.raw_text);
        this.step.set('review');
        this.structure();
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.step.set('idle');
      },
    });
  }

  structure(): void {
    this.error.set(null);
    this.step.set('structuring');
    this.ingestService.structure(this.documentId, this.rawText()).subscribe({
      next: (response: StructureResponse) => {
        this.structured.set(response.structured_data);
        this.chunks.set(response.chunks ?? []);
        this.step.set('review');
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.step.set('review');
      },
    });
  }

  restructure(): void {
    this.structure();
  }

  confirm(): void {
    const file = this.selectedFile;
    const structured = this.structured();
    if (!file || !structured) {
      return;
    }
    this.error.set(null);
    this.step.set('saving');
    this.ingestService
      .confirm(file, {
        document_id: this.documentId,
        filename: this.filename,
        raw_text: this.rawText(),
        structured_data: structured,
      })
      .subscribe({
        next: (response: ConfirmResponse) => {
          this.savedChunks.set(response.chunks_count);
          this.step.set('done');
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.step.set('review');
        },
      });
  }

  cancel(): void {
    this.ingestService.cancel(this.documentId).subscribe({
      next: () => this.reset(),
      error: () => this.reset(),
    });
  }

  reset(): void {
    this.step.set('idle');
    this.activeTab.set('text');
    this.rawText.set('');
    this.structured.set(null);
    this.chunks.set([]);
    this.error.set(null);
    this.selectedFile = null;
    this.documentId = '';
  }
}
