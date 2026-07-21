// ============================================================================
// Modern templates — photo/logo columns, badge rows, CTA and a dev variant.
// ============================================================================

import type { EmailSignatureTemplate, SignatureData, SignatureStyle } from "../core/types";
import {
  accentRule,
  ctaButton,
  displayUrl,
  hasImage,
  heading,
  identityBlock,
  link,
  logoImg,
  renderContactTable,
  renderSocialBadges,
  roundPhoto,
  span,
  table,
  titleCompanyLine,
} from "./helpers";

const MONO_STACK = 'Consolas, "Courier New", monospace';

// ---- modern-photo-left -----------------------------------------------------

function renderPhotoLeft(data: SignatureData): string {
  const info = identityBlock(data, data.style);
  const cols =
    `<tr>` +
    `<td valign="top" style="padding-right:16px;">${roundPhoto(data.photo, data.fullName, 84, data.style)}</td>` +
    `<td valign="top" width="3" bgcolor="${data.style.accentColor}" style="width:3px;font-size:0;line-height:0;">&nbsp;</td>` +
    `<td valign="top" style="padding-left:16px;">${info}</td>` +
    `</tr>`;
  return table(cols);
}

// ---- modern-logo-right -----------------------------------------------------

function renderLogoRight(data: SignatureData): string {
  const info = identityBlock(data, data.style);
  if (!hasImage(data.logo)) return info;
  const logoAlt = data.company !== "" ? data.company : data.fullName;
  const cols =
    `<tr>` +
    `<td valign="top" style="padding-right:24px;">${info}</td>` +
    `<td valign="top" align="right">${logoImg(data.logo, logoAlt)}</td>` +
    `</tr>`;
  return table(cols);
}

// ---- modern-social-below ---------------------------------------------------

function renderSocialBelow(data: SignatureData): string {
  const rows: string[] = [];
  if (hasImage(data.logo)) {
    const logoAlt = data.company !== "" ? data.company : data.fullName;
    rows.push(`<tr><td style="padding-bottom:10px;">${logoImg(data.logo, logoAlt)}</td></tr>`);
  }
  rows.push(`<tr><td>${identityBlock(data, data.style, { includeSocial: false })}</td></tr>`);
  const social = renderSocialBadges(data.social, data.style, { size: 30, radius: 8 });
  if (social !== "") {
    rows.push(
      `<tr><td style="padding-top:12px;border-top:1px solid ${data.style.mutedColor};">${social}</td></tr>`,
    );
  }
  return table(rows.join(""));
}

// ---- modern-cta-button -----------------------------------------------------

function renderCtaButton(data: SignatureData): string {
  const rows: string[] = [];
  rows.push(`<tr><td>${identityBlock(data, data.style)}</td></tr>`);
  if (data.ctaLabel.trim() !== "" && data.ctaUrl.trim() !== "") {
    rows.push(
      `<tr><td style="padding-top:14px;">${ctaButton(data.ctaLabel, data.ctaUrl, data.style)}</td></tr>`,
    );
  }
  return table(rows.join(""));
}

// ---- modern-tech-dev -------------------------------------------------------

function renderTechDev(data: SignatureData): string {
  const style = data.style;
  const monoStyle: SignatureStyle = { ...style, fontFamily: MONO_STACK };
  const nameSize = style.fontSize + 5;
  const rows: string[] = [];
  const cell = (content: string, extra = ""): string =>
    `<tr><td style="padding:0;${extra}">${content}</td></tr>`;

  const nameLine =
    span("</> ", `font-family:${MONO_STACK};font-size:${nameSize}px;color:${style.accentColor};`) +
    heading(data.fullName, style, nameSize, style.textColor);
  rows.push(cell(nameLine));
  if (data.tagline.trim() !== "") {
    rows.push(
      cell(
        span(
          data.tagline,
          `font-family:${MONO_STACK};font-size:${style.fontSize}px;color:${style.mutedColor};`,
        ),
        "padding-top:2px;",
      ),
    );
  }
  rows.push(cell(accentRule(style, 60, 2), "padding:8px 0;"));
  const tc = titleCompanyLine(data, style);
  if (tc !== "") rows.push(cell(tc, "padding-bottom:8px;"));
  const contact = renderContactTable(data, monoStyle);
  if (contact !== "") rows.push(cell(contact));
  if (data.social.github.trim() !== "") {
    const gh =
      span(
        "$ ",
        `font-family:${MONO_STACK};font-size:${style.fontSize}px;color:${style.accentColor};`,
      ) +
      link(
        data.social.github,
        displayUrl(data.social.github),
        `font-family:${MONO_STACK};font-size:${style.fontSize}px;color:${style.linkColor};text-decoration:none;font-weight:bold;`,
      );
    rows.push(cell(gh, "padding-top:6px;"));
  }
  const social = renderSocialBadges(data.social, style, { useBrandColors: true });
  if (social !== "") rows.push(cell(social, "padding-top:10px;"));
  return table(rows.join(""));
}

// ---- Exports ---------------------------------------------------------------

const caps = (
  over: Partial<Record<"photo" | "logo" | "social" | "cta" | "disclaimer" | "tagline", boolean>>,
) => ({
  photo: false,
  logo: false,
  social: true,
  cta: false,
  disclaimer: false,
  tagline: true,
  ...over,
});

export const modernPhotoLeft: EmailSignatureTemplate = {
  id: "modern-photo-left",
  name: { fr: "Moderne photo gauche", en: "Modern Photo Left" },
  description: {
    fr: "Photo ronde a gauche, infos a droite avec filet vertical accent.",
    en: "Round photo left, info right with a vertical accent divider.",
  },
  category: "modern",
  capabilities: caps({ photo: true }),
  render: renderPhotoLeft,
};

export const modernLogoRight: EmailSignatureTemplate = {
  id: "modern-logo-right",
  name: { fr: "Moderne logo droite", en: "Modern Logo Right" },
  description: {
    fr: "Infos a gauche, logo de la societe a droite.",
    en: "Info on the left, company logo on the right.",
  },
  category: "modern",
  capabilities: caps({ logo: true }),
  render: renderLogoRight,
};

export const modernSocialBelow: EmailSignatureTemplate = {
  id: "modern-social-below",
  name: { fr: "Moderne social dessous", en: "Modern Social Below" },
  description: {
    fr: "Coordonnees puis rangee de badges sociaux mis en avant.",
    en: "Contact details then a prominent row of social badges.",
  },
  category: "modern",
  capabilities: caps({ logo: true }),
  render: renderSocialBelow,
};

export const modernCtaButton: EmailSignatureTemplate = {
  id: "modern-cta-button",
  name: { fr: "Moderne bouton CTA", en: "Modern CTA Button" },
  description: {
    fr: "Infos avec un bouton d'appel a l'action (base sur table).",
    en: "Info with a table-based call-to-action button.",
  },
  category: "modern",
  capabilities: caps({ logo: false, cta: true }),
  render: renderCtaButton,
};

export const modernTechDev: EmailSignatureTemplate = {
  id: "modern-tech-dev",
  name: { fr: "Moderne tech dev", en: "Modern Tech Dev" },
  description: {
    fr: "Ton developpeur, GitHub mis en avant, police mono.",
    en: "Developer tone, GitHub highlighted, monospace accents.",
  },
  category: "modern",
  capabilities: caps({ social: true }),
  render: renderTechDev,
};
