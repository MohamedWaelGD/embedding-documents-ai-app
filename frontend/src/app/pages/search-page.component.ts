import { Component, inject, signal } from '@angular/core';
import { ChatMessagesComponent, ChatMessage } from '../components/chat-messages.component';
import { ChatInputComponent } from '../components/chat-input.component';
import { ContextReferencesComponent } from '../components/context-references.component';
import { StatusIndicatorComponent } from '../components/status-indicator.component';
import { SearchService } from '../services/search.service';
import { MatchedChunk } from '../models';

@Component({
  selector: 'app-search-page',
  imports: [
    ChatMessagesComponent,
    ChatInputComponent,
    ContextReferencesComponent,
    StatusIndicatorComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl">
      <h1 class="mb-1 text-2xl font-semibold tracking-tight">Semantic search</h1>
      <p class="mb-6 text-sm text-slate-500">
        Ask a question in natural language. Answers are grounded in your uploaded documents.
      </p>

      <div class="mb-4 rounded-xl border border-slate-200 bg-white p-4">
        <app-chat-messages [messages]="messages()" />
      </div>

      @if (searching()) {
        <app-status-indicator variant="loading" message="Searching your documents…" />
      }
      @if (error(); as message) {
        <div class="mt-2">
          <app-status-indicator variant="error" [message]="message" />
        </div>
      }

      @if (references().length > 0) {
        <div class="mt-4">
          <app-context-references [chunks]="references()" />
        </div>
      }

      <div class="mt-4">
        <app-chat-input [loading]="searching()" (submitted)="ask($event)" />
      </div>
    </div>
  `,
})
export class SearchPageComponent {
  private readonly searchService = inject(SearchService);

  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly references = signal<MatchedChunk[]>([]);
  protected readonly searching = signal(false);
  protected readonly error = signal<string | null>(null);

  ask(query: string): void {
    this.error.set(null);
    this.searching.set(true);
    this.messages.update((messages) => [...messages, { role: 'user', content: query }]);

    this.searchService.search(query).subscribe({
      next: (response) => {
        this.messages.update((messages) => [
          ...messages,
          { role: 'assistant', content: response.answer },
        ]);
        this.references.set(response.matched_chunks);
        this.searching.set(false);
      },
      error: (err: Error) => {
        this.messages.update((messages) => [
          ...messages,
          { role: 'assistant', content: `Sorry, the search failed: ${err.message}` },
        ]);
        this.error.set(err.message);
        this.searching.set(false);
      },
    });
  }
}
