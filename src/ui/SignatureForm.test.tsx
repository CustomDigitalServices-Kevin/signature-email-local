import { useState } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SignatureData, TemplateCapabilities } from "../core/types";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { SignatureForm } from "./SignatureForm";

function makeData(): SignatureData {
  return {
    fullName: "",
    jobTitle: "",
    company: "",
    department: "",
    phone: "",
    mobile: "",
    email: "",
    website: "",
    address: "",
    social: { linkedin: "", twitter: "", instagram: "", github: "", facebook: "", youtube: "" },
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

const ALL_CAPS: TemplateCapabilities = {
  photo: true,
  logo: true,
  social: true,
  cta: true,
  disclaimer: true,
  tagline: true,
};

// Stateful harness: the form is controlled, so onChange must feed the new data
// back for typed characters to accumulate — mirroring how App wires it.
function Harness({ onChangeSpy }: { onChangeSpy: (d: SignatureData) => void }) {
  const [data, setData] = useState<SignatureData>(makeData);
  return (
    <LocaleProvider>
      <SignatureForm
        data={data}
        capabilities={ALL_CAPS}
        onChange={(next) => {
          onChangeSpy(next);
          setData(next);
        }}
      />
    </LocaleProvider>
  );
}

describe("SignatureForm", () => {
  it("propagates the typed full name through onChange", async () => {
    const onChangeSpy = vi.fn<(d: SignatureData) => void>();
    const { container } = render(<Harness onChangeSpy={onChangeSpy} />);

    const input = container.querySelector<HTMLInputElement>("#f-fullName");
    expect(input).not.toBeNull();

    await userEvent.type(input as HTMLInputElement, "Grace");

    expect(input as HTMLInputElement).toHaveValue("Grace");
    expect(onChangeSpy).toHaveBeenCalled();
    const calls = onChangeSpy.mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall).toBeDefined();
    if (lastCall) {
      expect(lastCall[0].fullName).toBe("Grace");
    }
  });
});
