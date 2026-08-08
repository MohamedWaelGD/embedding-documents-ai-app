import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TextChunk } from '../models';

@Component({
  selector: 'app-chunks-viewer',
  imports: [DecimalPipe],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between rounded-md border border-navy-200 bg-navy-50/50 px-4 py-2.5">
        <span class="font-serif-display text-sm italic text-navy-600">{{ chunks().length }} chunks</span>
        <span class="font-mono-data text-xs text-navy-400">{{ totalCharacters() | number }} characters total</span>
      </div>

      @for (chunk of chunks(); track chunk.index) {
        <div class="overflow-hidden rounded-lg border border-navy-200 bg-white">
          <div class="flex items-center justify-between border-b border-navy-100 px-4 py-2">
            <span class="font-serif-display text-sm font-medium text-navy-700">Chunk #{{ chunk.index + 1 }}</span>
            <span class="font-mono-data text-xs text-navy-400">{{ chunk.content.length | number }} chars</span>
          </div>
          <pre
            dir="auto"
            class="max-h-48 overflow-y-auto whitespace-pre-wrap px-4 py-3 font-mono-data text-xs leading-relaxed text-navy-700"
          >{{ chunk.content }}</pre>
        </div>
      } @empty {
        <div class="rounded-lg border border-navy-200 bg-white px-4 py-10 text-center">
          <p class="font-serif-display text-sm italic text-navy-400">No chunks generated for this document.</p>
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
