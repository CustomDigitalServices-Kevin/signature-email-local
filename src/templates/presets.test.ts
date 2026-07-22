import { describe, expect, it } from "vitest";
import { FONT_STACKS } from "../core/fonts";
import { getPreset, TEMPLATE_PRESETS } from "./presets";
import { TEMPLATES } from "./index";

const HEX = /^#[0-9a-f]{6}$/i;
const STACKS = new Set(FONT_STACKS.map((f) => f.stack));

describe("template presets", () => {
  it("declares a preset for every registered template", () => {
    for (const template of TEMPLATES) {
      expect(TEMPLATE_PRESETS[template.id]).toBeDefined();
    }
  });

  it("has no preset for an unregistered id", () => {
    const ids = new Set(TEMPLATES.map((t) => t.id));
    for (const id of Object.keys(TEMPLATE_PRESETS)) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("uses valid 6-digit hex colours and a known font stack", () => {
    for (const [id, preset] of Object.entries(TEMPLATE_PRESETS)) {
      for (const color of [
        preset.accentColor,
        preset.textColor,
        preset.mutedColor,
        preset.linkColor,
      ]) {
        expect(color, `${id} colour`).toMatch(HEX);
      }
      expect(STACKS.has(preset.fontFamily), `${id} font`).toBe(true);
      expect(preset.fontSize).toBeGreaterThanOrEqual(11);
      expect(preset.fontSize).toBeLessThanOrEqual(18);
    }
  });

  it("keeps the historical CDS orange for the default template", () => {
    const preset = getPreset("classic-stacked");
    expect(preset.accentColor).toBe("#ff6b00");
    expect(preset.linkColor).toBe("#ff6b00");
  });

  it("falls back to the default preset for an unknown id", () => {
    expect(getPreset("does-not-exist")).toEqual(getPreset("classic-stacked"));
  });

  it("returns a fresh copy that callers can mutate safely", () => {
    const a = getPreset("modern-tech-dev");
    const b = getPreset("modern-tech-dev");
    expect(a).not.toBe(b);
    a.accentColor = "#000000";
    expect(b.accentColor).not.toBe("#000000");
  });

  it("gives each template a distinct accent (variety check)", () => {
    const accents = Object.values(TEMPLATE_PRESETS).map((p) => p.accentColor.toLowerCase());
    // At least 15 distinct accent colours across the 20 templates.
    expect(new Set(accents).size).toBeGreaterThanOrEqual(15);
  });
});
