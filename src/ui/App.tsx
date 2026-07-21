// Top-level orchestrator: owns the SignatureData state, persists it, derives the
// rendered HTML / preview documents / character count, and lays out the three
// zones (top bar, edit column, preview column).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SignatureData, TemplateCapabilities } from "../core/types";
import { isClipboardRichSupported, copyRichHtml } from "../core/clipboard";
import { buildSignatureDocument, downloadHtmlFile } from "../core/export";
import { FONT_STACKS } from "../core/fonts";
import {
  countSignatureChars,
  GMAIL_CHAR_LIMIT,
  GMAIL_CHAR_WARN,
  renderSignature,
} from "../core/render";
import {
  DEFAULT_SIGNATURE_DATA,
  loadSignatureData,
  resetSignatureData,
  saveSignatureData,
} from "../core/storage";
import { DEFAULT_TEMPLATE_ID, getTemplate, TEMPLATES } from "../templates/index";
import { useLocale } from "../i18n/LocaleProvider";
import { updateField } from "../state/signatureReducer";
import { ExportBar } from "./ExportBar";
import { InstallGuides } from "./InstallGuides";
import { MediaPanel } from "./MediaPanel";
import { PreviewPane } from "./PreviewPane";
import { SignatureForm } from "./SignatureForm";
import { StylePanel } from "./StylePanel";
import { TemplateGallery } from "./TemplateGallery";
import { Toast } from "./Toast";
import type { ToastState, ToastTone } from "./Toast";

const FALLBACK_CAPABILITIES: TemplateCapabilities = {
  photo: true,
  logo: true,
  social: true,
  cta: true,
  disclaimer: true,
  tagline: true,
};

const PREVIEW_LIGHT = "#ffffff";
const PREVIEW_DARK = "#1f1f1f";

export function App() {
  const { t, locale, setLocale } = useLocale();
  const [data, setData] = useState<SignatureData>(loadSignatureData);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastId = useRef(0);

  // Persist on change, debounced so keystrokes don't hit localStorage each time.
  useEffect(() => {
    const timer = setTimeout(() => {
      saveSignatureData(data);
    }, 400);
    return () => {
      clearTimeout(timer);
    };
  }, [data]);

  const template = getTemplate(data.templateId) ?? getTemplate(DEFAULT_TEMPLATE_ID);
  const capabilities = template?.capabilities ?? FALLBACK_CAPABILITIES;

  const innerHtml = useMemo(() => renderSignature(data), [data]);
  const charCount = useMemo(() => countSignatureChars(innerHtml), [innerHtml]);
  const docLight = useMemo(
    () => buildSignatureDocument(innerHtml, { background: PREVIEW_LIGHT }),
    [innerHtml],
  );
  const docDark = useMemo(
    () => buildSignatureDocument(innerHtml, { background: PREVIEW_DARK }),
    [innerHtml],
  );
  const downloadDoc = useMemo(() => buildSignatureDocument(innerHtml), [innerHtml]);

  const showToast = useCallback((message: string, tone: ToastTone) => {
    toastId.current += 1;
    setToast({ message, tone, id: toastId.current });
  }, []);
  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const onSelectTemplate = useCallback((id: string) => {
    setData((prev) => updateField(prev, "templateId", id));
  }, []);

  const onReset = useCallback(() => {
    if (typeof window !== "undefined" && !window.confirm(t("resetConfirm"))) return;
    resetSignatureData();
    setData(DEFAULT_SIGNATURE_DATA);
  }, [t]);

  const onCopyRich = useCallback(() => {
    void copyRichHtml(innerHtml)
      .then(() => {
        showToast(t("toastCopied"), "success");
      })
      .catch(() => {
        showToast(t("toastCopyError"), "error");
      });
  }, [innerHtml, showToast, t]);

  const onCopyHtml = useCallback(() => {
    void navigator.clipboard
      .writeText(innerHtml)
      .then(() => {
        showToast(t("toastHtmlCopied"), "success");
      })
      .catch(() => {
        showToast(t("toastCopyError"), "error");
      });
  }, [innerHtml, showToast, t]);

  const onDownload = useCallback(() => {
    downloadHtmlFile(downloadDoc, "signature.html");
  }, [downloadDoc]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-title">{t("appTitle")}</span>
          <span className="brand-sub">{t("privacyNote")}</span>
        </div>
        <div className="topbar-actions">
          <div className="lang-switch" role="group" aria-label={t("langLabel")}>
            <button
              type="button"
              className={locale === "fr" ? "lang-btn is-on" : "lang-btn"}
              data-testid="lang-fr"
              aria-pressed={locale === "fr"}
              onClick={() => {
                setLocale("fr");
              }}
            >
              FR
            </button>
            <button
              type="button"
              className={locale === "en" ? "lang-btn is-on" : "lang-btn"}
              data-testid="lang-en"
              aria-pressed={locale === "en"}
              onClick={() => {
                setLocale("en");
              }}
            >
              EN
            </button>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            {t("reset")}
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="col col-edit" aria-label={t("colEdit")}>
          <div className="panel">
            <h2 className="panel-title">{t("templatesTitle")}</h2>
            <p className="panel-hint">{t("templatesHint")}</p>
            <TemplateGallery
              templates={TEMPLATES}
              activeId={data.templateId}
              accentColor={data.style.accentColor}
              locale={locale}
              onSelect={onSelectTemplate}
            />
          </div>
          <div className="panel">
            <SignatureForm data={data} capabilities={capabilities} onChange={setData} />
            <MediaPanel data={data} capabilities={capabilities} onChange={setData} />
            <StylePanel data={data} fontStacks={FONT_STACKS} onChange={setData} />
          </div>
        </section>

        <section className="col col-preview" aria-label={t("colPreview")}>
          <div className="panel">
            <h2 className="panel-title">{t("colPreview")}</h2>
            <PreviewPane docLight={docLight} docDark={docDark} />
            <ExportBar
              charCount={charCount}
              warnThreshold={GMAIL_CHAR_WARN}
              limitThreshold={GMAIL_CHAR_LIMIT}
              clipboardRichSupported={isClipboardRichSupported()}
              onCopyRich={onCopyRich}
              onCopyHtml={onCopyHtml}
              onDownload={onDownload}
            />
          </div>
          <div className="panel">
            <InstallGuides />
          </div>
        </section>
      </main>

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
