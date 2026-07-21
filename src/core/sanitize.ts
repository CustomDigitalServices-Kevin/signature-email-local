// Email-safe HTML sanitizer. Every template output and any pasted/imported HTML
// passes through here before it reaches the preview iframe, the clipboard or the
// exported .html file. Templates never sanitize their own output.
//
// The whitelist is intentionally narrow: only the tags and attributes an email
// signature legitimately needs. Inline `style` is kept because email clients
// (Outlook's Word engine in particular) ignore <style> blocks and require inline
// styling; DOMPurify does NOT rewrite inline CSS, so non-standard properties
// like `mso-table-lspace` survive untouched. The <style> TAG itself is dropped
// because it is absent from ALLOWED_TAGS.
import DOMPurify from "dompurify";

// Tags a signature may contain. Anything else is stripped.
const ALLOWED_TAGS = [
  "table",
  "tbody",
  "thead",
  "tr",
  "td",
  "th",
  "a",
  "img",
  "span",
  "font",
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "div",
  "h1",
  "h2",
  "h3",
  "hr",
];

// Attributes a signature may carry. `style` stays (inline styling is mandatory
// for email); every `on*` handler and any unlisted attribute is removed.
const ALLOWED_ATTR = [
  "href",
  "src",
  "alt",
  "width",
  "height",
  "style",
  "align",
  "valign",
  "border",
  "cellpadding",
  "cellspacing",
  "role",
  "target",
  "color",
  "bgcolor",
  "dir",
];

// DOMPurify already blocks `javascript:` URIs via its default ALLOWED_URI_REGEXP.
// This hook is a deterministic second line of defence: it strips any href/src
// whose value resolves to the javascript: scheme after leading whitespace.
function stripDangerousUrl(node: Element): void {
  for (const attr of ["href", "src"] as const) {
    const value = node.getAttribute(attr);
    if (value !== null && /^\s*javascript:/i.test(value)) {
      node.removeAttribute(attr);
    }
  }
}

// The hook is global on the DOMPurify instance; register it exactly once.
let hookRegistered = false;
function ensureHook(): void {
  if (hookRegistered) {
    return;
  }
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    stripDangerousUrl(node);
  });
  hookRegistered = true;
}

// Deterministic pre-pass: strip the two executable/dangerous elements (and HTML
// comments, which can carry conditional-comment payloads) with their full
// content BEFORE DOMPurify. Two reasons:
//   1. Defense in depth — script/style never reach the DOM parser at all.
//   2. Engine independence — DOMPurify relies on the host DOM's node iterator,
//      and some non-browser DOM implementations skip <script> during that walk.
//      Removing these upfront makes the outcome identical on every engine.
// DOMPurify remains the primary sanitizer for tag/attribute whitelisting and
// URI checks; this pre-pass only handles the unambiguous, content-bearing tags.
function stripUnsafeBlocks(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<script\b[^>]*\/?>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "")
    .replace(/<style\b[^>]*\/?>/gi, "");
}

export function sanitizeSignatureHtml(dirty: string): string {
  ensureHook();
  // No RETURN_DOM* flag -> DOMPurify returns a string. Passing ALLOWED_TAGS /
  // ALLOWED_ATTR replaces the defaults with our strict whitelist; anything not
  // listed (including any residual <style>/<script>) is dropped.
  return DOMPurify.sanitize(stripUnsafeBlocks(dirty), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
