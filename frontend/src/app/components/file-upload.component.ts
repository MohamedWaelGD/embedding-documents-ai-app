import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  template: `
    <div
      class="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border-2 bg-white px-8 py-14 text-center transition-all"
      [class.border-dashed]="!dragging()"
      [class.border-navy-200]="!dragging()"
      [class.border-gold-500]="dragging()"
      [class.border-solid]="dragging()"
      [class.bg-gold-50/30]="dragging()"
      (dragover)="onDragOver($event)"
      (dragleave)="dragging.set(false)"
      (drop)="onDrop($event)"
    >
      <div
        class="pointer-events-none absolute inset-2 rounded-md border border-navy-100"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-gold-400"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-gold-400"
        aria-hidden="true"
      ></div>

      <input
        #fileInput
        type="file"
        accept="application/pdf"
        class="sr-only"
        (change)="onFileSelected($event)"
        aria-label="Select a PDF file to upload"
      />

      <svg
        class="h-10 w-10 text-gold-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>

      <div>
        <p class="font-serif-display text-lg font-medium italic text-navy-800">
          {{ dragging() ? 'Release to upload' : 'Drag and drop a PDF here' }}
        </p>
        <p class="mt-1 font-serif-body text-xs text-navy-400">or use the button below</p>
      </div>

      <button
        type="button"
        (click)="fileInput.click()"
        class="rounded-md bg-navy-900 px-5 py-2 text-sm font-medium text-parchment-100 transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 active:bg-navy-950"
      >
        Browse files
      </button>

      <p class="font-serif-display text-xs italic tracking-wide text-navy-400">Maximum file size: 50 MB</p>

      @if (selectedFile(); as file) {
        <p class="animate-fade-in font-serif-display text-sm font-medium italic text-gold-700" aria-live="polite">
          Selected: {{ file.name }} ({{ formatSize(file.size) }})
        </p>
      }
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
    if (file) {
      this.emitFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.emitFile(file);
    }
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
