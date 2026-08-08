import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessagesComponent, ChatMessage } from '../components/chat-messages.component';
import { ChatInputComponent } from '../components/chat-input.component';
import { ContextReferencesComponent } from '../components/context-references.component';
import { StatusIndicatorComponent } from '../components/status-indicator.component';
import { SearchService } from '../services/search.service';
import { MatchedChunk } from '../models';

@Component({
  selector: 'app-search-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatMessagesComponent, ChatInputComponent, ContextReferencesComponent, StatusIndicatorComponent],
  template: `
    <div class="mx-auto max-w-6xl">
      <header class="grid items-end gap-6 border-b border-navy-200 pb-8 lg:grid-cols-[1fr_0.7fr]">
        <h1 class="font-serif-display text-4xl font-medium leading-tight tracking-[-0.035em] text-navy-900 sm:text-5xl">Ask the evidence.</h1>
        <p class="max-w-xl text-sm leading-6 text-navy-500">Ask in Arabic or English. Each answer is grounded in passages from documents you have reviewed and saved.</p>
      </header>

      <div class="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section class="min-h-112 rounded-xl border border-navy-200 bg-white p-5 sm:p-7" aria-label="Conversation">
          <app-chat-messages [messages]="messages()" />
          @if (searching()) { <div class="mt-4"><app-status-indicator variant="loading" message="Searching reviewed documents…" /></div> }
          @if (error(); as message) { <div class="mt-4"><app-status-indicator variant="error" [message]="message" /></div> }
        </section>

        <aside class="rounded-xl bg-parchment-200 p-6">
          <h2 class="font-serif-display text-xl font-medium tracking-[-0.02em] text-navy-900">How answers are built</h2>
          <p class="mt-3 text-sm leading-6 text-navy-600">The system finds semantically related passages, then answers from that context. Open the source references below each answer to verify it.</p>
          <div class="mt-6 border-t border-navy-200 pt-5 text-xs leading-5 text-navy-500">
            <strong class="text-navy-800">Try asking</strong><br />“What penalties apply to late filing?”
          </div>
        </aside>
      </div>

      @if (references().length > 0) { <div class="mt-5"><app-context-references [chunks]="references()" /></div> }
      <div class="sticky bottom-4 mt-5 rounded-xl border border-navy-200 bg-white p-3 shadow-[0_12px_30px_rgba(24,61,53,0.1)]"><app-chat-input [loading]="searching()" (submitted)="ask($event)" /></div>
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
    this.error.set(null); this.searching.set(true); this.messages.update((messages) => [...messages, { role: 'user', content: query }]);
    this.searchService.search(query).subscribe({
      next: (response) => { this.messages.update((messages) => [...messages, { role: 'assistant', content: response.answer }]); this.references.set(response.matched_chunks); this.searching.set(false); },
      error: (err: Error) => { this.messages.update((messages) => [...messages, { role: 'assistant', content: `The search could not be completed: ${err.message}` }]); this.error.set(err.message); this.searching.set(false); },
    });
  }
}
