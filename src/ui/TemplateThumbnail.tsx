// A live, scaled-down preview of a template rendered with its own preset. The
// real template.render() output is reused (so a thumbnail always matches the
// full preview), sanitized, then made inert — anchors become spans and their
// href/target are dropped so no interactive element sits inside the gallery
// button and no extra tab stop is created. The result is injected once (memoized
// on the stable template + preset) and clipped inside a scaled container.

import { useMemo } from "react";
import type { EmailSignatureTemplate, SignatureData, SignatureStyle } from "../core/types";
import { sanitizeSignatureHtml } from "../core/sanitize";

// Percent-encode an SVG into a data: URI usable as an <img src>. ASCII-only SVG,
// so encodeURIComponent yields a valid URI (data: is allowed by the CSP img-src
// and by the sanitizer whitelist).
function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// A neutral round avatar placeholder for photo slots.
const AVATAR_URI = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
    '<rect width="96" height="96" rx="48" fill="#e5e7eb"/>' +
    '<circle cx="48" cy="38" r="17" fill="#9ca3af"/>' +
    '<rect x="21" y="60" width="54" height="30" rx="15" fill="#9ca3af"/></svg>',
);

// A logo placeholder tinted with the preset accent so each thumbnail's logo
// matches its palette.
function logoUri(accent: string): string {
  return svgDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="34">' +
      `<rect width="120" height="34" rx="6" fill="${accent}"/>` +
      '<text x="14" y="23" font-family="Arial, sans-serif" font-size="15" ' +
      'font-weight="700" fill="#ffffff">LOGO</text></svg>',
  );
}

// Compact but capability-rich demo data so every template shows its structure
// (photo/logo slot, social row, CTA) in the thumbnail.
function demoData(style: SignatureStyle): SignatureData {
  return {
    fullName: "Alex Martin",
    jobTitle: "Product Designer",
    company: "Studio Nord",
    department: "",
    phone: "+33 1 23 45 67 89",
    mobile: "",
    email: "alex@studio-nord.com",
    website: "https://studio-nord.com",
    address: "",
    social: {
      linkedin: "https://linkedin.com/in/alexmartin",
      twitter: "https://x.com/alexmartin",
      instagram: "https://instagram.com/alexmartin",
      github: "",
      facebook: "",
      youtube: "",
    },
    logo: { kind: "data", value: logoUri(style.accentColor), width: 120 },
    photo: { kind: "data", value: AVATAR_URI, width: 84 },
    tagline: "Design that ships",
    disclaimer: "",
    ctaLabel: "Book a call",
    ctaUrl: "https://cal.com/alexmartin",
    templateId: "",
    style,
  };
}

// Turn sanitized signature HTML into inert markup: anchors become spans (keeping
// their inline style, dropping href/target) so the thumbnail carries no
// interactive content and no focusable node inside the gallery button.
function inert(html: string): string {
  return html
    .replace(/<a(\s|>)/gi, "<span$1")
    .replace(/<\/a\s*>/gi, "</span>")
    .replace(/\shref="[^"]*"/gi, "")
    .replace(/\starget="[^"]*"/gi, "");
}

interface TemplateThumbnailProps {
  template: EmailSignatureTemplate;
  style: SignatureStyle;
}

export function TemplateThumbnail({ template, style }: TemplateThumbnailProps) {
  const html = useMemo(
    () => inert(sanitizeSignatureHtml(template.render(demoData(style)))),
    [template, style],
  );
  return (
    <span className="tpl-thumb" aria-hidden="true">
      <span className="tpl-thumb-inner" dangerouslySetInnerHTML={{ __html: html }} />
    </span>
  );
}
