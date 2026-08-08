import { Component, input } from '@angular/core';

export type StatusVariant = 'loading' | 'error' | 'success' | 'empty' | 'idle';

@Component({
  selector: 'app-status-indicator',
  template: `
    @switch (variant()) {
      @case ('loading') {
        <div class="flex items-center justify-center gap-3 py-10" role="status" aria-live="polite">
          <svg
            class="h-5 w-5 animate-spin text-gold-600"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" opacity="0.2" />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          <span class="font-serif-display text-sm italic text-navy-500">{{ message() }}</span>
        </div>
      }
      @case ('error') {
        <div
          class="flex items-start gap-3 rounded-lg border border-burgundy-200 bg-burgundy-50 px-4 py-3 text-sm text-burgundy-700"
          role="alert"
        >
          <svg
            class="mt-0.5 h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{{ message() }}</span>
        </div>
      }
      @case ('success') {
        <div
          class="flex items-start gap-3 rounded-lg border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-navy-700"
          role="status"
        >
          <svg
            class="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{{ message() }}</span>
        </div>
      }
      @case ('empty') {
        <div class="flex flex-col items-center gap-3 py-14 text-center">
          <div class="rounded-full border border-dashed border-navy-200 p-4">
            <svg
              class="h-8 w-8 text-navy-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <p class="max-w-xs font-serif-display text-sm italic text-navy-400">{{ message() }}</p>
        </div>
      }
    }
  `,
})
export class StatusIndicatorComponent {
  readonly variant = input<StatusVariant>('idle');
  readonly message = input('');
}
