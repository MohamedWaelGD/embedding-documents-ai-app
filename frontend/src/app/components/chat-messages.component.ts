import { Component, input } from '@angular/core';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat-messages',
  template: `
    <div class="flex flex-col gap-4">
      @for (message of messages(); track $index) {
        <div
          class="max-w-[85%] rounded-xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap"
          [class]="
            message.role === 'user'
              ? 'self-end bg-navy-900 text-parchment-100'
              : 'self-start border border-navy-200 bg-parchment-50 text-navy-800'
          "
        >
          {{ message.content }}
        </div>
      } @empty {
        <div class="flex flex-col items-center gap-3 py-12 text-center">
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p class="font-serif-display text-sm italic text-navy-400">Ask a question about your uploaded documents to get started.</p>
        </div>
      }
    </div>
  `,
})
export class ChatMessagesComponent {
  readonly messages = input<ChatMessage[]>([]);
}
