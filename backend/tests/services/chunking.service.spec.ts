import { describe, it, expect } from 'vitest';
import { chunkText } from '../../src/services/chunking.service';

describe('chunkText', () => {
  it('splits text into multiple chunks with correct indices', async () => {
    const longText = 'word '.repeat(500).trim();
    const chunks = await chunkText(longText);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].index).toBe(0);
    for (let i = 1; i < chunks.length; i++) {
      expect(chunks[i].index).toBe(chunks[i - 1].index + 1);
    }
  });

  it('respects configured chunk size', async () => {
    const longText = 'a'.repeat(3000);
    const chunks = await chunkText(longText);
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeLessThanOrEqual(1000 + 200);
    }
  });

  it('handles short text as a single chunk', async () => {
    const chunks = await chunkText('short document text');
    expect(chunks).toHaveLength(1);
    expect(chunks[0].content).toBe('short document text');
  });

  it('filters out empty chunks', async () => {
    const chunks = await chunkText('\n\n\n');
    expect(chunks).toHaveLength(0);
  });

  it('preserves bilingual content within chunks', async () => {
    const mixed =
      'لائحة شؤون الموظفين\nEmployee Affairs Regulation\n' +
      'بعض النص العربي هنا\nSome english text here\n'.repeat(50);
    const chunks = await chunkText(mixed);
    const joined = chunks.map((c) => c.content).join(' ');
    expect(joined).toContain('لائحة شؤون الموظفين');
    expect(joined).toContain('Employee Affairs Regulation');
  });
});
