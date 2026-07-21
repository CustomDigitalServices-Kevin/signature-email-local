import { describe, expect, it } from "vitest";
import type { SignatureData } from "../core/types";
import { SOCIAL_NETWORKS, type TemplateCategory } from "../core/types";
import { DEFAULT_TEMPLATE_ID, getTemplate, TEMPLATES } from "./index";

const BASE_STYLE = {
  accentColor: "#ff6b00",
  textColor: "#1a1a1a",
  mutedColor: "#6b7280",
  linkColor: "#0a66c2",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 13,
};

const SAMPLE_DATA: SignatureData = {
  fullName: "Kevin Tomas",
  jobTitle: "Power Platform Consultant",
  company: "Custom Digital Services",
  department: "Digital Solutions",
  phone: "+33 1 23 45 67 89",
  mobile: "+33 6 12 34 56 78",
  email: "kevin@custom-digital-services.com",
  website: "https://custom-digital-services.com",
  address: "12 rue de la Republique, 75001 Paris",
  social: {
    linkedin: "https://linkedin.com/in/kevintomas",
    twitter: "https://x.com/kevintomas",
    instagram: "https://instagram.com/kevintomas",
    github: "https://github.com/kevintomas",
    facebook: "https://facebook.com/kevintomas",
    youtube: "https://youtube.com/@kevintomas",
  },
  logo: { kind: "url", value: "https://cdn.example.com/logo.png", width: 140 },
  photo: { kind: "url", value: "https://cdn.example.com/photo.jpg", width: 84 },
  tagline: "Build better with Microsoft Power Platform",
  disclaimer:
    "This email and any attachments are confidential and intended solely for the addressee.",
  ctaLabel: "Book a call",
  ctaUrl: "https://cal.com/kevintomas",
  templateId: "classic-stacked",
  style: BASE_STYLE,
};

const MINIMAL_DATA: SignatureData = {
  fullName: "Ada Solo",
  jobTitle: "",
  company: "",
  department: "",
  phone: "",
  mobile: "",
  email: "",
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
  photo: { kind: "none", value: "", width: 84 },
  tagline: "",
  disclaimer: "",
  ctaLabel: "",
  ctaUrl: "",
  templateId: "classic-stacked",
  style: BASE_STYLE,
};

const CATEGORIES: readonly TemplateCategory[] = [
  "classic",
  "modern",
  "minimal",
  "creative",
  "corporate",
  "compact",
];

const SOCIAL_GLYPHS = ["in", "X", "IG", "GH", "f", "YT"];

describe("registry", () => {
  it("exposes exactly 20 templates", () => {
    expect(TEMPLATES.length).toBe(20);
  });

  it("has unique ids", () => {
    const ids = TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses kebab-case ids only", () => {
    for (const template of TEMPLATES) {
      expect(template.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });

  it("resolves the default template id", () => {
    expect(getTemplate(DEFAULT_TEMPLATE_ID)).toBeDefined();
    expect(DEFAULT_TEMPLATE_ID).toBe(TEMPLATES[0]?.id);
  });

  it("returns undefined for an unknown id", () => {
    expect(getTemplate("inexistant")).toBeUndefined();
  });

  it("declares complete, valid metadata for each template", () => {
    for (const template of TEMPLATES) {
      expect(template.name.fr.length).toBeGreaterThan(0);
      expect(template.name.en.length).toBeGreaterThan(0);
      expect(template.description.fr.length).toBeGreaterThan(0);
      expect(template.description.en.length).toBeGreaterThan(0);
      expect(CATEGORIES).toContain(template.category);
      const caps = template.capabilities;
      for (const key of ["photo", "logo", "social", "cta", "disclaimer", "tagline"] as const) {
        expect(typeof caps[key]).toBe("boolean");
      }
    }
  });
});

describe.each(TEMPLATES.map((template) => [template.id, template] as const))(
  "template %s",
  (_id, template) => {
    it("renders valid signature HTML from full data", () => {
      const html = template.render(SAMPLE_DATA);
      expect(html.length).toBeGreaterThan(0);
      expect(html).toContain("<table");
      expect(html).toContain(SAMPLE_DATA.fullName);
      expect(html).not.toContain("<script");
      expect(html).not.toContain(" class=");
      expect(html).not.toContain("<style");
      // No div-based layout: templates must stay table-only.
      expect(html).not.toContain("<div");
    });

    it("uses the mandatory Outlook table hacks on every table", () => {
      const html = template.render(SAMPLE_DATA);
      const openTags = html.match(/<table/g) ?? [];
      const hacks = html.match(/mso-table-lspace:0pt/g) ?? [];
      expect(hacks.length).toBe(openTags.length);
    });

    it("degrades gracefully with minimal data (no broken image, no social badge)", () => {
      const html = template.render(MINIMAL_DATA);
      expect(html.length).toBeGreaterThan(0);
      expect(html).toContain("<table");
      expect(html).not.toMatch(/<img[^>]*src=""/);
      expect(html).not.toContain('src=" "');
      // With every social URL empty, no badge anchor may be emitted.
      for (const glyph of SOCIAL_GLYPHS) {
        expect(html).not.toContain(`>${glyph}</a>`);
      }
    });

    it("escapes a script injection in the full name", () => {
      const attacked: SignatureData = {
        ...SAMPLE_DATA,
        fullName: "<script>alert(1)</script>",
      };
      const html = template.render(attacked);
      expect(html).not.toContain("<script>alert(1)</script>");
      expect(html).toContain("&lt;script&gt;");
    });
  },
);

describe("social ordering", () => {
  it("keeps the canonical SOCIAL_NETWORKS order in a rendered template", () => {
    const html = TEMPLATES[0]?.render(SAMPLE_DATA) ?? "";
    const positions = SOCIAL_NETWORKS.map((network) => {
      const glyph = {
        linkedin: "in",
        twitter: "X",
        instagram: "IG",
        github: "GH",
        facebook: "f",
        youtube: "YT",
      }[network];
      return html.indexOf(`>${glyph}</a>`);
    });
    const filtered = positions.filter((pos) => pos >= 0);
    const sorted = [...filtered].sort((a, b) => a - b);
    expect(filtered).toEqual(sorted);
  });
});
