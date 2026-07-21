// Per-client install instructions as tabs. Bodies are stored as newline-joined
// step strings in the dictionary and split into an ordered list here. Apple Mail
// carries its two-method special case (no direct paste in Settings).

import { useState } from "react";
import { useLocale } from "../i18n/LocaleProvider";
import type { MessageKey } from "../i18n/messages";

interface Guide {
  id: string;
  labelKey: MessageKey;
  bodyKey: MessageKey;
}

const GUIDES: readonly Guide[] = [
  { id: "gmail", labelKey: "guideGmail", bodyKey: "guideGmailBody" },
  { id: "outlook-classic", labelKey: "guideOutlookClassic", bodyKey: "guideOutlookClassicBody" },
  { id: "outlook-new", labelKey: "guideOutlookNew", bodyKey: "guideOutlookNewBody" },
  { id: "apple-mail", labelKey: "guideAppleMail", bodyKey: "guideAppleMailBody" },
  { id: "thunderbird", labelKey: "guideThunderbird", bodyKey: "guideThunderbirdBody" },
];

export function InstallGuides() {
  const { t } = useLocale();
  const [activeId, setActiveId] = useState<string>(GUIDES[0]?.id ?? "gmail");
  const active = GUIDES.find((g) => g.id === activeId) ?? GUIDES[0];

  if (!active) return null;
  const steps = t(active.bodyKey)
    .split("\n")
    .filter((line) => line.trim().length > 0);

  return (
    <section className="guides" aria-label={t("guidesTitle")}>
      <h2 className="panel-title">{t("guidesTitle")}</h2>
      <div className="guide-tabs" role="tablist" aria-label={t("guidesTitle")}>
        {GUIDES.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={g.id === activeId}
            aria-controls={`panel-${g.id}`}
            className={g.id === activeId ? "guide-tab is-on" : "guide-tab"}
            onClick={() => {
              setActiveId(g.id);
            }}
          >
            {t(g.labelKey)}
          </button>
        ))}
      </div>
      <div
        className="guide-panel"
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
      >
        <ol className="guide-steps">
          {steps.map((step, i) => (
            <li key={`${active.id}-${i}`}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
