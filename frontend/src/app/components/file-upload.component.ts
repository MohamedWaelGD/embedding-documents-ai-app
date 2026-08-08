import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="group relative min-h-88 rounded-xl border border-navy-200 bg-white p-4 transition-[border-color,background-color] duration-200"
      [class.border-gold-500]="dragging()"
      [class.bg-gold-50]="dragging()"
      (dragover)="onDragOver($event)"
      (dragleave)="dragging.set(false)"
      (drop)="onDrop($event)"
    >
      <div class="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-navy-300 px-6 py-12 text-center transition-colors group-hover:border-navy-400">
        <input
          #fileInput
          type="file"
          accept="application/pdf"
          class="sr-only"
          (change)="onFileSelected($event)"
          aria-label="Select a PDF file to upload"
        />

        <div class="relative mb-7 h-24 w-20" aria-hidden="true">
          <span class="absolute inset-0 translate-x-2 translate-y-2 border border-navy-100 bg-parchment-50"></span>
          <span class="absolute inset-0 grid place-items-center border border-navy-700 bg-parchment-200 text-navy-800 transition-transform duration-300 group-hover:-translate-y-1">
            <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 16V5m0 0L8 9m4-4 4 4"/><path d="M5 15v4h14v-4"/>
            </svg>
          </span>
        </div>

        <h2 class="font-serif-display text-2xl font-medium tracking-[-0.02em] text-navy-900">
          {{ dragging() ? 'Release the document to begin' : 'Choose a document to review' }}
        </h2>
        <p class="mt-2 max-w-md text-sm leading-6 text-navy-500">
          Drop your regulatory PDF here, or select it from your computer. Arabic and English documents are supported.
        </p>

        <button
          type="button"
          (click)="fileInput.click()"
          class="mt-6 rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-500 active:bg-navy-950"
        >
          Select PDF
        </button>
        <p class="mt-4 text-xs text-navy-400">PDF format · Maximum file size 50 MB</p>

        @if (selectedFile(); as file) {
          <p class="mt-4 animate-fade-in rounded-md bg-parchment-200 px-3 py-2 text-sm font-semibold text-navy-800" aria-live="polite">
            {{ file.name }} · {{ formatSize(file.size) }}
          </p>
        }
      </div>
    </div>
  `,
})
export class FileUploadComponent {
  readonly fileSelected = output<File>();
  readonly selectedFile = signal<File | null>(null);
  readonly dragging = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.emitFile(file);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.emitFile(file);
  }

  private emitFile(file: File): void {
    this.selectedFile.set(file);
    this.fileSelected.emit(file);
  }

  protected formatSize(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
  }
}
