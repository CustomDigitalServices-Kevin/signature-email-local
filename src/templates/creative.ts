// ============================================================================
// Creative templates — accent bar, colourful social row, photo card, freelance.
// ============================================================================

import type { EmailSignatureTemplate, SignatureData } from "../core/types";
import {
  accentRule,
  ctaButton,
  hasImage,
  heading,
  identityBlock,
  logoImg,
  renderContactTable,
  renderSocialBadges,
  roundPhoto,
  span,
  table,
  titleCompanyLine,
} from "./helpers";

function cell(content: string, extra = ""): string {
  return `<tr><td style="padding:0;${extra}">${content}</td></tr>`;
}

// ---- creative-gradient-bar -------------------------------------------------

function renderGradientBar(data: SignatureData): string {
  const style = data.style;
  // Real gradient in CSS-aware clients; bgcolor keeps a solid accent in Outlook.
  const barStyle =
    `width:6px;font-size:0;line-height:0;` +
    `background-image:linear-gradient(180deg, ${style.accentColor}, ${style.linkColor});`;
  const cols =
    `<tr>` +
    `<td width="6" valign="top" bgcolor="${style.accentColor}" style="${barStyle}">&nbsp;</td>` +
    `<td valign="top" style="padding-left:16px;">${identityBlock(data, style)}</td>` +
    `</tr>`;
  return table(cols);
}

// ---- creative-social-row ---------------------------------------------------

function renderSocialRow(data: SignatureData): string {
  const style = data.style;
  const rows: string[] = [];
  if (hasImage(data.logo)) {
    const alt = data.company !== "" ? data.company : data.fullName;
    rows.push(cell(logoImg(data.logo, alt), "padding-bottom:10px;"));
  }
  rows.push(cell(identityBlock(data, style, { includeSocial: false })));
  const social = renderSocialBadges(data.social, style, {
    useBrandColors: true,
    size: 34,
    radius: 10,
  });
  if (social !== "") rows.push(cell(social, "padding-top:12px;"));
  return table(rows.join(""));
}

// ---- creative-photo-card ---------------------------------------------------

function renderPhotoCard(data: SignatureData): string {
  const style = data.style;
  const inner = table(
    `<tr>` +
      `<td valign="top" style="padding-right:14px;">${roundPhoto(data.photo, data.fullName, 72, style)}</td>` +
      `<td valign="top">${identityBlock(data, style)}</td>` +
      `</tr>`,
  );
  const card =
    `<tr><td style="background-color:#f7f7f9;border:1px solid #e2e2e8;border-radius:8px;` +
    `padding:14px 16px;">${inner}</td></tr>`;
  return table(card);
}

// ---- creative-freelance ----------------------------------------------------

function renderFreelance(data: SignatureData): string {
  const style = data.style;
  const nameSize = style.fontSize + 7;
  const nameRows = [cell(heading(data.fullName, style, nameSize, style.textColor))];
  if (data.tagline.trim() !== "") {
    nameRows.push(
      cell(
        span(
          data.tagline,
          `font-family:${style.fontFamily};font-size:${style.fontSize + 2}px;font-style:italic;font-weight:bold;color:${style.accentColor};line-height:1.3;`,
        ),
        "padding-top:3px;",
      ),
    );
  }
  const nameBlock = table(nameRows.join(""));
  const top = hasImage(data.photo)
    ? table(
        `<tr><td valign="top" style="padding-right:14px;">${roundPhoto(data.photo, data.fullName, 64, style)}</td>` +
          `<td valign="top">${nameBlock}</td></tr>`,
      )
    : nameBlock;

  const rows: string[] = [cell(top)];
  rows.push(cell(accentRule(style, 48, 2), "padding:10px 0;"));
  const tc = titleCompanyLine(data, style);
  if (tc !== "") rows.push(cell(tc, "padding-bottom:8px;"));
  const contact = renderContactTable(data, style);
  if (contact !== "") rows.push(cell(contact));
  const social = renderSocialBadges(data.social, style);
  if (social !== "") rows.push(cell(social, "padding-top:10px;"));
  if (data.ctaLabel.trim() !== "" && data.ctaUrl.trim() !== "") {
    rows.push(cell(ctaButton(data.ctaLabel, data.ctaUrl, style), "padding-top:12px;"));
  }
  return table(rows.join(""));
}

// ---- Exports ---------------------------------------------------------------

export const creativeGradientBar: EmailSignatureTemplate = {
  id: "creative-gradient-bar",
  name: { fr: "Creatif barre degrade", en: "Creative Gradient Bar" },
  description: {
    fr: "Barre verticale coloree accent, infos a droite.",
    en: "Coloured vertical accent bar with info on the right.",
  },
  category: "creative",
  capabilities: {
    photo: false,
    logo: false,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: true,
  },
  render: renderGradientBar,
};

export const creativeSocialRow: EmailSignatureTemplate = {
  id: "creative-social-row",
  name: { fr: "Creatif rangee sociale", en: "Creative Social Row" },
  description: {
    fr: "Rangee d'icones sociales proeminente et coloree.",
    en: "Prominent, colourful row of social icons.",
  },
  category: "creative",
  capabilities: {
    photo: false,
    logo: true,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: true,
  },
  render: renderSocialRow,
};

export const creativePhotoCard: EmailSignatureTemplate = {
  id: "creative-photo-card",
  name: { fr: "Creatif carte photo", en: "Creative Photo Card" },
  description: {
    fr: "Carte avec photo, fond tres leger et bordure.",
    en: "Card with a photo, very light background and a border.",
  },
  category: "creative",
  capabilities: {
    photo: true,
    logo: false,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: true,
  },
  render: renderPhotoCard,
};

export const creativeFreelance: EmailSignatureTemplate = {
  id: "creative-freelance",
  name: { fr: "Creatif freelance", en: "Creative Freelance" },
  description: {
    fr: "Nom et slogan mis en avant, ton personnel, bouton optionnel.",
    en: "Name and tagline up front, personal tone, optional button.",
  },
  category: "creative",
  capabilities: {
    photo: true,
    logo: false,
    social: true,
    cta: true,
    disclaimer: false,
    tagline: true,
  },
  render: renderFreelance,
};
