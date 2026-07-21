// Immutable update helpers for the SignatureData payload. Kept framework-free
// and free of any core/* dependency so they are trivially unit-testable and can
// be reused by every UI panel. Every helper returns a NEW object and never
// mutates its input.

import type { ImageSource, SignatureData, SignatureStyle, SocialNetwork } from "../core/types";

// The subset of SignatureData keys whose value is a plain string (identity,
// contact and extras). Object-valued keys (social, logo, photo, style) have
// their own dedicated helpers below.
export type StringFieldKey = {
  [K in keyof SignatureData]: SignatureData[K] extends string ? K : never;
}[keyof SignatureData];

// Update a single flat string field (fullName, email, ctaUrl, templateId, ...).
export function updateField(
  data: SignatureData,
  key: StringFieldKey,
  value: string,
): SignatureData {
  return { ...data, [key]: value };
}

// Merge a partial patch into the nested style object.
export function updateStyle(data: SignatureData, patch: Partial<SignatureStyle>): SignatureData {
  return { ...data, style: { ...data.style, ...patch } };
}

// Set the URL for one social network (empty string hides it).
export function updateSocial(
  data: SignatureData,
  network: SocialNetwork,
  value: string,
): SignatureData {
  return { ...data, social: { ...data.social, [network]: value } };
}

// Patch one image slot (logo or photo): kind, value and/or width.
export function updateImage(
  data: SignatureData,
  slot: "logo" | "photo",
  patch: Partial<ImageSource>,
): SignatureData {
  return { ...data, [slot]: { ...data[slot], ...patch } };
}

// ---- Character budget severity --------------------------------------------
// Gmail truncates a signature past a hard character limit and starts to risk
// clipping well before it. The thresholds themselves live in core/render.ts;
// this pure classifier keeps the display logic testable without importing them.
export type CharSeverity = "ok" | "warn" | "over";

export function charCountSeverity(count: number, warn: number, limit: number): CharSeverity {
  if (count >= limit) return "over";
  if (count >= warn) return "warn";
  return "ok";
}
