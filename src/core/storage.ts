// localStorage persistence for the signature payload. Loading is fully
// defensive: any missing, corrupt or malformed field falls back to the default,
// and any failure (invalid JSON, storage unavailable/quota) resolves to the
// complete default set instead of throwing. Saving is best-effort and silent.
import {
  SOCIAL_NETWORKS,
  type ImageKind,
  type ImageSource,
  type SignatureData,
  type SignatureStyle,
  type SocialLinks,
} from "./types";
import { DEFAULT_FONT_STACK } from "./fonts";

export const STORAGE_KEY = "signature-email-local:data:v1";

export const DEFAULT_SIGNATURE_DATA: SignatureData = {
  fullName: "Marie Dupont",
  jobTitle: "Responsable Marketing",
  company: "Ma Société",
  department: "",
  phone: "+33 1 23 45 67 89",
  mobile: "",
  email: "marie.dupont@exemple.com",
  website: "https://exemple.com",
  address: "",
  social: {
    linkedin: "",
    twitter: "",
    instagram: "",
    github: "",
    facebook: "",
    youtube: "",
  },
  logo: { kind: "none", value: "", width: 140 },
  photo: { kind: "none", value: "", width: 96 },
  tagline: "",
  disclaimer: "",
  ctaLabel: "",
  ctaUrl: "",
  // Id of the default template (classic-stacked). Kept as a string literal to
  // avoid coupling storage to the template registry.
  templateId: "classic-stacked",
  style: {
    accentColor: "#ff6b00",
    textColor: "#1a1a1a",
    mutedColor: "#666666",
    linkColor: "#ff6b00",
    fontFamily: DEFAULT_FONT_STACK,
    fontSize: 14,
  },
};

const IMAGE_KINDS: readonly ImageKind[] = ["url", "data", "none"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickString(source: Record<string, unknown>, key: string, fallback: string): string {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function pickNumber(source: Record<string, unknown>, key: string, fallback: number): number {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isImageKind(value: unknown): value is ImageKind {
  return typeof value === "string" && (IMAGE_KINDS as readonly string[]).includes(value);
}

function mergeSocial(value: unknown, fallback: SocialLinks): SocialLinks {
  const source = isRecord(value) ? value : {};
  // Start from a full copy so every network key is guaranteed present, then
  // override with any valid persisted value.
  return SOCIAL_NETWORKS.reduce<SocialLinks>(
    (acc, network) => {
      acc[network] = pickString(source, network, fallback[network]);
      return acc;
    },
    { ...fallback },
  );
}

function mergeImage(value: unknown, fallback: ImageSource): ImageSource {
  if (!isRecord(value)) {
    return { ...fallback };
  }
  return {
    kind: isImageKind(value.kind) ? value.kind : fallback.kind,
    value: pickString(value, "value", fallback.value),
    width: pickNumber(value, "width", fallback.width),
  };
}

function mergeStyle(value: unknown, fallback: SignatureStyle): SignatureStyle {
  if (!isRecord(value)) {
    return { ...fallback };
  }
  return {
    accentColor: pickString(value, "accentColor", fallback.accentColor),
    textColor: pickString(value, "textColor", fallback.textColor),
    mutedColor: pickString(value, "mutedColor", fallback.mutedColor),
    linkColor: pickString(value, "linkColor", fallback.linkColor),
    fontFamily: pickString(value, "fontFamily", fallback.fontFamily),
    fontSize: pickNumber(value, "fontSize", fallback.fontSize),
  };
}

// A fresh deep copy of the defaults so callers can mutate the result freely
// without corrupting the shared DEFAULT_SIGNATURE_DATA object.
function cloneDefault(): SignatureData {
  const d = DEFAULT_SIGNATURE_DATA;
  return {
    ...d,
    social: { ...d.social },
    logo: { ...d.logo },
    photo: { ...d.photo },
    style: { ...d.style },
  };
}

function getStorage(): Storage | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    // Accessing localStorage can throw in privacy modes / sandboxed frames.
    return null;
  }
}

export function loadSignatureData(): SignatureData {
  try {
    const storage = getStorage();
    if (storage === null) {
      return cloneDefault();
    }
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      return cloneDefault();
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return cloneDefault();
    }
    const d = DEFAULT_SIGNATURE_DATA;
    return {
      fullName: pickString(parsed, "fullName", d.fullName),
      jobTitle: pickString(parsed, "jobTitle", d.jobTitle),
      company: pickString(parsed, "company", d.company),
      department: pickString(parsed, "department", d.department),
      phone: pickString(parsed, "phone", d.phone),
      mobile: pickString(parsed, "mobile", d.mobile),
      email: pickString(parsed, "email", d.email),
      website: pickString(parsed, "website", d.website),
      address: pickString(parsed, "address", d.address),
      social: mergeSocial(parsed.social, d.social),
      logo: mergeImage(parsed.logo, d.logo),
      photo: mergeImage(parsed.photo, d.photo),
      tagline: pickString(parsed, "tagline", d.tagline),
      disclaimer: pickString(parsed, "disclaimer", d.disclaimer),
      ctaLabel: pickString(parsed, "ctaLabel", d.ctaLabel),
      ctaUrl: pickString(parsed, "ctaUrl", d.ctaUrl),
      templateId: pickString(parsed, "templateId", d.templateId),
      style: mergeStyle(parsed.style, d.style),
    };
  } catch {
    // Corrupt JSON or storage failure: never throw, always yield a usable set.
    return cloneDefault();
  }
}

export function saveSignatureData(data: SignatureData): void {
  try {
    const storage = getStorage();
    if (storage === null) {
      return;
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Quota exceeded or storage unavailable: persistence is best-effort, the
    // app keeps working with in-memory state.
  }
}

export function resetSignatureData(): void {
  try {
    const storage = getStorage();
    if (storage === null) {
      return;
    }
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to reset if storage is unavailable.
  }
}
