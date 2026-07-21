// Glue between the template registry, the data and the sanitizer. This is the
// single entry point the UI uses to turn a SignatureData into safe, ready-to-copy
// signature HTML.

import type { SignatureData } from "./types";
import { getTemplate, DEFAULT_TEMPLATE_ID } from "../templates";
import { sanitizeSignatureHtml } from "./sanitize";

// Gmail silently truncates any signature longer than this many characters, so
// the UI surfaces a warning as the count approaches it.
export const GMAIL_CHAR_LIMIT = 10_000;
export const GMAIL_CHAR_WARN = 8_000;

/**
 * Render the active template with the given data, then sanitize the result.
 * The template is looked up by id; an unknown id falls back to the default
 * template. Sanitization always runs — a template never emits trusted HTML.
 */
export function renderSignature(data: SignatureData): string {
  const template = getTemplate(data.templateId) ?? getTemplate(DEFAULT_TEMPLATE_ID);
  if (!template) return "";
  return sanitizeSignatureHtml(template.render(data));
}

/** Character length of the rendered signature HTML (Gmail's truncation unit). */
export function countSignatureChars(html: string): number {
  return html.length;
}
