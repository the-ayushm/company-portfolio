/**
 * Input sanitisation for free-text fields.
 * React escapes output, so we only normalise: strip control characters,
 * remove HTML tags, collapse excessive whitespace and trim.
 */

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const TAGS = /<\/?[a-z][^>]*>/gi;

export function sanitizeText(value: string, { multiline = false } = {}): string {
  let v = value.normalize("NFC").replace(CONTROL_CHARS, "").replace(TAGS, "");
  v = multiline ? v.replace(/\r\n?/g, "\n").replace(/\n{4,}/g, "\n\n\n") : v.replace(/\s+/g, " ");
  return v.trim();
}
