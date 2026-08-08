import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-plain-text-editor',
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="font-serif-display text-sm font-medium italic text-navy-600">Extracted plain text</span>
        <button
          type="button"
          (click)="restructureRequested.emit()"
          [disabled]="restructuring()"
          class="rounded-md border border-navy-300 px-3 py-1.5 text-xs font-medium text-navy-600 transition-colors hover:border-gold-400 hover:text-gold-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 active:bg-gold-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ restructuring() ? 'Restructuring…' : 'Re-structure' }}
        </button>
      </div>
      <textarea
        [value]="text()"
        (input)="onInput($event)"
        rows="22"
        dir="auto"
        class="w-full resize-y rounded-lg border border-navy-200 bg-white p-4 font-mono-data text-sm leading-relaxed text-navy-800 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
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
