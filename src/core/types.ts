// ============================================================================
// Shared contract for the whole app. Templates, core logic and UI all depend on
// these types and nothing else, so they can be built independently.
// ============================================================================

export type Locale = "fr" | "en";

export interface LocalizedText {
  fr: string;
  en: string;
}

// ---- Social networks -------------------------------------------------------
// Order here is the canonical display order used by templates and the form.
export const SOCIAL_NETWORKS = [
  "linkedin",
  "twitter",
  "instagram",
  "github",
  "facebook",
  "youtube",
] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

// A social link is the full URL the user pasted. An empty string means the
// network is not shown.
export type SocialLinks = Record<SocialNetwork, string>;

// ---- Images (logo / photo) -------------------------------------------------
// An email signature has no backend to host images. Three strategies, in the
// order the UI presents them:
//   - "url":  a hosted https image URL. The only option Gmail keeps as-is.
//   - "data": a base64 data URI, inlined. Works in Outlook/Apple Mail; Gmail
//             strips it UNLESS the signature is pasted via the rich-copy flow,
//             which makes Gmail re-host the image. The UI must warn about this.
//   - "none": no image.
export type ImageKind = "url" | "data" | "none";

export interface ImageSource {
  kind: ImageKind;
  // The https URL (kind "url") or the full `data:image/...;base64,...` URI
  // (kind "data"). Empty string when kind is "none".
  value: string;
  // Rendered width in px. Height is derived by the template (auto) unless the
  // template needs a square (e.g. round photo), in which case it uses width.
  width: number;
}

// ---- Style -----------------------------------------------------------------
// Web-safe font stacks only: email clients block web fonts and silently fall
// back (Outlook -> Times New Roman). Each entry is a ready-to-inline stack.
export interface FontStack {
  id: string;
  label: string;
  // The exact value to drop into a `font-family:` inline style.
  stack: string;
}

export interface SignatureStyle {
  accentColor: string; // hex, e.g. "#ff6b00" — headings, separators, accents
  textColor: string; // hex — primary text
  mutedColor: string; // hex — secondary text (title, address)
  linkColor: string; // hex — hyperlinks
  fontFamily: string; // a FontStack.stack value
  fontSize: number; // px, base body size (name is derived larger)
}

// ---- The full signature payload -------------------------------------------
export interface SignatureData {
  // Identity
  fullName: string;
  jobTitle: string;
  company: string;
  department: string;
  // Contact (empty string = row hidden)
  phone: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
  // Social
  social: SocialLinks;
  // Media
  logo: ImageSource;
  photo: ImageSource;
  // Extras
  tagline: string; // short slogan under the name
  disclaimer: string; // legal / GDPR footer
  ctaLabel: string; // call-to-action button text (empty = no button)
  ctaUrl: string; // call-to-action target
  // Presentation
  templateId: string;
  style: SignatureStyle;
}

// ---- Templates -------------------------------------------------------------
export type TemplateCategory =
  "classic" | "modern" | "minimal" | "creative" | "corporate" | "compact";

// What a template actually renders, so the form can hide irrelevant inputs and
// show hints ("this template has no photo slot").
export interface TemplateCapabilities {
  photo: boolean;
  logo: boolean;
  social: boolean;
  cta: boolean;
  disclaimer: boolean;
  tagline: boolean;
}

export interface EmailSignatureTemplate {
  // Stable kebab-case id, also used as the localStorage-persisted selection.
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: TemplateCategory;
  capabilities: TemplateCapabilities;
  // Pure function: same data in -> same HTML out. MUST return a self-contained
  // block using tables + inline CSS only (no <style>, no class, no script).
  // The returned HTML is sanitized by the core before it reaches the preview or
  // the clipboard; a template never sanitizes its own output.
  render: (data: SignatureData) => string;
}
