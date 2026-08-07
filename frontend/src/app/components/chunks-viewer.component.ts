import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TextChunk } from '../models';

@Component({
  selector: 'app-chunks-viewer',
  imports: [DecimalPipe],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">
        <span>{{ chunks().length }} chunks</span>
        <span>{{ totalCharacters() | number }} characters total</span>
      </div>

      @for (chunk of chunks(); track chunk.index) {
        <div class="rounded-lg border border-slate-200 bg-white">
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <span class="text-sm font-medium text-slate-700">Chunk #{{ chunk.index + 1 }}</span>
            <span class="text-xs text-slate-400">{{ chunk.content.length | number }} chars</span>
          </div>
          <pre
            dir="auto"
            class="max-h-48 overflow-y-auto whitespace-pre-wrap px-4 py-3 font-mono text-xs leading-relaxed text-slate-700"
          >{{ chunk.content }}</pre>
        </div>
      } @empty {
        <div class="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center">
          <p class="text-sm text-slate-400">No chunks generated for this document.</p>
        </div>
      }
    </div>
  `,
})
export class ChunksViewerComponent {
  readonly chunks = input<TextChunk[]>([]);

  protected readonly totalCharacters = computed(() =>
    this.chunks().reduce((sum, chunk) => sum + chunk.content.length, 0),
  );
}
