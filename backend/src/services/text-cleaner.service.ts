export function cleanText(raw: string): string {
  let text = raw;

  // Normalize Unicode to NFC (handles Arabic diacritic ordering, ligatures)
  text = text.normalize('NFC');

  // Remove non-printable control characters (keep \n, \t)
  text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

  // Replace problematic Unicode punctuation with ASCII equivalents
  text = text.replace(/[\u00A0\u202F\u2007]/g, ' ');
  text = text.replace(/\u2013|\u2014/g, '-');

  // Collapse horizontal whitespace runs to a single space
  text = text.replace(/[ \t]+/g, ' ');

  // Remove standalone page-number lines (numbers alone on a line)
  text = text.replace(/^\s*\d+\s*$/gm, '');

  // Remove repeated hyphen/underscore separators (PDF header/footer artifacts)
  text = text.replace(/^\s*[-_=]{3,}\s*$/gm, '');

  // Collapse 3+ blank lines into a single blank line
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace on each line
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  return text.trim();
}
