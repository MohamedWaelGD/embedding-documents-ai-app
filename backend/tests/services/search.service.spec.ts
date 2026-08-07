import { describe, it, expect, vi, beforeEach } from 'vitest';

const rpcMock = vi.fn();
const embedMock = vi.fn();
const chatMock = vi.fn();

vi.mock('../../src/config/supabase', () => ({
  getSupabase: () => ({ rpc: rpcMock }),
}));

vi.mock('../../src/services/embedding.service', () => ({
  embedText: embedMock,
}));

vi.mock('../../src/config/openai', () => ({
  getOpenAI: () => ({
    chat: {
      completions: { create: chatMock },
    },
  }),
}));

describe('searchDocuments', () => {
  beforeEach(() => {
    rpcMock.mockReset();
    embedMock.mockReset();
    chatMock.mockReset();
  });

  it('returns no-results response when no chunks match', async () => {
    embedMock.mockResolvedValueOnce([0.1, 0.2]);
    rpcMock.mockResolvedValueOnce({ data: [], error: null });

    const { searchDocuments } = await import('../../src/services/search.service');
    const result = await searchDocuments('question?');
    expect(result.answer).toContain('No relevant information');
    expect(result.matched_chunks).toHaveLength(0);
  });

  it('returns an LLM answer grounded in matched chunks', async () => {
    embedMock.mockResolvedValueOnce([0.1, 0.2]);
    rpcMock.mockResolvedValueOnce({
      data: [
        {
          id: 'c1',
          document_id: 'd1',
          content: 'relevant content',
          page_number: 3,
          similarity: 0.92,
        },
      ],
      error: null,
    });
    chatMock.mockResolvedValueOnce({
      choices: [{ message: { content: 'The answer is 15.' } }],
    });

    const { searchDocuments } = await import('../../src/services/search.service');
    const result = await searchDocuments('question?');
    expect(result.answer).toBe('The answer is 15.');
    expect(result.matched_chunks).toHaveLength(1);
    expect(result.matched_chunks[0].similarity).toBe(0.92);
  });

  it('throws VALIDATION_ERROR for empty query', async () => {
    const { searchDocuments } = await import('../../src/services/search.service');
    await expect(searchDocuments('   ')).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
  });
});
