// ============================================================================
// Classic templates — traditional, text-first stacked layouts.
// ============================================================================

import type { EmailSignatureTemplate, SignatureData, SignatureStyle } from "../core/types";
import {
  accentRule,
  hasImage,
  heading,
  logoImg,
  muted,
  renderContactTable,
  renderSocialBadges,
  span,
  table,
  titleCompanyLine,
} from "./helpers";

const SERIF_STACK = 'Georgia, "Times New Roman", Times, serif';

/** A single stacked row inside the outer signature table. */
function row(content: string, tdExtra = ""): string {
  return `<tr><td style="padding:0;${tdExtra}">${content}</td></tr>`;
}

// ---- classic-stacked -------------------------------------------------------

function renderStacked(data: SignatureData): string {
  const nameSize = data.style.fontSize + 5;
  const rows: string[] = [];
  if (hasImage(data.logo)) {
    rows.push(
      row(
        logoImg(data.logo, data.company !== "" ? data.company : data.fullName),
        "padding-bottom:8px;",
      ),
    );
  }
  rows.push(row(heading(data.fullName, data.style, nameSize, data.style.textColor)));
  if (data.tagline.trim() !== "") {
    rows.push(row(muted(data.tagline, data.style, "font-style:italic;"), "padding-top:2px;"));
  }
  rows.push(row(accentRule(data.style, 48, 2), "padding:8px 0;"));
  const tc = titleCompanyLine(data, data.style);
  if (tc !== "") rows.push(row(tc, "padding-bottom:8px;"));
  if (data.department.trim() !== "") {
    rows.push(row(muted(data.department, data.style), "padding-bottom:8px;"));
  }
  rows.push(row(renderContactTable(data, data.style)));
  const social = renderSocialBadges(data.social, data.style);
  if (social !== "") rows.push(row(social, "padding-top:10px;"));
  return table(rows.join(""));
}

// ---- classic-bordered ------------------------------------------------------

function renderBordered(data: SignatureData): string {
  const nameSize = data.style.fontSize + 5;
  const rows: string[] = [];
  rows.push(row(heading(data.fullName, data.style, nameSize, data.style.textColor)));
  if (data.tagline.trim() !== "") {
    rows.push(row(muted(data.tagline, data.style, "font-style:italic;"), "padding-top:2px;"));
  }
  const tc = titleCompanyLine(data, data.style);
  if (tc !== "") rows.push(row(tc, "padding-top:6px;"));
  if (data.department.trim() !== "") {
    rows.push(row(muted(data.department, data.style), "padding-top:4px;"));
  }
  rows.push(row(renderContactTable(data, data.style), "padding-top:8px;"));
  const social = renderSocialBadges(data.social, data.style);
  if (social !== "") rows.push(row(social, "padding-top:10px;"));
  const inner = table(rows.join(""));
  const bordered =
    `<tr><td style="padding:2px 0 2px 16px;border-left:4px solid ${data.style.accentColor};">` +
    `${inner}</td></tr>`;
  return table(bordered);
}

// ---- classic-serif ---------------------------------------------------------

function renderSerif(data: SignatureData): string {
  const style: SignatureStyle = { ...data.style, fontFamily: SERIF_STACK };
  const nameSize = style.fontSize + 6;
  const rows: string[] = [];
  if (hasImage(data.logo)) {
    rows.push(
      row(
        logoImg(data.logo, data.company !== "" ? data.company : data.fullName),
        "padding-bottom:8px;",
      ),
    );
  }
  rows.push(row(heading(data.fullName, style, nameSize, style.textColor, "letter-spacing:0.3px;")));
  const tc = titleCompanyLine(data, style);
  if (tc !== "") rows.push(row(tc, "padding-top:4px;"));
  if (data.department.trim() !== "")
    rows.push(row(muted(data.department, style), "padding-top:2px;"));
  rows.push(
    row(
      table(
        `<tr><td style="border-top:1px solid ${style.mutedColor};font-size:0;line-height:0;">&nbsp;</td></tr>`,
        "width:100%;",
      ),
      "padding:8px 0;",
    ),
  );
  rows.push(row(renderContactTable(data, style)));
  const social = renderSocialBadges(data.social, style);
  if (social !== "") rows.push(row(social, "padding-top:10px;"));
  if (data.tagline.trim() !== "") {
    rows.push(
      row(
        span(
          data.tagline,
          `font-family:${SERIF_STACK};font-size:${style.fontSize}px;font-style:italic;color:${style.mutedColor};`,
        ),
        "padding-top:10px;",
      ),
    );
  }
  return table(rows.join(""));
}

// ---- Exports ---------------------------------------------------------------

export const classicStacked: EmailSignatureTemplate = {
  id: "classic-stacked",
  name: { fr: "Classique empile", en: "Classic Stacked" },
  description: {
    fr: "Infos empilees a gauche, filet accent sous le nom.",
    en: "Left-aligned stacked info with an accent rule under the name.",
  },
  category: "classic",
  capabilities: {
    photo: false,
    logo: true,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: true,
  },
  render: renderStacked,
};

export const classicBordered: EmailSignatureTemplate = {
  id: "classic-bordered",
  name: { fr: "Classique bordure", en: "Classic Bordered" },
  description: {
    fr: "Bloc avec bordure gauche epaisse couleur accent.",
    en: "Block with a thick accent-coloured left border.",
  },
  category: "classic",
  capabilities: {
    photo: false,
    logo: false,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: true,
  },
  render: renderBordered,
};

export const classicSerif: EmailSignatureTemplate = {
  id: "classic-serif",
  name: { fr: "Classique serif", en: "Classic Serif" },
  description: {
    fr: "Police serif elegante et filets fins.",
    en: "Elegant serif typeface with thin separators.",
  },
  category: "classic",
  capabilities: {
    photo: false,
    logo: true,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: true,
  },
  render: renderSerif,
};
