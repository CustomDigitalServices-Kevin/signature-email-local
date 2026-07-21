// ============================================================================
// Template registry. Import the 20 templates, expose them in a stable order,
// and provide id-based lookup plus the default selection.
// ============================================================================

import type { EmailSignatureTemplate } from "../core/types";
import { classicBordered, classicSerif, classicStacked } from "./classic";
import { compactMobile } from "./compact";
import { corporateBanner, corporateLegal, corporateLogoTop, corporateTwoColumn } from "./corporate";
import {
  creativeFreelance,
  creativeGradientBar,
  creativePhotoCard,
  creativeSocialRow,
} from "./creative";
import { minimalNameAccent, minimalOneline, minimalVcard } from "./minimal";
import {
  modernCtaButton,
  modernLogoRight,
  modernPhotoLeft,
  modernSocialBelow,
  modernTechDev,
} from "./modern";

/** The 20 templates in canonical display order (id 1 -> 20). */
export const TEMPLATES: readonly EmailSignatureTemplate[] = [
  classicStacked,
  classicBordered,
  classicSerif,
  modernPhotoLeft,
  modernLogoRight,
  modernSocialBelow,
  modernCtaButton,
  modernTechDev,
  minimalOneline,
  minimalNameAccent,
  minimalVcard,
  corporateTwoColumn,
  corporateBanner,
  corporateLogoTop,
  corporateLegal,
  creativeGradientBar,
  creativeSocialRow,
  creativePhotoCard,
  creativeFreelance,
  compactMobile,
];

/** The id used when no selection has been persisted yet (the first template). */
export const DEFAULT_TEMPLATE_ID: string = classicStacked.id;

const TEMPLATE_BY_ID: ReadonlyMap<string, EmailSignatureTemplate> = new Map(
  TEMPLATES.map((template) => [template.id, template]),
);

/** Look up a template by its stable id, or `undefined` if unknown. */
export function getTemplate(id: string): EmailSignatureTemplate | undefined {
  return TEMPLATE_BY_ID.get(id);
}
