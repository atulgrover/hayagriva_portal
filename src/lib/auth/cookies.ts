// admin-panel/src/lib/auth/cookies.ts

/**
 * Safely parses cookie values that may be raw JSON, URI-encoded, double-encoded, or quoted.
 * Guarantees zero thrown exceptions and never triggers Next.js dev error overlays.
 */
export function safeParseJsonCookie<T = any>(rawCookieValue: string | undefined | null): T | null {
  if (!rawCookieValue) return null;
  try {
    let val = rawCookieValue.trim();

    // Strip surrounding quotes if cookie was stored quoted e.g. "..."
    if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
      val = val.slice(1, -1);
    }

    // Unpack multiple layers of URI encoding (e.g. %257B -> %7B -> {)
    let prev = '';
    let iterations = 0;
    while (val.includes('%') && val !== prev && iterations < 4) {
      prev = val;
      try {
        val = decodeURIComponent(val);
      } catch {
        break;
      }
      iterations++;
    }

    // Strip quotes again in case decoded string had outer quotes
    val = val.trim();
    if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
      val = val.slice(1, -1);
    }

    const parsed = JSON.parse(val);
    return parsed as T;
  } catch {
    return null;
  }
}

/**
 * Extracts a cookie value by name from a raw Cookie header string or document.cookie.
 */
export function getCookieValue(cookieString: string | undefined | null, name: string): string | null {
  if (!cookieString) return null;
  const prefix = `${name}=`;
  const cookies = cookieString.split(';');
  for (let c of cookies) {
    const trimmed = c.trim();
    if (trimmed.startsWith(prefix)) {
      return trimmed.substring(prefix.length);
    }
  }
  return null;
}
