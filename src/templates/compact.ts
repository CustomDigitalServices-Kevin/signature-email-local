// ============================================================================
// Compact template — ultra-condensed, tuned for mobile reading.
// ============================================================================

import type { EmailSignatureTemplate, SignatureData } from "../core/types";
import {
  heading,
  renderContactTable,
  renderSocialBadges,
  table,
  titleCompanyLine,
} from "./helpers";

function renderCompactMobile(data: SignatureData): string {
  const style = data.style;
  const cell = (content: string, extra = ""): string =>
    `<tr><td style="padding:0;${extra}">${content}</td></tr>`;
  const rows: string[] = [cell(heading(data.fullName, style, style.fontSize + 2, style.textColor))];
  const tc = titleCompanyLine(data, style);
  if (tc !== "") rows.push(cell(tc, "padding-top:2px;"));
  const contact = renderContactTable(data, style);
  if (contact !== "") rows.push(cell(contact, "padding-top:6px;"));
  const social = renderSocialBadges(data.social, style, { size: 22, radius: 5 });
  if (social !== "") rows.push(cell(social, "padding-top:8px;"));
  return table(rows.join(""), "max-width:280px;");
}

export const compactMobile: EmailSignatureTemplate = {
  id: "compact-mobile",
  name: { fr: "Compact mobile", en: "Compact Mobile" },
  description: {
    fr: "Ultra condense, optimise pour la lecture sur mobile.",
    en: "Ultra-condensed, optimised for mobile reading.",
  },
  category: "compact",
  capabilities: {
    photo: false,
    logo: false,
    social: true,
    cta: false,
    disclaimer: false,
    tagline: false,
  },
  render: renderCompactMobile,
};
