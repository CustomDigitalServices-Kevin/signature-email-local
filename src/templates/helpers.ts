// ============================================================================
// Shared, pure helpers for every email-signature template — barrel module.
//
// Design decisions baked into the sub-modules (all sourced from email-HTML
// compatibility practice — Outlook desktop uses the Word rendering engine,
// Gmail strips most of what it does not understand):
//
//   * LAYOUT IS TABLE-ONLY (see `layout.ts`). No flexbox/grid/div-based layout.
//     Every structural table carries the Outlook hacks `border-collapse`,
//     `mso-table-lspace` and `mso-table-rspace`.
//   * CSS IS 100% INLINE. No <style>, no class, no id.
//   * SOCIAL ICONS ARE TEXT BADGES, NOT IMAGES (see `media.ts`): a coloured
//     <td> with a short white glyph renders identically everywhere, whereas SVG
//     data URIs do not render in Outlook desktop and remote PNGs get blocked.
//   * Every user-supplied value is HTML-escaped here (see `text.ts`) as defence
//     in depth; the core additionally sanitizes the final output with DOMPurify,
//     but a template must never emit structurally-broken HTML.
// ============================================================================

export * from "./text";
export * from "./layout";
export * from "./url";
export * from "./media";
export * from "./blocks";
