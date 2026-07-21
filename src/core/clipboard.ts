// Copy the signature to the clipboard as rich HTML so a paste into Gmail /
// Outlook / Apple Mail keeps the formatting (and re-hosts data: images in
// Gmail). The HTML reaching these functions is already sanitized by the core.
//
// WebKit gesture rule: navigator.clipboard.write MUST be reached synchronously
// inside the click handler. Any `await` before the call detaches it from the
// user gesture and Safari rejects the write. The Blobs are built synchronously
// and the write promise is returned as-is.

export function isClipboardRichSupported(): boolean {
  // lib.dom types navigator.clipboard as non-nullable, but it is genuinely
  // absent in insecure contexts / older browsers. Narrow through `unknown` so
  // the runtime guard is real (and eslint does not flag it as unnecessary).
  const clip: unknown = navigator.clipboard;
  return (
    typeof ClipboardItem !== "undefined" &&
    typeof clip === "object" &&
    clip !== null &&
    "write" in clip &&
    typeof clip.write === "function"
  );
}

// Plain-text counterpart of the HTML, used for the "text/plain" clipboard
// flavour. Tags are stripped first, then the handful of entities a signature
// realistically contains are decoded (after stripping, so a decoded `<` can
// never re-form a tag).
export function htmlToPlain(html: string): string {
  return html
    .replace(/<\s*(br|\/p|\/div|\/tr|\/h[1-3])\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Fallback for browsers without the async Clipboard API: select an off-screen
// contenteditable holding the rich HTML and run the (deprecated) execCommand
// copy. Returns whether the copy succeeded.
export function copyRichHtmlFallback(html: string): boolean {
  const container = document.createElement("div");
  container.setAttribute("contenteditable", "true");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.opacity = "0";
  container.innerHTML = html;
  document.body.appendChild(container);
  try {
    const selection = window.getSelection();
    if (selection === null) {
      return false;
    }
    const range = document.createRange();
    range.selectNodeContents(container);
    selection.removeAllRanges();
    selection.addRange(range);
    // execCommand is deprecated but is the only SYNCHRONOUS copy path for
    // browsers without the async Clipboard API; used intentionally as a
    // last-resort fallback, guarded by isClipboardRichSupported().
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const copied = document.execCommand("copy");
    selection.removeAllRanges();
    return copied;
  } catch {
    return false;
  } finally {
    document.body.removeChild(container);
  }
}

export function copyRichHtml(html: string): Promise<void> {
  if (!isClipboardRichSupported()) {
    const copied = copyRichHtmlFallback(html);
    return copied
      ? Promise.resolve()
      : Promise.reject(new Error("La copie n'est pas supportée par ce navigateur."));
  }
  // Built synchronously, then written immediately: no await precedes write().
  const item = new ClipboardItem({
    "text/html": new Blob([html], { type: "text/html" }),
    "text/plain": new Blob([htmlToPlain(html)], { type: "text/plain" }),
  });
  return navigator.clipboard.write([item]);
}
