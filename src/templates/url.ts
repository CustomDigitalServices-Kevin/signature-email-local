// ============================================================================
// URL / link helpers: mailto, tel, scheme normalization and styled anchors.
// ============================================================================

import { attr, escapeHtml } from "./text";

/** Build a `mailto:` href from an email address (escaped for an attribute). */
export function mailtoLink(email: string): string {
  return `mailto:${attr(email.trim())}`;
}

/** Build a `tel:` href, stripping spaces and common separators. */
export function telLink(phone: string): string {
  const compact = phone.replace(/[^\d+]/g, "");
  return `tel:${attr(compact)}`;
}

/**
 * Ensure a URL carries an explicit scheme so it is treated as absolute by mail
 * clients. Empty input yields an empty string (caller must guard).
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed === "") return "";
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/** Strip the scheme (and any trailing slash) for a compact display label. */
export function displayUrl(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

/**
 * A styled anchor. `href` and `text` are escaped; `styleValue` is authored
 * inline by the template and trusted.
 */
export function link(href: string, text: string, styleValue: string): string {
  return `<a href="${attr(href)}" style="${styleValue}">${escapeHtml(text)}</a>`;
}
