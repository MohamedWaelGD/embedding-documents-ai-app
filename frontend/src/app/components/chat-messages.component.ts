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
          class="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
          [class]="
            message.role === 'user'
              ? 'self-end bg-blue-600 text-white'
              : 'self-start border border-slate-200 bg-white text-slate-800'
          "
        >
          {{ message.content }}
        </div>
      } @empty {
        <p class="py-10 text-center text-sm text-slate-400">
          Ask a question about your uploaded documents to get started.
        </p>
      }
    </div>
  `,
})
export class ChatMessagesComponent {
  readonly messages = input<ChatMessage[]>([]);
}
