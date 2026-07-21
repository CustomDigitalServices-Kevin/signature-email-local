import { describe, it, expect, vi, afterEach, type Mock } from "vitest";
import {
  isClipboardRichSupported,
  htmlToPlain,
  copyRichHtml,
  copyRichHtmlFallback,
} from "./clipboard";

// Minimal stand-in for the ClipboardItem constructor. Documented mock: happy-dom
// does not implement the async Clipboard API, so we provide just enough for the
// code under test to build and inspect a clipboard payload.
class FakeClipboardItem {
  public readonly data: Record<string, Blob>;
  constructor(data: Record<string, Blob>) {
    this.data = data;
  }
}

// happy-dom does not implement the deprecated document.execCommand, so it
// cannot be spied — a spy requires the property to already exist. We install a
// mock as an own, configurable property and remove it after each test.
function installExecCommand(result: boolean): Mock<(command: string) => boolean> {
  // Generic signature declares the string arg (so toHaveBeenCalledWith("copy")
  // type-checks) while the impl ignores it — no unused parameter.
  const mock = vi.fn<(command: string) => boolean>(() => result);
  Object.defineProperty(document, "execCommand", {
    configurable: true,
    writable: true,
    value: mock,
  });
  return mock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Reflect.deleteProperty(document, "execCommand");
});

describe("htmlToPlain", () => {
  it("retire les balises et décode les entités", () => {
    expect(htmlToPlain("<p>Bonjour&nbsp;<b>Marie</b></p>")).toBe("Bonjour Marie");
  });

  it("transforme les sauts de blocs en retours ligne", () => {
    expect(htmlToPlain("<div>Ligne 1</div><div>Ligne 2</div>")).toBe("Ligne 1\nLigne 2");
  });
});

describe("isClipboardRichSupported", () => {
  it("est faux quand ClipboardItem est absent", () => {
    vi.stubGlobal("ClipboardItem", undefined);
    expect(isClipboardRichSupported()).toBe(false);
  });

  it("est vrai quand ClipboardItem et clipboard.write sont présents", () => {
    vi.stubGlobal("ClipboardItem", FakeClipboardItem);
    vi.stubGlobal("navigator", { clipboard: { write: () => Promise.resolve() } });
    expect(isClipboardRichSupported()).toBe(true);
  });
});

describe("copyRichHtml (API moderne)", () => {
  it("appelle navigator.clipboard.write avec un ClipboardItem, sans await préalable", async () => {
    // Documented mock: capture the write() call to assert it happens
    // synchronously (same tick), which proves no await precedes it.
    const writeMock = vi.fn<(items: unknown[]) => Promise<void>>(() => Promise.resolve());
    vi.stubGlobal("ClipboardItem", FakeClipboardItem);
    vi.stubGlobal("navigator", { clipboard: { write: writeMock } });

    const promise = copyRichHtml("<b>x</b>");

    // write() must already have been invoked before any microtask runs.
    expect(writeMock).toHaveBeenCalledTimes(1);

    await promise;

    const firstCall = writeMock.mock.calls[0];
    const items = firstCall?.[0];
    expect(Array.isArray(items)).toBe(true);
    expect((items as unknown[]).length).toBe(1);
  });
});

describe("copyRichHtml (fallback execCommand)", () => {
  it("bascule sur execCommand('copy') quand l'API moderne est absente", async () => {
    vi.stubGlobal("ClipboardItem", undefined);

    // Documented mocks: happy-dom lacks execCommand and a functional Selection,
    // so we simulate selection + copy to exercise the fallback branch.
    const selectionStub: Pick<Selection, "removeAllRanges" | "addRange"> = {
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    };
    const rangeStub: Pick<Range, "selectNodeContents"> = {
      selectNodeContents: vi.fn(),
    };
    vi.spyOn(window, "getSelection").mockReturnValue(selectionStub as unknown as Selection);
    vi.spyOn(document, "createRange").mockReturnValue(rangeStub as unknown as Range);
    const execMock = installExecCommand(true);

    await expect(copyRichHtml("<b>x</b>")).resolves.toBeUndefined();
    expect(execMock).toHaveBeenCalledWith("copy");
  });

  it("copyRichHtmlFallback renvoie false quand execCommand échoue", () => {
    const selectionStub: Pick<Selection, "removeAllRanges" | "addRange"> = {
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    };
    const rangeStub: Pick<Range, "selectNodeContents"> = {
      selectNodeContents: vi.fn(),
    };
    vi.spyOn(window, "getSelection").mockReturnValue(selectionStub as unknown as Selection);
    vi.spyOn(document, "createRange").mockReturnValue(rangeStub as unknown as Range);
    installExecCommand(false);

    expect(copyRichHtmlFallback("<b>x</b>")).toBe(false);
  });
});
