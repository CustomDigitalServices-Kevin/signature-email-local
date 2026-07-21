// ============================================================================
// Composed blocks: contact rows, CTA button, and the shared identity stack.
// ============================================================================

import type { SignatureData, SignatureStyle } from "../core/types";
import { accentRule, table } from "./layout";
import { renderSocialBadges } from "./media";
import { attr, bodyText, escapeHtml, heading, muted, span } from "./text";
import { displayUrl, link, mailtoLink, normalizeUrl, telLink } from "./url";

// ---- CTA button ------------------------------------------------------------

/** A table-based call-to-action button (never a real <button>). */
export function ctaButton(label: string, url: string, style: SignatureStyle): string {
  const anchor =
    `<a href="${attr(normalizeUrl(url))}" ` +
    `style="color:#ffffff;text-decoration:none;font-weight:bold;display:block;white-space:nowrap;` +
    `font-family:${style.fontFamily};font-size:13px;">${escapeHtml(label)}</a>`;
  const cell =
    `<tr><td align="center" bgcolor="${style.accentColor}" ` +
    `style="border-radius:6px;padding:9px 18px;">${anchor}</td></tr>`;
  return table(cell);
}

// ---- Contact rows ----------------------------------------------------------

export interface ContactOptions {
  align?: "left" | "center";
  /** Show the short English prefix label ("Tel", "Email"...) before values. */
  labels?: boolean;
}

interface ContactData {
  phone: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
}

interface ContactLine {
  label: string;
  href: string | null;
  display: string;
}

/** The ordered contact lines that are actually filled in, ready to render. */
function collectContactLines(data: ContactData): ContactLine[] {
  const lines: ContactLine[] = [];
  if (data.phone.trim() !== "") {
    lines.push({ label: "Tel", href: telLink(data.phone), display: data.phone });
  }
  if (data.mobile.trim() !== "") {
    lines.push({ label: "Mobile", href: telLink(data.mobile), display: data.mobile });
  }
  if (data.email.trim() !== "") {
    lines.push({ label: "Email", href: mailtoLink(data.email), display: data.email });
  }
  if (data.website.trim() !== "") {
    lines.push({
      label: "Web",
      href: normalizeUrl(data.website),
      display: displayUrl(data.website),
    });
  }
  if (data.address.trim() !== "") {
    lines.push({ label: "Address", href: null, display: data.address });
  }
  return lines;
}

/**
 * A table of contact rows (phone, mobile, email, website, address). Only
 * filled-in fields appear. Returns "" when nothing is set.
 */
export function renderContactTable(
  data: ContactData,
  style: SignatureStyle,
  options: ContactOptions = {},
): string {
  const align = options.align ?? "left";
  const showLabels = options.labels ?? false;
  const lines = collectContactLines(data);
  if (lines.length === 0) return "";

  const baseFont = `font-family:${style.fontFamily};font-size:${style.fontSize}px;line-height:1.5;`;
  const rows = lines
    .map((line) => {
      const prefix = showLabels
        ? span(`${line.label}: `, `color:${style.mutedColor};${baseFont}`)
        : "";
      const body =
        line.href === null
          ? span(line.display, `color:${style.mutedColor};${baseFont}`)
          : link(
              line.href,
              line.display,
              `color:${style.linkColor};text-decoration:none;${baseFont}`,
            );
      return `<tr><td align="${align}" style="padding:1px 0;${baseFont}">${prefix}${body}</td></tr>`;
    })
    .join("");
  return table(rows);
}

// ---- Title / company line --------------------------------------------------

/** "Job Title · Company" on one line (each part optional), styled from `style`. */
export function titleCompanyLine(data: SignatureData, style: SignatureStyle): string {
  const parts: string[] = [];
  if (data.jobTitle.trim() !== "") parts.push(bodyText(data.jobTitle, style, "font-weight:600;"));
  if (data.company.trim() !== "") parts.push(muted(data.company, style));
  if (parts.length === 0) return "";
  const sep = `<span style="color:${style.mutedColor};"> &middot; </span>`;
  return parts.join(sep);
}

// ---- Identity block --------------------------------------------------------

export interface IdentityOptions {
  align?: "left" | "center";
  /** Name font size in px (defaults to base size + 5). */
  nameSize?: number;
  /** Name colour (defaults to the primary text colour). */
  nameColor?: string;
  /** Render the tagline under the name (default true). */
  includeTagline?: boolean;
  /** Render social badges at the bottom (default true). */
  includeSocial?: boolean;
  /** Use brand colours for the social badges (default false). */
  socialBrand?: boolean;
  /** Draw the accent rule under the name (default false). */
  rule?: boolean;
  /** Prefix contact rows with short labels (default false). */
  contactLabels?: boolean;
}

/**
 * The shared identity stack: name, optional tagline, title · company,
 * department, contact rows and optional social badges — as one table. Templates
 * wrap this differently (borders, columns, bars) to stay visually distinct.
 */
export function identityBlock(
  data: SignatureData,
  style: SignatureStyle,
  options: IdentityOptions = {},
): string {
  const align = options.align ?? "left";
  const nameSize = options.nameSize ?? style.fontSize + 5;
  const nameColor = options.nameColor ?? style.textColor;
  const rows: string[] = [];
  const cell = (content: string, extra = ""): string =>
    `<tr><td align="${align}" style="padding:0;${extra}">${content}</td></tr>`;

  rows.push(cell(heading(data.fullName, style, nameSize, nameColor)));
  if (options.includeTagline !== false && data.tagline.trim() !== "") {
    rows.push(cell(muted(data.tagline, style, "font-style:italic;"), "padding-top:2px;"));
  }
  if (options.rule === true) rows.push(cell(accentRule(style, 48, 2), "padding:8px 0;"));
  const tc = titleCompanyLine(data, style);
  if (tc !== "") rows.push(cell(tc, options.rule === true ? "" : "padding-top:6px;"));
  if (data.department.trim() !== "") {
    rows.push(cell(muted(data.department, style), "padding-top:4px;"));
  }
  const contact = renderContactTable(data, style, {
    align,
    labels: options.contactLabels ?? false,
  });
  if (contact !== "") rows.push(cell(contact, "padding-top:8px;"));
  if (options.includeSocial !== false) {
    const social = renderSocialBadges(data.social, style, {
      useBrandColors: options.socialBrand ?? false,
    });
    if (social !== "") rows.push(cell(social, "padding-top:10px;"));
  }
  return table(rows.join(""));
}
