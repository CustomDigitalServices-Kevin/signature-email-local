// ============================================================================
// Per-template style presets. Each template ships its own signature palette
// (accent / text / muted / link) plus a font and base size, so the gallery
// shows 20 visually distinct looks instead of one accent colour repeated.
//
// Selecting a template in the UI applies its preset to the live signature
// (App.onSelectTemplate); the thumbnails in the gallery render with the same
// preset. `classic-stacked` intentionally keeps the historical CDS orange so
// the default first-load look is unchanged.
// ============================================================================

import type { SignatureStyle } from "../core/types";
import { DEFAULT_FONT_STACK, FONT_STACKS } from "../core/fonts";

// Resolve a FontStack id to its exact inline `font-family` value. Falls back to
// the universally-rendered Arial stack if an id is ever mistyped, so a preset
// never emits a broken font-family.
function font(id: string): string {
  return FONT_STACKS.find((f) => f.id === id)?.stack ?? DEFAULT_FONT_STACK;
}

// The 20 presets, keyed by the template's stable id. Muted colours stay in the
// readable grey band on white; accents are chosen to be distinct from each
// other and to fit the template's personality.
export const TEMPLATE_PRESETS: Readonly<Record<string, SignatureStyle>> = {
  // ---- Classic -------------------------------------------------------------
  "classic-stacked": {
    accentColor: "#ff6b00",
    textColor: "#1a1a1a",
    mutedColor: "#666666",
    linkColor: "#ff6b00",
    fontFamily: font("arial"),
    fontSize: 14,
  },
  "classic-bordered": {
    accentColor: "#1e40af",
    textColor: "#1e293b",
    mutedColor: "#64748b",
    linkColor: "#1e40af",
    fontFamily: font("trebuchet"),
    fontSize: 14,
  },
  "classic-serif": {
    accentColor: "#7c2d12",
    textColor: "#292524",
    mutedColor: "#78716c",
    linkColor: "#7c2d12",
    fontFamily: font("georgia"),
    fontSize: 14,
  },
  // ---- Modern --------------------------------------------------------------
  "modern-photo-left": {
    accentColor: "#db2777",
    textColor: "#18181b",
    mutedColor: "#71717a",
    linkColor: "#db2777",
    fontFamily: font("helvetica"),
    fontSize: 14,
  },
  "modern-logo-right": {
    accentColor: "#0891b2",
    textColor: "#0f172a",
    mutedColor: "#64748b",
    linkColor: "#0891b2",
    fontFamily: font("verdana"),
    fontSize: 14,
  },
  "modern-social-below": {
    accentColor: "#7c3aed",
    textColor: "#1e1b4b",
    mutedColor: "#6b7280",
    linkColor: "#7c3aed",
    fontFamily: font("tahoma"),
    fontSize: 14,
  },
  "modern-cta-button": {
    accentColor: "#059669",
    textColor: "#064e3b",
    mutedColor: "#6b7280",
    linkColor: "#059669",
    fontFamily: font("helvetica"),
    fontSize: 14,
  },
  "modern-tech-dev": {
    accentColor: "#16a34a",
    textColor: "#0a0a0a",
    mutedColor: "#525252",
    linkColor: "#16a34a",
    fontFamily: font("courier"),
    fontSize: 13,
  },
  // ---- Minimal -------------------------------------------------------------
  "minimal-oneline": {
    accentColor: "#111827",
    textColor: "#111827",
    mutedColor: "#6b7280",
    linkColor: "#2563eb",
    fontFamily: font("system"),
    fontSize: 13,
  },
  "minimal-name-accent": {
    accentColor: "#2563eb",
    textColor: "#111827",
    mutedColor: "#9ca3af",
    linkColor: "#2563eb",
    fontFamily: font("system"),
    fontSize: 14,
  },
  "minimal-vcard": {
    accentColor: "#0d9488",
    textColor: "#134e4a",
    mutedColor: "#6b7280",
    linkColor: "#0d9488",
    fontFamily: font("helvetica"),
    fontSize: 13,
  },
  // ---- Corporate -----------------------------------------------------------
  "corporate-two-column": {
    accentColor: "#1e3a8a",
    textColor: "#1f2937",
    mutedColor: "#6b7280",
    linkColor: "#1e3a8a",
    fontFamily: font("arial"),
    fontSize: 14,
  },
  "corporate-banner": {
    accentColor: "#b91c1c",
    textColor: "#1f2937",
    mutedColor: "#6b7280",
    linkColor: "#b91c1c",
    fontFamily: font("arial"),
    fontSize: 14,
  },
  "corporate-logo-top": {
    accentColor: "#334155",
    textColor: "#0f172a",
    mutedColor: "#64748b",
    linkColor: "#334155",
    fontFamily: font("verdana"),
    fontSize: 14,
  },
  "corporate-legal": {
    accentColor: "#475569",
    textColor: "#1e293b",
    mutedColor: "#64748b",
    linkColor: "#1d4ed8",
    fontFamily: font("georgia"),
    fontSize: 13,
  },
  // ---- Creative ------------------------------------------------------------
  "creative-gradient-bar": {
    accentColor: "#9333ea",
    textColor: "#2e1065",
    mutedColor: "#6b7280",
    linkColor: "#9333ea",
    fontFamily: font("trebuchet"),
    fontSize: 14,
  },
  "creative-social-row": {
    accentColor: "#f59e0b",
    textColor: "#78350f",
    mutedColor: "#6b7280",
    linkColor: "#b45309",
    fontFamily: font("tahoma"),
    fontSize: 14,
  },
  "creative-photo-card": {
    accentColor: "#0ea5e9",
    textColor: "#0c4a6e",
    mutedColor: "#6b7280",
    linkColor: "#0ea5e9",
    fontFamily: font("helvetica"),
    fontSize: 14,
  },
  "creative-freelance": {
    accentColor: "#ec4899",
    textColor: "#831843",
    mutedColor: "#6b7280",
    linkColor: "#ec4899",
    fontFamily: font("trebuchet"),
    fontSize: 14,
  },
  // ---- Compact -------------------------------------------------------------
  "compact-mobile": {
    accentColor: "#6366f1",
    textColor: "#1e1b4b",
    mutedColor: "#6b7280",
    linkColor: "#6366f1",
    fontFamily: font("system"),
    fontSize: 13,
  },
};

// The preset applied when a template id is unknown: the default template's.
const FALLBACK_PRESET_ID = "classic-stacked";

/**
 * Return a fresh copy of the preset for a template id. Unknown ids fall back to
 * the default template's preset. A copy is returned so callers can spread it
 * into SignatureData.style without aliasing the shared constant.
 */
export function getPreset(id: string): SignatureStyle {
  const preset = TEMPLATE_PRESETS[id] ?? TEMPLATE_PRESETS[FALLBACK_PRESET_ID];
  // FALLBACK_PRESET_ID is a literal key of the object above, so this is defined;
  // the ?? on DEFAULT keeps the type non-optional under noUncheckedIndexedAccess.
  return { ...(preset ?? DEFAULT_PRESET) };
}

// Static safety net for the type-checker (noUncheckedIndexedAccess makes the
// map lookup possibly-undefined); never actually reached at runtime.
const DEFAULT_PRESET: SignatureStyle = {
  accentColor: "#ff6b00",
  textColor: "#1a1a1a",
  mutedColor: "#666666",
  linkColor: "#ff6b00",
  fontFamily: DEFAULT_FONT_STACK,
  fontSize: 14,
};
