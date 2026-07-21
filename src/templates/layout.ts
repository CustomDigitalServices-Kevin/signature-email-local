// ============================================================================
// Table layout primitives. Every structural table MUST be opened here so it
// always carries the Outlook (Word engine) hacks. No flexbox/grid/div layout.
// ============================================================================

import type { SignatureStyle } from "../core/types";

const MSO_TABLE_HACKS = "border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;";

/** Opening tag of a presentation table carrying the mandatory Outlook hacks. */
export function openTable(extraStyle = ""): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${MSO_TABLE_HACKS}${extraStyle}">`;
}

/** Wrap already-built `<tr>` rows in a presentation table. */
export function table(rows: string, extraStyle = ""): string {
  return `${openTable(extraStyle)}${rows}</table>`;
}

/** A short coloured rule (accent line), rendered as a single table cell. */
export function accentRule(style: SignatureStyle, width = 48, height = 2, extra = ""): string {
  return table(
    `<tr><td width="${width}" height="${height}" bgcolor="${style.accentColor}" ` +
      `style="width:${width}px;height:${height}px;font-size:0;line-height:0;${extra}">&nbsp;</td></tr>`,
  );
}
