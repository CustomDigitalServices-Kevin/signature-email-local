// Export actions + Gmail character budget. Presentational only: App owns the
// core calls (renderSignature / copyRichHtml / downloadHtmlFile) and passes the
// precomputed count, thresholds and click handlers, so this stays testable with
// no core import.

import { useLocale } from "../i18n/LocaleProvider";
import { charCountSeverity } from "../state/signatureReducer";

interface ExportBarProps {
  charCount: number;
  warnThreshold: number;
  limitThreshold: number;
  clipboardRichSupported: boolean;
  onCopyRich: () => void;
  onCopyHtml: () => void;
  onDownload: () => void;
}

export function ExportBar({
  charCount,
  warnThreshold,
  limitThreshold,
  clipboardRichSupported,
  onCopyRich,
  onCopyHtml,
  onDownload,
}: ExportBarProps) {
  const { t } = useLocale();
  const severity = charCountSeverity(charCount, warnThreshold, limitThreshold);

  return (
    <div className="export-bar">
      <div className="export-actions">
        <button type="button" className="btn btn-primary" onClick={onCopyRich}>
          {clipboardRichSupported ? t("exportCopy") : t("exportCopyPlain")}
        </button>
        <button type="button" className="btn" onClick={onCopyHtml}>
          {t("exportCopyHtml")}
        </button>
        <button type="button" className="btn" onClick={onDownload}>
          {t("exportDownload")}
        </button>
      </div>

      <div className={`char-meter char-${severity}`} role="status" aria-live="polite">
        <span className="char-count">
          {charCount} {t("charsUnit")}
        </span>
        {severity === "warn" ? <span className="char-msg">{t("charWarn")}</span> : null}
        {severity === "over" ? <span className="char-msg">{t("charOver")}</span> : null}
      </div>
    </div>
  );
}
