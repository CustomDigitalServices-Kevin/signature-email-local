import { describe, it, expect, vi, afterEach } from "vitest";
import { buildSignatureDocument, downloadHtmlFile } from "./export";

describe("buildSignatureDocument", () => {
  it("contient le doctype, le fragment et le fond par défaut", () => {
    const doc = buildSignatureDocument("<span>Marie</span>");
    expect(doc.startsWith("<!doctype html>")).toBe(true);
    expect(doc).toContain("<span>Marie</span>");
    expect(doc).toContain("background:#ffffff");
  });

  it("respecte un fond personnalisé", () => {
    const doc = buildSignatureDocument("<span>x</span>", { background: "#0e0e12" });
    expect(doc).toContain("background:#0e0e12");
    expect(doc).not.toContain("#ffffff");
  });
});

describe("downloadHtmlFile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("crée un lien avec le bon attribut download puis révoque l'URL", () => {
    // Mocks documentés : on remplace createObjectURL/revokeObjectURL par des
    // espions et on intercepte le clic de l'ancre (jsdom/happy-dom ne
    // déclenchent pas de vrai téléchargement) pour lire l'attribut download.
    const createMock = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const revokeMock = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);

    let capturedDownload: string | null = null;
    let capturedHref: string | null = null;
    const clickMock = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ): void {
      capturedDownload = this.download;
      capturedHref = this.href;
    });

    downloadHtmlFile("<b>x</b>", "signature.html");

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(capturedDownload).toBe("signature.html");
    expect(capturedHref).toContain("blob:mock-url");
    expect(revokeMock).toHaveBeenCalledWith("blob:mock-url");
  });
});
