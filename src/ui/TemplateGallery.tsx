// Clickable grid of every template. Each card shows a live, scaled-down preview
// of the template rendered with its own preset (so the palettes read as
// genuinely different), plus the localized name and a category chip. The
// detailed, editable rendering still lives in PreviewPane.

import type { EmailSignatureTemplate, Locale, TemplateCategory } from "../core/types";
import { getPreset } from "../templates/presets";
import { useLocale } from "../i18n/LocaleProvider";
import type { MessageKey } from "../i18n/messages";
import { TemplateThumbnail } from "./TemplateThumbnail";

const CATEGORY_KEY: Record<TemplateCategory, MessageKey> = {
  classic: "cat_classic",
  modern: "cat_modern",
  minimal: "cat_minimal",
  creative: "cat_creative",
  corporate: "cat_corporate",
  compact: "cat_compact",
};

interface TemplateGalleryProps {
  templates: readonly EmailSignatureTemplate[];
  activeId: string;
  locale: Locale;
  onSelect: (id: string) => void;
}

export function TemplateGallery({ templates, activeId, locale, onSelect }: TemplateGalleryProps) {
  const { t } = useLocale();
  return (
    <div className="template-grid" role="listbox" aria-label={t("templatesTitle")}>
      {templates.map((tpl) => {
        const active = tpl.id === activeId;
        return (
          <button
            key={tpl.id}
            type="button"
            role="option"
            data-testid="template-card"
            aria-selected={active}
            className={active ? "template-card is-active" : "template-card"}
            onClick={() => {
              onSelect(tpl.id);
            }}
          >
            <TemplateThumbnail template={tpl} style={getPreset(tpl.id)} />
            <span className="template-card-body">
              <span className="template-name">{tpl.name[locale]}</span>
              <span className="template-cat">{t(CATEGORY_KEY[tpl.category])}</span>
            </span>
            {active ? <span className="template-active">{t("templateActive")}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
