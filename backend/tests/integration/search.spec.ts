import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { getSupabase } from '../../src/config/supabase';
import { getOpenAI } from '../../src/config/openai';

vi.mock('../../src/config/supabase', () => ({
  getSupabase: vi.fn(),
}));

vi.mock('../../src/config/openai', () => ({
  getOpenAI: vi.fn(),
}));

vi.mock('../../src/services/embedding.service', () => ({
  embedText: vi.fn().mockResolvedValue([0.1, 0.2]),
}));

describe('POST /api/search', () => {
  it('returns 400 for missing query', async () => {
    const app = createApp();
    const response = await request(app).post('/api/search').send({}).expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns no-results answer when nothing matches', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [], error: null });
    vi.mocked(getSupabase).mockReturnValue({ rpc } as never);

    const app = createApp();
    const response = await request(app).post('/api/search').send({ query: 'anything' }).expect(200);
    expect(response.body.matched_chunks).toHaveLength(0);
    expect(response.body.answer).toContain('No relevant information');
  });

  it('returns an answer grounded in matched chunks', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'c1',
          document_id: 'd1',
          content: 'context text',
          page_number: 2,
          similarity: 0.9,
        },
      ],
      error: null,
    });
    vi.mocked(getSupabase).mockReturnValue({ rpc } as never);
    vi.mocked(getOpenAI).mockReturnValue({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({ choices: [{ message: { content: 'answer text' } }] }),
        },
      },
    } as never);

    const app = createApp();
    const response = await request(app).post('/api/search').send({ query: 'question' }).expect(200);
    expect(response.body.answer).toBe('answer text');
    expect(response.body.matched_chunks).toHaveLength(1);
  });
});
