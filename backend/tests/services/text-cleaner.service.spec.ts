import { describe, it, expect } from 'vitest';
import { cleanText } from '../../src/services/text-cleaner.service';

describe('cleanText', () => {
  it('removes non-printable control characters', () => {
    const input = 'hello\u0000world\u001F text';
    expect(cleanText(input)).not.toContain('\u0000');
    expect(cleanText(input)).not.toContain('\u001F');
  });

  it('collapses multiple blank lines into a single blank line', () => {
    const input = 'line1\n\n\n\n\nline2';
    expect(cleanText(input)).toBe('line1\n\nline2');
  });

  it('removes standalone page-number lines', () => {
    const input = 'Some text\n\n42\n\nMore text';
    expect(cleanText(input)).not.toMatch(/^\d+$/m);
    expect(cleanText(input)).toContain('Some text');
  });

  it('trims trailing whitespace on each line', () => {
    const input = '  hello   \n  world  ';
    expect(cleanText(input)).toBe('hello\nworld');
  });

  it('normalizes unicode punctuation and whitespace', () => {
    const input = 'a\u00A0b\u2013c';
    const output = cleanText(input);
    expect(output).not.toContain('\u00A0');
    expect(output).toContain('-');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(cleanText('   \n  ')).toBe('');
  });
});
