// Live preview. The signature is rendered inside a sandboxed iframe so its
// inline table/CSS cannot touch the app. sandbox="allow-same-origin" WITHOUT
// allow-scripts: the signature never runs code. App pre-builds the light and
// dark documents (via core/export.buildSignatureDocument); this pane only picks
// which one to show so it stays free of any core dependency.

import { useState } from "react";
import { useLocale } from "../i18n/LocaleProvider";

type PreviewBg = "light" | "dark";

interface PreviewPaneProps {
  docLight: string;
  docDark: string;
}

export function PreviewPane({ docLight, docDark }: PreviewPaneProps) {
  const { t } = useLocale();
  const [bg, setBg] = useState<PreviewBg>("light");

  return (
    <div className="preview-pane">
      <div className="preview-toolbar">
        <span className="preview-bg-label">{t("previewBgLabel")}</span>
        <div className="segment" role="group" aria-label={t("previewBgLabel")}>
          <button
            type="button"
            className={bg === "light" ? "segment-btn is-on" : "segment-btn"}
            aria-pressed={bg === "light"}
            onClick={() => {
              setBg("light");
            }}
          >
            {t("previewBgLight")}
          </button>
          <button
            type="button"
            className={bg === "dark" ? "segment-btn is-on" : "segment-btn"}
            aria-pressed={bg === "dark"}
            onClick={() => {
              setBg("dark");
            }}
          >
            {t("previewBgDark")}
          </button>
        </div>
      </div>
      <iframe
        className="preview-frame"
        data-testid="preview-frame"
        title={t("previewFrameTitle")}
        sandbox="allow-same-origin"
        srcDoc={bg === "light" ? docLight : docDark}
      />
    </div>
  );
}
