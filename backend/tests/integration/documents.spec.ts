import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { getSupabase } from '../../src/config/supabase';

vi.mock('../../src/config/supabase', () => ({
  getSupabase: vi.fn(),
}));

function mockChain(overrides: Record<string, unknown> = {}) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    delete: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })),
    ...overrides,
  };
  return chain;
}

describe('Document management endpoints', () => {
  it('GET /api/documents returns document list', async () => {
    const chain = mockChain();
    chain.order.mockResolvedValueOnce({
      data: [{ id: '1', filename: 'a.pdf', storage_path: 'p', created_at: '2026-08-07T00:00:00Z' }],
      error: null,
    });
    const supabase = {
      from: vi.fn().mockReturnValue(chain),
      storage: { from: vi.fn(), remove: vi.fn() },
    };
    vi.mocked(getSupabase).mockReturnValue(supabase as never);

    const app = createApp();
    const response = await request(app).get('/api/documents').expect(200);
    expect(response.body.documents).toHaveLength(1);
  });

  it('DELETE /api/documents/:id returns 404 for missing document', async () => {
    const chain = mockChain();
    chain.single.mockResolvedValueOnce({ data: null, error: { message: 'not found' } });
    const supabase = {
      from: vi.fn().mockReturnValue(chain),
      storage: { from: vi.fn(), remove: vi.fn() },
    };
    vi.mocked(getSupabase).mockReturnValue(supabase as never);

    const app = createApp();
    const response = await request(app).delete('/api/documents/missing').expect(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('DELETE /api/documents/:id removes storage file after DB deletion', async () => {
    const chain = mockChain();
    chain.single.mockResolvedValueOnce({
      data: { id: '1', filename: 'a.pdf', storage_path: 'path/to/a.pdf', created_at: '' },
      error: null,
    });
    const remove = vi.fn().mockResolvedValue({ error: null });
    const supabase = {
      from: vi.fn().mockReturnValue(chain),
      storage: { from: vi.fn().mockReturnValue({ remove }) },
    };
    vi.mocked(getSupabase).mockReturnValue(supabase as never);

    const app = createApp();
    const response = await request(app).delete('/api/documents/1').expect(200);
    expect(response.body.message).toBe('Document deleted successfully');
    expect(remove).toHaveBeenCalledWith(['path/to/a.pdf']);
  });
});
