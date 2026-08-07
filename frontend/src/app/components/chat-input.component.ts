import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  template: `
    <form class="flex gap-2" (submit)="onSubmit($event)">
      <label class="sr-only" for="chat-input">Your question</label>
      <input
        id="chat-input"
        type="text"
        [value]="value()"
        (input)="onInput($event)"
        [disabled]="loading()"
        placeholder="Ask about your documents…"
        class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="submit"
        [disabled]="loading() || value().trim().length === 0"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ loading() ? 'Searching…' : 'Send' }}
      </button>
    </form>
  `,
})
export class ChatInputComponent {
  readonly loading = input(false);
  readonly submitted = output<string>();
  protected readonly value = signal('');

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const query = this.value().trim();
    if (!query || this.loading()) {
      return;
    }
    this.submitted.emit(query);
    this.value.set('');
  }
}
