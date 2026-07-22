// Color, font and size controls. Font choices come from the web-safe FONT_STACKS
// list (email clients block web fonts). All edits flow through updateStyle.

import type { FontStack, SignatureData } from "../core/types";
import { useLocale } from "../i18n/LocaleProvider";
import { updateStyle } from "../state/signatureReducer";
import { Collapsible, ColorField, RangeField, SelectField } from "./Field";
import { StyleIcon } from "./icons";

interface StylePanelProps {
  data: SignatureData;
  fontStacks: readonly FontStack[];
  onChange: (next: SignatureData) => void;
}

export function StylePanel({ data, fontStacks, onChange }: StylePanelProps) {
  const { t } = useLocale();
  const fontOptions = fontStacks.map((f) => ({ value: f.stack, label: f.label }));

  return (
    <Collapsible title={t("sectionStyle")} icon={<StyleIcon />} defaultOpen={false}>
      <div className="color-grid">
        <ColorField
          id="s-accent"
          label={t("styleAccent")}
          value={data.style.accentColor}
          onChange={(v) => {
            onChange(updateStyle(data, { accentColor: v }));
          }}
        />
        <ColorField
          id="s-text"
          label={t("styleText")}
          value={data.style.textColor}
          onChange={(v) => {
            onChange(updateStyle(data, { textColor: v }));
          }}
        />
        <ColorField
          id="s-muted"
          label={t("styleMuted")}
          value={data.style.mutedColor}
          onChange={(v) => {
            onChange(updateStyle(data, { mutedColor: v }));
          }}
        />
        <ColorField
          id="s-link"
          label={t("styleLink")}
          value={data.style.linkColor}
          onChange={(v) => {
            onChange(updateStyle(data, { linkColor: v }));
          }}
        />
      </div>
      <SelectField
        id="s-font"
        label={t("styleFont")}
        value={data.style.fontFamily}
        options={fontOptions}
        onChange={(v) => {
          onChange(updateStyle(data, { fontFamily: v }));
        }}
      />
      <RangeField
        id="s-fontSize"
        label={t("styleFontSize")}
        min={11}
        max={18}
        value={data.style.fontSize}
        onChange={(v) => {
          onChange(updateStyle(data, { fontSize: v }));
        }}
      />
    </Collapsible>
  );
}
