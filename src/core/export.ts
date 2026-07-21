// Wrap a signature fragment into a standalone HTML document (for the preview
// iframe and the exported .html file) and trigger a client-side download. No
// network, no server: the file is built from a Blob and offered via an object
// URL.

// Envelope used both by the live preview (iframe srcdoc) and the downloaded
// file. The light background mimics a typical mail client reading pane.
export function buildSignatureDocument(innerHtml: string, opts?: { background?: string }): string {
  const background = opts?.background ?? "#ffffff";
  return (
    "<!doctype html>" +
    '<html><head><meta charset="utf-8"></head>' +
    `<body style="margin:0;padding:16px;background:${background}">` +
    innerHtml +
    "</body></html>"
  );
}

export function downloadHtmlFile(html: string, filename: string): void {
  try {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  } catch {
    // Download relies on the Blob + object-URL + DOM APIs; if any is missing we
    // fail silently rather than crash the export action.
  }
}
