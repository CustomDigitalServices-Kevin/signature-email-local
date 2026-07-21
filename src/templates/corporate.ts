// ============================================================================
// Corporate templates — two-column, banner, centered logo, legal disclaimer.
// ============================================================================

import type { EmailSignatureTemplate, SignatureData } from "../core/types";
import {
  hasImage,
  heading,
  identityBlock,
  logoImg,
  muted,
  renderSocialBadges,
  span,
  table,
} from "./helpers";

// ---- corporate-two-column --------------------------------------------------

function renderTwoColumn(data: SignatureData): string {
  const style = data.style;
  // Company lives in the right column, so blank it in the left identity block.
  const left = identityBlock({ ...data, company: "" }, style, {
    includeSocial: false,
    includeTagline: false,
  });

  const rightRows: string[] = [];
  if (data.company.trim() !== "") {
    rightRows.push(
      `<tr><td>${heading(data.company, style, style.fontSize + 3, style.textColor)}</td></tr>`,
    );
  }
  if (data.department.trim() !== "") {
    rightRows.push(`<tr><td style="padding-top:2px;">${muted(data.department, style)}</td></tr>`);
  }
  if (hasImage(data.logo)) {
    rightRows.push(
      `<tr><td style="padding-top:10px;">${logoImg(data.logo, data.company !== "" ? data.company : data.fullName)}</td></tr>`,
    );
  }
  const social = renderSocialBadges(data.social, style);
  if (social !== "") rightRows.push(`<tr><td style="padding-top:10px;">${social}</td></tr>`);
  const right = table(rightRows.join(""));

  const cols =
    `<tr>` +
    `<td valign="top" style="padding-right:20px;">${left}</td>` +
    `<td valign="top" width="1" bgcolor="${style.mutedColor}" style="width:1px;font-size:0;line-height:0;">&nbsp;</td>` +
    `<td valign="top" style="padding-left:20px;">${right}</td>` +
    `</tr>`;
  return table(cols);
}

// ---- corporate-banner ------------------------------------------------------

function renderBanner(data: SignatureData): string {
  const style = data.style;
  const bannerText = data.company.trim() !== "" ? data.company : data.fullName;
  const bandInner = span(
    bannerText,
    `font-family:${style.fontFamily};font-size:${style.fontSize + 3}px;font-weight:bold;color:#ffffff;`,
  );
  const rows: string[] = [];
  rows.push(
    `<tr><td bgcolor="${style.accentColor}" style="padding:10px 16px;">${bandInner}</td></tr>`,
  );
  if (hasImage(data.logo)) {
    rows.push(`<tr><td style="padding:12px 16px 0;">${logoImg(data.logo, bannerText)}</td></tr>`);
  }
  const info = identityBlock({ ...data, company: "" }, style, { includeTagline: false });
  rows.push(`<tr><td style="padding:12px 16px 0;">${info}</td></tr>`);
  return table(rows.join(""), `border:1px solid ${style.mutedColor};border-radius:6px;`);
}

// ---- corporate-logo-top ----------------------------------------------------

function renderLogoTop(data: SignatureData): string {
  const style = data.style;
  const rows: string[] = [];
  if (hasImage(data.logo)) {
    const alt = data.company !== "" ? data.company : data.fullName;
    rows.push(
      `<tr><td align="center" style="padding-bottom:10px;">${logoImg(data.logo, alt)}</td></tr>`,
    );
  }
  const info = identityBlock(data, style, { align: "center", includeTagline: false });
  rows.push(`<tr><td align="center">${info}</td></tr>`);
  return table(rows.join(""), "text-align:center;");
}

// ---- corporate-legal -------------------------------------------------------

function renderLegal(data: SignatureData): string {
  const style = data.style;
  const rows: string[] = [];
  if (hasImage(data.logo)) {
    const alt = data.company !== "" ? data.company : data.fullName;
    rows.push(`<tr><td style="padding-bottom:10px;">${logoImg(data.logo, alt)}</td></tr>`);
  }
  const info = identityBlock(data, style, { includeSocial: false, includeTagline: false });
  rows.push(`<tr><td>${info}</td></tr>`);
  if (data.disclaimer.trim() !== "") {
    const box = table(
      `<tr><td style="border:1px solid ${style.mutedColor};border-radius:4px;padding:8px 10px;">` +
        span(
          data.disclaimer,
          `font-family:${style.fontFamily};font-size:11px;color:${style.mutedColor};line-height:1.4;`,
        ) +
        `</td></tr>`,
    );
    rows.push(`<tr><td style="padding-top:12px;">${box}</td></tr>`);
  }
  return table(rows.join(""));
}

// ---- Exports ---------------------------------------------------------------

export const corporateTwoColumn: EmailSignatureTemplate = {
  id: "corporate-two-column",
  name: { fr: "Corporate deux colonnes", en: "Corporate Two-column" },
  description: {
    fr: "Deux colonnes separees par un filet vertical (coordonnees | societe).",
    en: "Two columns split by a vertical rule (contact | company).",
  },
  category: "corporate",
  capabilities: {
    photo: false,
    logo: true,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: false,
  },
  render: renderTwoColumn,
};

export const corporateBanner: EmailSignatureTemplate = {
  id: "corporate-banner",
  name: { fr: "Corporate banniere", en: "Corporate Banner" },
  description: {
    fr: "Bande societe horizontale (fond accent), infos dessous.",
    en: "Horizontal company band (accent background), info below.",
  },
  category: "corporate",
  capabilities: {
    photo: false,
    logo: true,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: false,
  },
  render: renderBanner,
};

export const corporateLogoTop: EmailSignatureTemplate = {
  id: "corporate-logo-top",
  name: { fr: "Corporate logo haut", en: "Corporate Logo Top" },
  description: {
    fr: "Logo centre en haut, infos centrees dessous.",
    en: "Centered logo on top, centered info below.",
  },
  category: "corporate",
  capabilities: {
    photo: false,
    logo: true,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: false,
  },
  render: renderLogoTop,
};

export const corporateLegal: EmailSignatureTemplate = {
  id: "corporate-legal",
  name: { fr: "Corporate legal", en: "Corporate Legal" },
  description: {
    fr: "Infos avec un bloc de mention legale / RGPD encadre.",
    en: "Info with a framed legal / GDPR disclaimer block.",
  },
  category: "corporate",
  capabilities: {
    photo: false,
    logo: true,
    social: false,
    cta: false,
    disclaimer: true,
    tagline: false,
  },
  render: renderLegal,
};
