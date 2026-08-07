import { Component, input } from '@angular/core';

export type StatusVariant = 'loading' | 'error' | 'success' | 'empty' | 'idle';

@Component({
  selector: 'app-status-indicator',
  template: `
    @switch (variant()) {
      @case ('loading') {
        <div
          class="flex items-center justify-center gap-3 py-8 text-slate-500"
          role="status"
          aria-live="polite"
        >
          <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
            aria-hidden="true"
          ></span>
          <span>{{ message() }}</span>
        </div>
      }
      @case ('error') {
        <div
          class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          <span aria-hidden="true" class="mt-0.5">⚠</span>
          <span>{{ message() }}</span>
        </div>
      }
      @case ('success') {
        <div
          class="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
        >
          <span aria-hidden="true" class="mt-0.5">✓</span>
          <span>{{ message() }}</span>
        </div>
      }
      @case ('empty') {
        <div class="flex flex-col items-center gap-2 py-10 text-center text-slate-400">
          <span aria-hidden="true" class="text-3xl">{{ icon() }}</span>
          <p class="text-sm">{{ message() }}</p>
        </div>
      }
    }
  `,
})
export class StatusIndicatorComponent {
  readonly variant = input<StatusVariant>('idle');
  readonly message = input('');
  readonly icon = input('📄');
}
