import { Component, input, signal } from '@angular/core';
import { MatchedChunk } from '../models';

@Component({
  selector: 'app-context-references',
  template: `
    @if (chunks().length > 0) {
      <div class="rounded-lg border border-slate-200 bg-slate-50">
        <button
          type="button"
          (click)="expanded.set(!expanded())"
          class="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          [attr.aria-expanded]="expanded()"
        >
          <span>Source references ({{ chunks().length }})</span>
          <span aria-hidden="true">{{ expanded() ? '▾' : '▸' }}</span>
        </button>
        @if (expanded()) {
          <ul class="border-t border-slate-200 divide-y divide-slate-200">
            @for (chunk of chunks(); track chunk.id) {
              <li class="px-4 py-3">
                <div class="mb-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>Similarity: {{ chunk.similarity.toFixed(3) }}</span>
                  @if (chunk.page_number !== null) {
                    <span>· Page {{ chunk.page_number }}</span>
                  }
                </div>
                <p class="text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {{ chunk.content }}
                </p>
              </li>
            }
          </ul>
        }
      </div>
    }
  `,
})
export class ContextReferencesComponent {
  readonly chunks = input<MatchedChunk[]>([]);
  readonly expanded = signal(false);
}
