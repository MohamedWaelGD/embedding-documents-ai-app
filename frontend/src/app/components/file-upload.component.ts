import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  template: `
    <div
      class="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-12 text-center transition-colors"
      [class.border-blue-400]="dragging()"
      (dragover)="onDragOver($event)"
      (dragleave)="dragging.set(false)"
      (drop)="onDrop($event)"
    >
      <input
        #fileInput
        type="file"
        accept="application/pdf"
        class="sr-only"
        (change)="onFileSelected($event)"
        aria-label="Select a PDF file to upload"
      />
      <span aria-hidden="true" class="text-4xl">📄</span>
      <div>
        <p class="font-medium text-slate-700">Drag and drop a PDF here, or</p>
        <p class="mt-1 text-sm text-slate-500">Maximum file size: 50 MB</p>
      </div>
      <button
        type="button"
        (click)="fileInput.click()"
        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800"
      >
        Browse files
      </button>
      @if (selectedFile(); as file) {
        <p class="mt-2 text-sm font-medium text-emerald-600" aria-live="polite">
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
