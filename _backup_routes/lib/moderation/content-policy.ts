/**
 * Lightweight keyword/pattern scan enforcing the site's content policy:
 * no coercion, no trafficking, no minors. This is a blunt first-pass filter —
 * a real deployment would pair it with human review, not replace it.
 */

const BANNED_PATTERNS: RegExp[] = [
  // Suspected coercion / trafficking language
  /\bforced\b/i,
  /\bagainst (her|his|their) will\b/i,
  /\btrafficking\b/i,
  /\bno choice\b/i,
  /\bowner\b.*\b(girl|woman|women)\b/i,
  // Suspected minors — age or school references combined with service language
  /\b(under\s?age|underage)\b/i,
  /\b(1[0-7])\s?(y\/?o|years?\s?old)\b/i,
  /\bschoolgirl\b/i,
  /\bloli\b/i,
];

export function containsBannedContent(text: string): boolean {
  return BANNED_PATTERNS.some((re) => re.test(text));
}

export function findBannedMatches(text: string): string[] {
  const hits: string[] = [];
  for (const re of BANNED_PATTERNS) {
    const m = text.match(re);
    if (m) hits.push(m[0]);
  }
  return hits;
}
