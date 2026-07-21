// Logo and photo slots. Each slot offers three sources — hosted URL, local file
// (read to a base64 data URI, entirely client-side) or none — plus a width
// slider. File mode surfaces the Gmail-strips-embedded-images warning.

import { useState } from "react";
import type { ChangeEvent } from "react";
import type { ImageKind, ImageSource, SignatureData, TemplateCapabilities } from "../core/types";
import { useLocale } from "../i18n/LocaleProvider";
import { updateImage } from "../state/signatureReducer";
import { Collapsible, RangeField, TextField } from "./Field";

const ONE_MB = 1_000_000;

interface ImageSlotProps {
  idPrefix: string;
  label: string;
  source: ImageSource;
  supported: boolean;
  unsupportedNote: string;
  onChange: (patch: Partial<ImageSource>) => void;
}

function ImageSlot({
  idPrefix,
  label,
  source,
  supported,
  unsupportedNote,
  onChange,
}: ImageSlotProps) {
  const { t } = useLocale();
  const [sizeWarning, setSizeWarning] = useState(false);
  const [readError, setReadError] = useState(false);

  function setMode(kind: ImageKind): void {
    if (kind === source.kind) return;
    setSizeWarning(false);
    setReadError(false);
    if (kind === "url") {
      onChange({ kind, value: source.value.startsWith("data:") ? "" : source.value });
    } else if (kind === "data") {
      onChange({ kind, value: "" });
    } else {
      onChange({ kind, value: "" });
    }
  }

  function onFile(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    setReadError(false);
    setSizeWarning(file.size > ONE_MB);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onChange({ kind: "data", value: result });
      } else {
        setReadError(true);
      }
    };
    reader.onerror = () => {
      setReadError(true);
    };
    reader.readAsDataURL(file);
  }

  const modes: readonly { kind: ImageKind; label: string }[] = [
    { kind: "url", label: t("imgModeUrl") },
    { kind: "data", label: t("imgModeFile") },
    { kind: "none", label: t("imgModeNone") },
  ];

  return (
    <fieldset className="media-slot">
      <legend>{label}</legend>
      {!supported ? <p className="note">{unsupportedNote}</p> : null}

      <div className="segment" role="group" aria-label={label}>
        {modes.map((m) => (
          <button
            key={m.kind}
            type="button"
            className={source.kind === m.kind ? "segment-btn is-on" : "segment-btn"}
            aria-pressed={source.kind === m.kind}
            onClick={() => {
              setMode(m.kind);
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {source.kind === "url" ? (
        <TextField
          id={`${idPrefix}-url`}
          label={t("imgUrlLabel")}
          type="url"
          value={source.value}
          onChange={(v) => {
            onChange({ value: v });
          }}
        />
      ) : null}

      {source.kind === "data" ? (
        <div className="field">
          <label htmlFor={`${idPrefix}-file`}>{t("imgFileLabel")}</label>
          <input id={`${idPrefix}-file`} type="file" accept="image/*" onChange={onFile} />
          <p className="note">{t("imgGmailWarning")}</p>
          {sizeWarning ? <p className="note note-danger">{t("imgSizeWarning")}</p> : null}
          {readError ? <p className="note note-danger">{t("imgReadError")}</p> : null}
        </div>
      ) : null}

      {source.kind !== "none" ? (
        <RangeField
          id={`${idPrefix}-width`}
          label={t("imgWidthLabel")}
          min={40}
          max={360}
          value={source.width}
          onChange={(v) => {
            onChange({ width: v });
          }}
        />
      ) : null}
    </fieldset>
  );
}

interface MediaPanelProps {
  data: SignatureData;
  capabilities: TemplateCapabilities;
  onChange: (next: SignatureData) => void;
}

export function MediaPanel({ data, capabilities, onChange }: MediaPanelProps) {
  const { t } = useLocale();
  return (
    <Collapsible title={t("sectionMedia")}>
      <ImageSlot
        idPrefix="logo"
        label={t("mediaLogo")}
        source={data.logo}
        supported={capabilities.logo}
        unsupportedNote={t("capNoLogo")}
        onChange={(patch) => {
          onChange(updateImage(data, "logo", patch));
        }}
      />
      <ImageSlot
        idPrefix="photo"
        label={t("mediaPhoto")}
        source={data.photo}
        supported={capabilities.photo}
        unsupportedNote={t("capNoPhoto")}
        onChange={(patch) => {
          onChange(updateImage(data, "photo", patch));
        }}
      />
    </Collapsible>
  );
}
