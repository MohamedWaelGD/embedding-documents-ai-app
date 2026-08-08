import { Component, input, signal } from '@angular/core';
import { MatchedChunk } from '../models';

@Component({
  selector: 'app-context-references',
  template: `
    @if (chunks().length > 0) {
      <div class="overflow-hidden rounded-lg border border-navy-200 bg-white">
        <button
          type="button"
          (click)="expanded.set(!expanded())"
          class="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-parchment-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          [attr.aria-expanded]="expanded()"
        >
          <span class="font-serif-display text-sm font-medium italic text-navy-600">Source references ({{ chunks().length }})</span>
          <svg
            class="h-4 w-4 text-navy-400 transition-transform"
            [class.rotate-90]="expanded()"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        @if (expanded()) {
          <ol class="divide-y divide-navy-100 border-t border-navy-200">
            @for (chunk of chunks(); track chunk.id) {
              <li class="px-4 py-3">
                <div class="mb-1.5 flex items-center gap-3 font-mono-data text-xs text-navy-400">
                  <span>Similarity: {{ chunk.similarity.toFixed(3) }}</span>
                  @if (chunk.page_number !== null) {
                    <span>Page {{ chunk.page_number }}</span>
                  }
                </div>
                <p class="text-xs leading-relaxed text-navy-600 line-clamp-3">
                  {{ chunk.content }}
                </p>
              </li>
            }
          </ol>
        }
      </div>
    }
  `,
})
export class ContextReferencesComponent {
  readonly chunks = input<MatchedChunk[]>([]);
  readonly expanded = signal(false);
}
