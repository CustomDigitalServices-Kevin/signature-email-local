// ============================================================================
// Minimal templates — one-liners, big accent name, and a centered vCard.
// ============================================================================

import type { EmailSignatureTemplate, SignatureData } from "../core/types";
import {
  bodyText,
  heading,
  identityBlock,
  link,
  mailtoLink,
  roundPhoto,
  table,
  telLink,
} from "./helpers";

// ---- minimal-oneline -------------------------------------------------------

function renderOneline(data: SignatureData): string {
  const s = data.style;
  const linkStyle = `font-family:${s.fontFamily};font-size:${s.fontSize}px;color:${s.linkColor};text-decoration:none;`;
  const parts: string[] = [heading(data.fullName, s, s.fontSize + 1, s.textColor)];
  if (data.jobTitle.trim() !== "") parts.push(bodyText(data.jobTitle, s));
  if (data.phone.trim() !== "") parts.push(link(telLink(data.phone), data.phone, linkStyle));
  if (data.email.trim() !== "") parts.push(link(mailtoLink(data.email), data.email, linkStyle));
  const sep = `<span style="color:${s.accentColor};font-weight:bold;"> &bull; </span>`;
  const cellStyle = `font-family:${s.fontFamily};font-size:${s.fontSize}px;line-height:1.6;`;
  return table(`<tr><td style="${cellStyle}">${parts.join(sep)}</td></tr>`);
}

// ---- minimal-name-accent ---------------------------------------------------

function renderNameAccent(data: SignatureData): string {
  return identityBlock(data, data.style, {
    nameColor: data.style.accentColor,
    nameSize: data.style.fontSize + 9,
  });
}

// ---- minimal-vcard ---------------------------------------------------------

function renderVcard(data: SignatureData): string {
  const inner = identityBlock(data, data.style, { align: "center" });
  const photo = roundPhoto(data.photo, data.fullName, 72, data.style);
  const rows =
    `<tr><td align="center" style="padding-bottom:10px;">${photo}</td></tr>` +
    `<tr><td align="center">${inner}</td></tr>`;
  return table(rows, "text-align:center;");
}

// ---- Exports ---------------------------------------------------------------

export const minimalOneline: EmailSignatureTemplate = {
  id: "minimal-oneline",
  name: { fr: "Minimal une ligne", en: "Minimal One-line" },
  description: {
    fr: "Une seule ligne compacte : nom, titre, telephone, email.",
    en: "A single compact line: name, title, phone, email.",
  },
  category: "minimal",
  capabilities: {
    photo: false,
    logo: false,
    social: false,
    cta: false,
    disclaimer: false,
    tagline: false,
  },
  render: renderOneline,
};

export const minimalNameAccent: EmailSignatureTemplate = {
  id: "minimal-name-accent",
  name: { fr: "Minimal nom accent", en: "Minimal Name Accent" },
  description: {
    fr: "Nom en grand couleur accent, le reste discret et fin.",
    en: "Large accent-coloured name, everything else discreet.",
  },
  category: "minimal",
  capabilities: {
    photo: false,
    logo: false,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: true,
  },
  render: renderNameAccent,
};

export const minimalVcard: EmailSignatureTemplate = {
  id: "minimal-vcard",
  name: { fr: "Minimal carte de visite", en: "Minimal vCard" },
  description: {
    fr: "Vertical centre facon carte de visite.",
    en: "Vertically centered, business-card style.",
  },
  category: "minimal",
  capabilities: {
    photo: true,
    logo: false,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: true,
  },
  render: renderVcard,
};
