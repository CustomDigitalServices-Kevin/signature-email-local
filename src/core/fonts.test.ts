import { describe, it, expect } from "vitest";
import { FONT_STACKS, DEFAULT_FONT_STACK } from "./fonts";

describe("FONT_STACKS", () => {
  it("propose au moins 8 polices", () => {
    expect(FONT_STACKS.length).toBeGreaterThanOrEqual(8);
  });

  it("a des ids uniques", () => {
    const ids = FONT_STACKS.map((font) => font.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("a des labels non vides et des stacks non vides", () => {
    for (const font of FONT_STACKS) {
      expect(font.label.length).toBeGreaterThan(0);
      expect(font.stack.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("DEFAULT_FONT_STACK", () => {
  it("est présent parmi les stacks disponibles", () => {
    const stacks = FONT_STACKS.map((font) => font.stack);
    expect(stacks).toContain(DEFAULT_FONT_STACK);
  });
});
