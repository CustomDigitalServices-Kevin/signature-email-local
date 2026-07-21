import { useLocale } from "../i18n/LocaleProvider";

// Scaffold shell. The UI layer replaces this with the full generator (form,
// template gallery, style panel, live preview, export/copy, install guides).
export function App() {
  const { t } = useLocale();
  return (
    <div className="app">
      <h1>{t("appTitle")}</h1>
      <p>{t("tagline")}</p>
    </div>
  );
}
