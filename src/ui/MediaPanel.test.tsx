import { useState } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { SignatureData, TemplateCapabilities } from "../core/types";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { MESSAGES } from "../i18n/messages";
import { MediaPanel } from "./MediaPanel";

function makeData(): SignatureData {
  return {
    fullName: "Ada Lovelace",
    jobTitle: "",
    company: "",
    department: "",
    phone: "",
    mobile: "",
    email: "",
    website: "",
    address: "",
    social: { linkedin: "", twitter: "", instagram: "", github: "", facebook: "", youtube: "" },
    // logo starts in URL mode so the file-mode warning is initially absent.
    logo: { kind: "url", value: "", width: 140 },
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

const ALL_CAPS: TemplateCapabilities = {
  photo: true,
  logo: true,
  social: true,
  cta: true,
  disclaimer: true,
  tagline: true,
};

function Harness() {
  const [data, setData] = useState<SignatureData>(makeData);
  return (
    <LocaleProvider>
      <MediaPanel data={data} capabilities={ALL_CAPS} onChange={setData} />
    </LocaleProvider>
  );
}

const GMAIL_WARNINGS = [MESSAGES.fr.imgGmailWarning, MESSAGES.en.imgGmailWarning];

describe("MediaPanel", () => {
  it("reveals the Gmail embedded-image warning after switching the logo to File mode", async () => {
    const { container } = render(<Harness />);

    // No file input and no Gmail warning while in URL mode.
    expect(container.querySelector("#logo-file")).toBeNull();

    // The logo slot is the first fieldset; its segment buttons are url/file/none.
    const logoSlot = container.querySelector("fieldset.media-slot");
    expect(logoSlot).not.toBeNull();
    const segButtons = (logoSlot as HTMLElement).querySelectorAll<HTMLButtonElement>(
      ".segment-btn",
    );
    expect(segButtons.length).toBe(3);

    // Click "File" (index 1) — data-URI mode.
    await userEvent.click(segButtons[1] as HTMLButtonElement);

    // File input now present, and the Gmail warning note is shown.
    expect(container.querySelector("#logo-file")).not.toBeNull();
    const notes = Array.from((logoSlot as HTMLElement).querySelectorAll(".note")).map(
      (n) => n.textContent,
    );
    expect(notes.some((text) => GMAIL_WARNINGS.includes(text))).toBe(true);
  });
});
