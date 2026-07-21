// ============================================================================
// Images (logo / photo) and social badges.
//
// SOCIAL ICONS ARE TEXT BADGES, NOT IMAGES: a coloured <td> with a short white
// glyph ("in", "X", "GH"...) renders identically in Outlook desktop, Gmail,
// Apple Mail and mobile. SVG data URIs do NOT render in Outlook desktop and
// remote PNGs need hosting + get blocked by default — so we deliberately avoid
// binary/vector icon assets entirely.
// ============================================================================

import type { ImageSource, SignatureStyle, SocialLinks, SocialNetwork } from "../core/types";
import { SOCIAL_NETWORKS } from "../core/types";
import { table } from "./layout";
import { attr, escapeHtml } from "./text";
import { normalizeUrl } from "./url";

/** True when an image source is actually renderable (has a kind and a value). */
export function hasImage(image: ImageSource): boolean {
  return image.kind !== "none" && image.value.trim() !== "";
}

/**
 * A block image with explicit width/height and the reset styles email clients
 * need. `height` defaults to `width` (square) when omitted.
 */
export function img(image: ImageSource, alt: string, extraStyle = "", height?: number): string {
  const h = height ?? image.width;
  const style = `display:block;border:0;outline:none;text-decoration:none;${extraStyle}`;
  return `<img src="${attr(image.value)}" width="${image.width}" height="${h}" alt="${attr(
    alt,
  )}" style="${style}" />`;
}

/**
 * A logo image. Unlike a photo it is not square: we emit explicit width/height
 * attributes (required by Outlook) but also `height:auto` so every CSS-aware
 * client keeps the real aspect ratio. The height attribute assumes a ~3:1
 * wordmark so Outlook desktop (which ignores `height:auto`) stays close.
 */
export function logoImg(logo: ImageSource, alt: string, extra = ""): string {
  const w = logo.width;
  const h = Math.max(1, Math.round(w * 0.33));
  return `<img src="${attr(logo.value)}" width="${w}" height="${h}" alt="${attr(
    alt,
  )}" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:${w}px;${extra}" />`;
}

/** Uppercase initials (max two) from a full name; falls back to "?". */
export function initials(fullName: string): string {
  const words = fullName
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (words.length === 0) return "?";
  const first = words[0]?.charAt(0) ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.charAt(0) ?? "") : "";
  const result = (first + last).toUpperCase();
  return result === "" ? "?" : result;
}

/**
 * A round photo when one is provided, otherwise a coloured initials disc so
 * photo-centric templates degrade gracefully. `size` is the square edge in px.
 */
export function roundPhoto(
  photo: ImageSource,
  fullName: string,
  size: number,
  style: SignatureStyle,
): string {
  if (hasImage(photo)) {
    return img(photo, fullName, `border-radius:50%;`, size);
  }
  const glyphSize = Math.round(size * 0.4);
  const cell =
    `<tr><td align="center" valign="middle" width="${size}" height="${size}" ` +
    `bgcolor="${style.accentColor}" style="width:${size}px;height:${size}px;border-radius:50%;` +
    `color:#ffffff;font-family:${style.fontFamily};font-size:${glyphSize}px;font-weight:bold;` +
    `line-height:${size}px;text-align:center;">${escapeHtml(initials(fullName))}</td></tr>`;
  return table(cell);
}

// ---- Social badges ---------------------------------------------------------

interface SocialMeta {
  label: string;
  brandColor: string;
}

/** Short white glyph + brand colour per network (no image assets involved). */
const SOCIAL_META: Readonly<Record<SocialNetwork, SocialMeta>> = {
  linkedin: { label: "in", brandColor: "#0A66C2" },
  twitter: { label: "X", brandColor: "#14171A" },
  instagram: { label: "IG", brandColor: "#E4405F" },
  github: { label: "GH", brandColor: "#24292F" },
  facebook: { label: "f", brandColor: "#1877F2" },
  youtube: { label: "YT", brandColor: "#FF0000" },
};

export interface SocialBadgeOptions {
  /** Use each network's brand colour instead of the signature accent colour. */
  useBrandColors?: boolean;
  /** Square badge edge in px. */
  size?: number;
  /** Corner radius in px (0 = square badge). */
  radius?: number;
}

/**
 * A single-row table of clickable square badges, one per non-empty social URL,
 * in the canonical `SOCIAL_NETWORKS` order. Returns "" when no network is set.
 */
export function renderSocialBadges(
  social: SocialLinks,
  style: SignatureStyle,
  options: SocialBadgeOptions = {},
): string {
  const useBrandColors = options.useBrandColors ?? false;
  const size = options.size ?? 26;
  const radius = options.radius ?? 6;
  const cells: string[] = [];

  for (const network of SOCIAL_NETWORKS) {
    const url = social[network].trim();
    if (url === "") continue;
    const meta = SOCIAL_META[network];
    const bg = useBrandColors ? meta.brandColor : style.accentColor;
    if (cells.length > 0) {
      cells.push(`<td width="6" style="width:6px;font-size:0;line-height:0;">&nbsp;</td>`);
    }
    const anchor =
      `<a href="${attr(normalizeUrl(url))}" ` +
      `style="color:#ffffff;text-decoration:none;display:block;line-height:${size}px;">` +
      `${escapeHtml(meta.label)}</a>`;
    cells.push(
      `<td align="center" valign="middle" width="${size}" height="${size}" bgcolor="${bg}" ` +
        `style="width:${size}px;height:${size}px;border-radius:${radius}px;color:#ffffff;` +
        `font-family:${style.fontFamily};font-size:12px;font-weight:bold;line-height:${size}px;` +
        `text-align:center;">${anchor}</td>`,
    );
  }

  if (cells.length === 0) return "";
  return table(`<tr>${cells.join("")}</tr>`);
}
