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
    <div class="mx-auto max-w-3xl">
      <h1 class="mb-1 text-2xl font-semibold tracking-tight">Upload a document</h1>
      <p class="mb-6 text-sm text-slate-500">
        Upload a PDF. The system extracts the text, structures it, and saves it with embeddings for
        semantic search.
      </p>

      @if (step() === 'idle' || step() === 'extracting') {
        <app-file-upload
          (fileSelected)="onFileSelected($event)"
          [class]="step() === 'extracting' ? 'pointer-events-none opacity-60' : ''"
        />
      }

      @if (step() === 'extracting') {
        <app-status-indicator variant="loading" message="Extracting text from PDF…" />
      }

      @if (error(); as message) {
        <div class="mt-4">
          <app-status-indicator variant="error" [message]="message" />
        </div>
      }

      @if (step() === 'review' || step() === 'structuring') {
        <div class="mt-6">
          <div class="mb-4 flex gap-2" role="tablist" aria-label="Review tabs">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === 'text'"
              (click)="activeTab.set('text')"
              class="rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              [class]="
                activeTab() === 'text'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              "
            >
              Plain Text
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === 'structured'"
              (click)="activeTab.set('structured')"
              class="rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              [class]="
                activeTab() === 'structured'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              "
            >
              Structured Data
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === 'chunks'"
              (click)="activeTab.set('chunks')"
              class="rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              [class]="
                activeTab() === 'chunks'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              "
            >
              Chunks
            </button>
          </div>

          @if (step() === 'structuring') {
            <app-status-indicator variant="loading" message="Structuring content with the LLM…" />
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

          <div class="mt-6 flex items-center justify-between">
            <button
              type="button"
              (click)="cancel()"
              class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="confirm()"
              [disabled]="!canConfirm() || step() === 'saving'"
              class="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ step() === 'saving' ? 'Saving…' : 'Confirm & Save' }}
            </button>
          </div>
        </div>
      }

      @if (step() === 'done') {
        <div class="mt-6">
          <app-status-indicator
            variant="success"
            [message]="'Document saved successfully (' + savedChunks() + ' chunks indexed).'"
          />
          <div class="mt-4 flex justify-center gap-3">
            <button
              type="button"
              (click)="reset()"
              class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800"
            >
              Upload another document
            </button>
            <a
              routerLink="/search"
              class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
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
