import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { ExportBar } from "./ExportBar";

const WARN = 8000;
const LIMIT = 10000;

interface Handlers {
  onCopyRich?: () => void;
  onCopyHtml?: () => void;
  onDownload?: () => void;
}

function renderBar(charCount: number, handlers: Handlers = {}) {
  const noop = () => {
    /* intentional no-op for unspecified handlers */
  };
  return render(
    <LocaleProvider>
      <ExportBar
        charCount={charCount}
        warnThreshold={WARN}
        limitThreshold={LIMIT}
        clipboardRichSupported={true}
        onCopyRich={handlers.onCopyRich ?? noop}
        onCopyHtml={handlers.onCopyHtml ?? noop}
        onDownload={handlers.onDownload ?? noop}
      />
    </LocaleProvider>,
  );
}

describe("ExportBar character meter", () => {
  it("shows the count and stays neutral well under the warn threshold", () => {
    const { container } = renderBar(1200);
    expect(container.querySelector(".char-meter.char-ok")).not.toBeNull();
    expect(container.querySelector(".char-warn")).toBeNull();
    expect(container.querySelector(".char-over")).toBeNull();
    expect(container.querySelector(".char-count")?.textContent).toContain("1200");
  });

  it("flags a warning between warn and limit", () => {
    const { container } = renderBar(8500);
    expect(container.querySelector(".char-meter.char-warn")).not.toBeNull();
    // a warning message is rendered alongside the count
    expect(container.querySelector(".char-msg")).not.toBeNull();
  });

  it("flags an over-limit error at or above the limit", () => {
    const { container } = renderBar(10500);
    expect(container.querySelector(".char-meter.char-over")).not.toBeNull();
    expect(container.querySelector(".char-msg")).not.toBeNull();
  });
});

describe("ExportBar actions", () => {
  it("invokes onCopyRich when the primary copy button is clicked", async () => {
    const onCopyRich = vi.fn();
    const { container } = renderBar(500, { onCopyRich });
    const btn = container.querySelector<HTMLButtonElement>(".btn-primary");
    expect(btn).not.toBeNull();
    await userEvent.click(btn as HTMLButtonElement);
    expect(onCopyRich).toHaveBeenCalledOnce();
  });
});
