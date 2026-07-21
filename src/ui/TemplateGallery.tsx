// Clickable grid of every template. Each card shows the localized name, a
// category chip and an accent-colored dot; the detailed live rendering lives in
// PreviewPane, so cards stay cheap (no per-card iframe).

import type { EmailSignatureTemplate, Locale, TemplateCategory } from "../core/types";
import { useLocale } from "../i18n/LocaleProvider";
import type { MessageKey } from "../i18n/messages";

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
  accentColor: string;
  locale: Locale;
  onSelect: (id: string) => void;
}

export function TemplateGallery({
  templates,
  activeId,
  accentColor,
  locale,
  onSelect,
}: TemplateGalleryProps) {
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
            aria-selected={active}
            className={active ? "template-card is-active" : "template-card"}
            onClick={() => {
              onSelect(tpl.id);
            }}
          >
            <span className="template-dot" style={{ background: accentColor }} aria-hidden="true" />
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
