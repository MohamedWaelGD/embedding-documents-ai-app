import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSupabase } from '../../src/config/supabase';
import { listDocuments, deleteDocument } from '../../src/services/document.service';

vi.mock('../../src/config/supabase', () => ({
  getSupabase: vi.fn(),
}));

function mockChain(overrides: Record<string, unknown> = {}) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    delete: vi.fn().mockReturnThis(),
    ...overrides,
  };
}

describe('document.service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('lists documents from supabase', async () => {
    const chain = mockChain({ single: undefined });
    chain.order.mockResolvedValueOnce({
      data: [{ id: '1', filename: 'a.pdf', storage_path: 'p', created_at: '' }],
      error: null,
    });

    const supabase = {
      from: vi.fn().mockReturnValue(chain),
      storage: { from: vi.fn(), remove: vi.fn() },
    };
    vi.mocked(getSupabase).mockReturnValue(supabase as never);

    const result = await listDocuments();
    expect(result).toHaveLength(1);
    expect(result[0].filename).toBe('a.pdf');
  });

  it('throws NOT_FOUND when deleting a missing document', async () => {
    const chain = mockChain();
    chain.single.mockResolvedValueOnce({ data: null, error: { message: 'not found' } });

    const supabase = { from: vi.fn().mockReturnValue(chain), storage: { from: vi.fn() } };
    vi.mocked(getSupabase).mockReturnValue(supabase as never);

    await expect(deleteDocument('missing')).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
