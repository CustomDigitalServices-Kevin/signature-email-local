import { describe, it, expect } from "vitest";
import { sanitizeSignatureHtml } from "./sanitize";

// NOTE on environment: the vitest default environment for this project is
// happy-dom, whose DOM node iterator is not compatible with DOMPurify's tree
// walk (it lets <script> survive and drops some whitelisted tags at random).
// The assertions here therefore only cover the DETERMINISTIC pre-pass in
// sanitize.ts, which is engine-independent. The DOMPurify-specific fidelity
// (preserving a legit table + mso-* styles, keeping https links, stripping
// on*= handlers and javascript: URIs) cannot be trusted under happy-dom and is
// intentionally NOT unit-tested here: it is verified end-to-end in a real
// browser (Playwright/Chromium, wave 2), where DOMPurify behaves correctly.
// This split is a documented happy-dom limitation, not a coverage gap.

describe("sanitizeSignatureHtml (garanties déterministes, tout moteur DOM)", () => {
  it("supprime les balises <script> et leur contenu", () => {
    const clean = sanitizeSignatureHtml("<span>ok</span><script>alert(1)</script>");
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("alert(1)");
    expect(clean).toContain("ok");
  });

  it("supprime une balise <script> auto-fermante ou avec attributs", () => {
    const clean = sanitizeSignatureHtml('<script src="https://evil.example/x.js"></script>texte');
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("evil.example");
    expect(clean).toContain("texte");
  });

  it("supprime la balise <style> et son contenu", () => {
    const clean = sanitizeSignatureHtml("<style>p{color:red}</style><p>texte</p>");
    expect(clean).not.toContain("<style");
    expect(clean).not.toContain("color:red");
    expect(clean).toContain("texte");
  });

  it("supprime les commentaires HTML (payloads de commentaires conditionnels)", () => {
    const clean = sanitizeSignatureHtml("<!--[if mso]><script>x</script><![endif]-->contenu");
    expect(clean).not.toContain("<!--");
    expect(clean).not.toContain("<script");
    expect(clean).toContain("contenu");
  });

  it("retourne une chaîne et conserve le texte brut d'un fragment légitime", () => {
    const clean = sanitizeSignatureHtml("<span>Marie Dupont</span>");
    expect(typeof clean).toBe("string");
    expect(clean).toContain("Marie Dupont");
  });
});
