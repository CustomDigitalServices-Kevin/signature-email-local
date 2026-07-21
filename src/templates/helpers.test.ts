import { describe, expect, it } from "vitest";
import type { ImageSource, SignatureStyle, SocialLinks } from "../core/types";
import {
  attr,
  ctaButton,
  displayUrl,
  escapeHtml,
  hasImage,
  img,
  initials,
  mailtoLink,
  normalizeUrl,
  renderContactTable,
  renderSocialBadges,
  roundPhoto,
  telLink,
} from "./helpers";

const STYLE: SignatureStyle = {
  accentColor: "#ff6b00",
  textColor: "#1a1a1a",
  mutedColor: "#6b7280",
  linkColor: "#0a66c2",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 13,
};

const EMPTY_SOCIAL: SocialLinks = {
  linkedin: "",
  twitter: "",
  instagram: "",
  github: "",
  facebook: "",
  youtube: "",
};

describe("escapeHtml", () => {
  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  });

  it("neutralizes a script injection", () => {
    const out = escapeHtml("<script>alert(1)</script>");
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });

  it("escapes double quotes inside attribute values", () => {
    expect(attr('" onmouseover="alert(1)')).toBe("&quot; onmouseover=&quot;alert(1)");
  });
});

describe("initials", () => {
  it("takes the first and last word initials", () => {
    expect(initials("Kevin Tomas")).toBe("KT");
  });

  it("uppercases a single name", () => {
    expect(initials("madonna")).toBe("M");
  });

  it("ignores extra whitespace and middle names", () => {
    expect(initials("  Jean  Michel  Dupont ")).toBe("JD");
  });

  it("falls back to ? for an empty name", () => {
    expect(initials("   ")).toBe("?");
  });
});

describe("normalizeUrl / displayUrl", () => {
  it("keeps an https URL untouched", () => {
    expect(normalizeUrl("https://cds.fr")).toBe("https://cds.fr");
  });

  it("prepends https:// to a bare domain", () => {
    expect(normalizeUrl("cds.fr")).toBe("https://cds.fr");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeUrl("   ")).toBe("");
  });

  it("strips scheme and trailing slash for display", () => {
    expect(displayUrl("https://cds.fr/")).toBe("cds.fr");
  });
});

describe("mailtoLink / telLink", () => {
  it("builds a mailto href", () => {
    expect(mailtoLink("a@b.com")).toBe("mailto:a@b.com");
  });

  it("compacts phone separators into a tel href", () => {
    expect(telLink("+33 6 12 34 56 78")).toBe("tel:+33612345678");
  });
});

describe("hasImage", () => {
  it("is false for a none kind", () => {
    expect(hasImage({ kind: "none", value: "", width: 80 })).toBe(false);
  });

  it("is false for an empty value", () => {
    expect(hasImage({ kind: "url", value: "   ", width: 80 })).toBe(false);
  });

  it("is true for a real url", () => {
    expect(hasImage({ kind: "url", value: "https://x/y.png", width: 80 })).toBe(true);
  });
});

describe("img", () => {
  it("emits explicit width/height and reset styles", () => {
    const source: ImageSource = { kind: "url", value: "https://x/y.png", width: 120 };
    const out = img(source, "Logo", "", 40);
    expect(out).toContain('width="120"');
    expect(out).toContain('height="40"');
    expect(out).toContain("display:block");
    expect(out).toContain('alt="Logo"');
  });

  it("escapes a malicious alt text", () => {
    const source: ImageSource = { kind: "url", value: "https://x/y.png", width: 40 };
    expect(img(source, '"><script>', "")).toContain("&quot;&gt;&lt;script&gt;");
  });
});

describe("renderSocialBadges", () => {
  it("returns empty string when every network is empty", () => {
    expect(renderSocialBadges(EMPTY_SOCIAL, STYLE)).toBe("");
  });

  it("renders only the filled networks in canonical order", () => {
    const social: SocialLinks = {
      ...EMPTY_SOCIAL,
      github: "https://github.com/k",
      linkedin: "https://linkedin.com/in/k",
    };
    const out = renderSocialBadges(social, STYLE);
    expect(out).toContain(">in<");
    expect(out).toContain(">GH<");
    expect(out).not.toContain(">IG<");
    // linkedin ("in") comes before github ("GH") in SOCIAL_NETWORKS order.
    expect(out.indexOf(">in<")).toBeLessThan(out.indexOf(">GH<"));
  });

  it("uses brand colors when requested", () => {
    const social: SocialLinks = { ...EMPTY_SOCIAL, facebook: "https://fb.com/k" };
    expect(renderSocialBadges(social, STYLE, { useBrandColors: true })).toContain("#1877F2");
  });

  it("escapes a javascript URL into an href attribute without executing", () => {
    const social: SocialLinks = { ...EMPTY_SOCIAL, linkedin: 'https://x/"><script>' };
    const out = renderSocialBadges(social, STYLE);
    expect(out).not.toContain('"><script>');
  });
});

describe("roundPhoto", () => {
  it("renders an img when a photo is provided", () => {
    const photo: ImageSource = { kind: "url", value: "https://x/p.jpg", width: 80 };
    const out = roundPhoto(photo, "Kevin Tomas", 80, STYLE);
    expect(out).toContain("<img");
    expect(out).toContain("border-radius:50%");
  });

  it("falls back to an initials disc when no photo", () => {
    const photo: ImageSource = { kind: "none", value: "", width: 80 };
    const out = roundPhoto(photo, "Kevin Tomas", 80, STYLE);
    expect(out).not.toContain("<img");
    expect(out).toContain(">KT<");
    expect(out).toContain("border-radius:50%");
  });
});

describe("ctaButton", () => {
  it("renders a table-based button, never a <button>", () => {
    const out = ctaButton("Book a call", "https://cal.com/k", STYLE);
    expect(out).toContain("<table");
    expect(out).not.toContain("<button");
    expect(out).toContain("Book a call");
    expect(out).toContain(STYLE.accentColor);
  });
});

describe("renderContactTable", () => {
  const contact = {
    phone: "+33 1 23 45 67 89",
    mobile: "",
    email: "k@cds.fr",
    website: "cds.fr",
    address: "",
  };

  it("renders only the filled fields", () => {
    const out = renderContactTable(contact, STYLE);
    expect(out).toContain("tel:+33123456789");
    expect(out).toContain("mailto:k@cds.fr");
    expect(out).toContain("cds.fr");
  });

  it("returns empty string when nothing is set", () => {
    const out = renderContactTable(
      { phone: "", mobile: "", email: "", website: "", address: "" },
      STYLE,
    );
    expect(out).toBe("");
  });

  it("adds prefix labels when requested", () => {
    const out = renderContactTable(contact, STYLE, { labels: true });
    expect(out).toContain("Tel: ");
    expect(out).toContain("Email: ");
  });
});
