import { describe, expect, it } from "vitest";
import type { SignatureData } from "../core/types";
import {
  charCountSeverity,
  updateField,
  updateImage,
  updateSocial,
  updateStyle,
} from "./signatureReducer";

// Local fixture built straight from the SignatureData type (no core/storage
// dependency, which is written by another agent). Kept minimal but complete.
function makeData(): SignatureData {
  return {
    fullName: "Ada Lovelace",
    jobTitle: "Engineer",
    company: "Analytical",
    department: "R&D",
    phone: "",
    mobile: "",
    email: "ada@example.com",
    website: "",
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
    templateId: "classic-left",
    style: {
      accentColor: "#ff6b00",
      textColor: "#1a1a1a",
      mutedColor: "#666666",
      linkColor: "#0a66c2",
      fontFamily: "Arial, sans-serif",
      fontSize: 13,
    },
  };
}

describe("updateField", () => {
  it("returns a new object with the field changed, without mutating the original", () => {
    const data = makeData();
    const next = updateField(data, "fullName", "Grace Hopper");

    expect(next).not.toBe(data);
    expect(next.fullName).toBe("Grace Hopper");
    expect(data.fullName).toBe("Ada Lovelace"); // original untouched
    // untouched fields are carried over
    expect(next.email).toBe("ada@example.com");
  });
});

describe("updateStyle", () => {
  it("merges the patch into style immutably", () => {
    const data = makeData();
    const next = updateStyle(data, { accentColor: "#000000", fontSize: 16 });

    expect(next).not.toBe(data);
    expect(next.style).not.toBe(data.style);
    expect(next.style.accentColor).toBe("#000000");
    expect(next.style.fontSize).toBe(16);
    expect(next.style.textColor).toBe("#1a1a1a"); // other style keys preserved
    expect(data.style.accentColor).toBe("#ff6b00"); // original untouched
  });
});

describe("updateSocial", () => {
  it("sets one network URL without touching the others or the original", () => {
    const data = makeData();
    const next = updateSocial(data, "github", "https://github.com/ada");

    expect(next).not.toBe(data);
    expect(next.social).not.toBe(data.social);
    expect(next.social.github).toBe("https://github.com/ada");
    expect(next.social.linkedin).toBe("");
    expect(data.social.github).toBe(""); // original untouched
  });
});

describe("updateImage", () => {
  it("patches the given slot (kind/value/width) immutably", () => {
    const data = makeData();
    const next = updateImage(data, "logo", { kind: "data", value: "data:image/png;base64,AAA" });

    expect(next).not.toBe(data);
    expect(next.logo).not.toBe(data.logo);
    expect(next.logo.kind).toBe("data");
    expect(next.logo.value).toBe("data:image/png;base64,AAA");
    expect(next.logo.width).toBe(140); // unspecified key preserved
    expect(next.photo).toBe(data.photo); // untouched slot keeps identity
    expect(data.logo.kind).toBe("none"); // original untouched
  });

  it("updates only width when that is the patch", () => {
    const data = makeData();
    const next = updateImage(data, "photo", { width: 200 });

    expect(next.photo.width).toBe(200);
    expect(next.photo.kind).toBe("none");
    expect(data.photo.width).toBe(96);
  });
});

describe("charCountSeverity", () => {
  const warn = 8000;
  const limit = 10000;

  it("is ok below the warn threshold", () => {
    expect(charCountSeverity(0, warn, limit)).toBe("ok");
    expect(charCountSeverity(7999, warn, limit)).toBe("ok");
  });

  it("is warn at or above warn but below limit", () => {
    expect(charCountSeverity(8000, warn, limit)).toBe("warn");
    expect(charCountSeverity(9999, warn, limit)).toBe("warn");
  });

  it("is over at or above the limit", () => {
    expect(charCountSeverity(10000, warn, limit)).toBe("over");
    expect(charCountSeverity(12345, warn, limit)).toBe("over");
  });
});
