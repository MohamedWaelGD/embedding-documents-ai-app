import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-plain-text-editor',
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-slate-600">Extracted plain text</span>
        <button
          type="button"
          (click)="restructureRequested.emit()"
          [disabled]="restructuring()"
          class="rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ restructuring() ? 'Restructuring…' : 'Re-structure' }}
        </button>
      </div>
      <textarea
        [value]="text()"
        (input)="onInput($event)"
        rows="24"
        dir="auto"
        class="w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label="Extracted plain text (editable)"
      ></textarea>
    </div>
  `,
})
export class PlainTextEditorComponent {
  readonly text = input('');
  readonly restructuring = input(false);
  readonly textChange = output<string>();
  readonly restructureRequested = output<void>();

  onInput(event: Event): void {
    this.textChange.emit((event.target as HTMLTextAreaElement).value);
  }
}
