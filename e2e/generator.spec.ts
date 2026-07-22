import { expect, test } from "@playwright/test";
import { MESSAGES } from "../src/i18n/messages";

// The UI locale is chosen from navigator.language by LocaleProvider. Pin the
// browser locale so every label assertion is deterministic (English here).
test.use({ locale: "en-US" });

const M = MESSAGES.en;
const PREVIEW = '[data-testid="preview-frame"]';

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("loads with the app title and 20 template cards", async ({ page }) => {
  await expect(page.getByText(M.appTitle)).toBeVisible();
  await expect(page.getByTestId("template-card")).toHaveCount(20);
});

test("typing the full name reflects in the preview iframe", async ({ page }) => {
  const name = "Ada Lovelace E2E";
  await page.locator("#f-fullName").fill(name);
  await expect(page.frameLocator(PREVIEW).locator("body")).toContainText(name);
});

test("selecting another template changes the preview", async ({ page }) => {
  await page.locator("#f-fullName").fill("Template Switch");
  const preview = page.frameLocator(PREVIEW);
  await expect(preview.locator("body")).toContainText("Template Switch");
  const before = await preview.locator("body").innerHTML();

  // The default active template is the first card; pick a different one.
  const target = page.getByTestId("template-card").nth(9);
  await target.click();
  await expect(target).toHaveClass(/is-active/);

  // srcDoc is rebuilt with different markup, so the iframe HTML must differ.
  await expect
    .poll(async () => page.frameLocator(PREVIEW).locator("body").innerHTML())
    .not.toBe(before);
});

test("changing the accent color updates the preview", async ({ page }) => {
  await page.locator("#f-fullName").fill("Accent Test");
  await expect(page.frameLocator(PREVIEW).locator("body")).toContainText("Accent Test");

  // The Style section is collapsed by default; expand it before editing colours.
  const styleSection = page.locator("details", { has: page.locator("#s-accent") });
  await styleSection.locator("summary").click();
  await expect(styleSection).toHaveAttribute("open", "");
  await page.locator("#s-accent").fill("#abcdef");

  // The default template paints an accent rule with bgcolor=<accentColor>.
  await expect
    .poll(async () => (await page.frameLocator(PREVIEW).locator("body").innerHTML()).toLowerCase())
    .toContain("#abcdef");
});

test("character counter is visible and enters the warn state on large content", async ({
  page,
}) => {
  const meter = page.getByTestId("char-meter");
  await expect(meter).toBeVisible();
  await expect(meter).toContainText(M.charsUnit);

  // The name (rendered exactly once by the default template) is the only field
  // we vary, so total length = fixed markup overhead + name length. Measure the
  // overhead with an empty name, then size the name to land deterministically
  // in the warn band [8000, 10000) regardless of the default contact markup.
  const readCount = async (): Promise<number> => {
    const txt = await meter.locator(".char-count").innerText();
    return Number.parseInt(txt.replace(/\D/g, ""), 10);
  };
  await page.locator("#f-fullName").fill("");
  const overhead = await readCount();
  const warnName = 8300 - overhead; // total -> 8300, safely inside the warn band
  await page.locator("#f-fullName").fill("A".repeat(warnName));
  await expect(meter).toHaveClass(/char-warn/);

  // A far larger name pushes total past the 10000 hard limit -> over state.
  await page.locator("#f-fullName").fill("A".repeat(11000));
  await expect(meter).toHaveClass(/char-over/);
});

test("download produces a signature.html file", async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByTestId("download-html").click(),
  ]);
  expect(download.suggestedFilename()).toBe("signature.html");
});

test("copy writes the signature to the clipboard and shows a success toast", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const name = "Copy Target E2E";
  await page.locator("#f-fullName").fill(name);

  await page.getByTestId("copy-signature").click();
  await expect(page.locator(".toast-success")).toBeVisible();

  // The rich copy also writes a text/plain flavour containing the name.
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toContain(name);
});

test("an XSS payload in a field is neutralized in the preview", async ({ page }) => {
  const marker = "PWNMARKER";
  // Two classic vectors: an onerror image handler and an inline script.
  const payload = `<img src=x onerror="window.__xss=1"><script>window.__xss=1</script>${marker}`;
  await page.locator("#f-fullName").fill(payload);

  const preview = page.frameLocator(PREVIEW);
  // The payload survives only as inert, escaped text (the marker is visible).
  await expect(preview.locator("body")).toContainText(marker);

  // (a) DOMPurify + escaping: no live script node, no element carrying onerror,
  // and no real script/img markup in the sanitized DOM.
  expect(await preview.locator("script").count()).toBe(0);
  expect(await preview.locator("[onerror]").count()).toBe(0);
  const html = (await preview.locator("body").innerHTML()).toLowerCase();
  expect(html).not.toContain("<script");
  expect(html).not.toContain("<img");

  // (b) Defense in depth: the injected script never executed in the top page.
  // Documented cast: window has no typed __xss probe field.
  const flag = await page.evaluate(() => (window as unknown as { __xss?: number }).__xss);
  expect(flag).toBeUndefined();
});

test("the language toggle switches labels between EN and FR", async ({ page }) => {
  await expect(page.getByRole("button", { name: M.reset })).toBeVisible();
  await page.getByTestId("lang-fr").click();
  await expect(page.getByRole("button", { name: MESSAGES.fr.reset })).toBeVisible();
});

test("install guides show the Apple Mail special case", async ({ page }) => {
  await page.getByRole("tab", { name: M.guideAppleMail }).click();
  await expect(page.getByText(/Apple Mail does not allow/)).toBeVisible();
  await expect(page.getByText(/Method A/)).toBeVisible();
});
