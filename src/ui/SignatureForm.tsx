// The full editing form: identity, contact, social links and extras. Sections
// are collapsible. The extras section reacts to the active template's
// capabilities, hinting (and disabling) fields a template will not render.

import type { SignatureData, SocialNetwork, TemplateCapabilities } from "../core/types";
import { SOCIAL_NETWORKS } from "../core/types";
import { useLocale } from "../i18n/LocaleProvider";
import type { MessageKey } from "../i18n/messages";
import { updateField, updateSocial } from "../state/signatureReducer";
import { Collapsible, TextAreaField, TextField } from "./Field";

const SOCIAL_LABEL: Record<SocialNetwork, MessageKey> = {
  linkedin: "social_linkedin",
  twitter: "social_twitter",
  instagram: "social_instagram",
  github: "social_github",
  facebook: "social_facebook",
  youtube: "social_youtube",
};

interface SignatureFormProps {
  data: SignatureData;
  capabilities: TemplateCapabilities;
  onChange: (next: SignatureData) => void;
}

export function SignatureForm({ data, capabilities, onChange }: SignatureFormProps) {
  const { t } = useLocale();

  return (
    <div className="form-stack">
      <Collapsible title={t("sectionIdentity")}>
        <TextField
          id="f-fullName"
          label={t("fieldFullName")}
          value={data.fullName}
          onChange={(v) => {
            onChange(updateField(data, "fullName", v));
          }}
        />
        <TextField
          id="f-jobTitle"
          label={t("fieldJobTitle")}
          value={data.jobTitle}
          onChange={(v) => {
            onChange(updateField(data, "jobTitle", v));
          }}
        />
        <TextField
          id="f-company"
          label={t("fieldCompany")}
          value={data.company}
          onChange={(v) => {
            onChange(updateField(data, "company", v));
          }}
        />
        <TextField
          id="f-department"
          label={t("fieldDepartment")}
          value={data.department}
          onChange={(v) => {
            onChange(updateField(data, "department", v));
          }}
        />
      </Collapsible>

      <Collapsible title={t("sectionContact")}>
        <TextField
          id="f-phone"
          label={t("fieldPhone")}
          type="tel"
          value={data.phone}
          onChange={(v) => {
            onChange(updateField(data, "phone", v));
          }}
        />
        <TextField
          id="f-mobile"
          label={t("fieldMobile")}
          type="tel"
          value={data.mobile}
          onChange={(v) => {
            onChange(updateField(data, "mobile", v));
          }}
        />
        <TextField
          id="f-email"
          label={t("fieldEmail")}
          type="email"
          value={data.email}
          onChange={(v) => {
            onChange(updateField(data, "email", v));
          }}
        />
        <TextField
          id="f-website"
          label={t("fieldWebsite")}
          type="url"
          value={data.website}
          onChange={(v) => {
            onChange(updateField(data, "website", v));
          }}
        />
        <TextField
          id="f-address"
          label={t("fieldAddress")}
          value={data.address}
          onChange={(v) => {
            onChange(updateField(data, "address", v));
          }}
        />
      </Collapsible>

      <Collapsible title={t("sectionSocial")}>
        {!capabilities.social ? <p className="note">{t("capNoSocial")}</p> : null}
        {SOCIAL_NETWORKS.map((network) => (
          <TextField
            key={network}
            id={`f-social-${network}`}
            type="url"
            label={t(SOCIAL_LABEL[network])}
            value={data.social[network]}
            onChange={(v) => {
              onChange(updateSocial(data, network, v));
            }}
          />
        ))}
      </Collapsible>

      <Collapsible title={t("sectionExtras")}>
        {!capabilities.tagline ? <p className="note">{t("capNoTagline")}</p> : null}
        <TextField
          id="f-tagline"
          label={t("fieldTagline")}
          value={data.tagline}
          onChange={(v) => {
            onChange(updateField(data, "tagline", v));
          }}
        />
        {!capabilities.disclaimer ? <p className="note">{t("capNoDisclaimer")}</p> : null}
        <TextAreaField
          id="f-disclaimer"
          label={t("fieldDisclaimer")}
          value={data.disclaimer}
          onChange={(v) => {
            onChange(updateField(data, "disclaimer", v));
          }}
        />
        {!capabilities.cta ? <p className="note">{t("capNoCta")}</p> : null}
        <TextField
          id="f-ctaLabel"
          label={t("fieldCtaLabel")}
          value={data.ctaLabel}
          onChange={(v) => {
            onChange(updateField(data, "ctaLabel", v));
          }}
        />
        <TextField
          id="f-ctaUrl"
          label={t("fieldCtaUrl")}
          type="url"
          value={data.ctaUrl}
          onChange={(v) => {
            onChange(updateField(data, "ctaUrl", v));
          }}
        />
      </Collapsible>
    </div>
  );
}
