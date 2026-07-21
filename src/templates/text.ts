// ============================================================================
// Escaping + inline text spans. No layout here — just safe text primitives.
// ============================================================================

import type { SignatureStyle } from "../core/types";

const HTML_ESCAPES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape the five HTML-significant characters in text or attribute content. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

/** Escape a value destined for an HTML attribute (same rules as text). */
export function attr(value: string): string {
  return escapeHtml(value);
}

/** An inline span of escaped text with an author-controlled inline style. */
export function span(text: string, styleValue: string): string {
  return `<span style="${styleValue}">${escapeHtml(text)}</span>`;
}

/** A bold heading span (used for the person's name). */
export function heading(
  text: string,
  style: SignatureStyle,
  size: number,
  color: string,
  extra = "",
): string {
  return span(
    text,
    `font-family:${style.fontFamily};font-size:${size}px;font-weight:bold;color:${color};line-height:1.3;${extra}`,
  );
}

/** A muted secondary-text span at the base font size. */
export function muted(text: string, style: SignatureStyle, extra = ""): string {
  return span(
    text,
    `font-family:${style.fontFamily};font-size:${style.fontSize}px;color:${style.mutedColor};line-height:1.5;${extra}`,
  );
}

/** A primary-text span at the base font size. */
export function bodyText(text: string, style: SignatureStyle, extra = ""): string {
  return span(
    text,
    `font-family:${style.fontFamily};font-size:${style.fontSize}px;color:${style.textColor};line-height:1.5;${extra}`,
  );
}
