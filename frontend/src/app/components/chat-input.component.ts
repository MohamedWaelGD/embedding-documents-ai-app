import { Component, input, output, signal } from '@angular/core';
import { ChatMessage } from './chat-messages.component';

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
        class="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-800 placeholder:italic placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="submit"
        [disabled]="loading() || value().trim().length === 0"
        class="rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-parchment-100 transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 active:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-50"
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
