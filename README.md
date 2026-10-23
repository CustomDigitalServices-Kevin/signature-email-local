# Signature email local

Create professional **HTML email signatures** 100% in your browser. No upload, no
server, no tracking. Your data never leaves your device.

Part of the [Custom Digital Services](https://www.custom-digital-services.com) free
tools suite. Deployed at `/outils/signature-email/`.

## Features

- **20 templates** across 6 categories (classic, modern, minimal, creative,
  corporate, compact) — with/without photo, logo, social badges, CTA button,
  legal disclaimer.
- **Full editor**: identity, contact, address, six social networks, tagline,
  GDPR disclaimer, call-to-action.
- **Logo & photo**: hosted https URL (Gmail-safe), local file inlined as a base64
  data URI (Outlook/Apple Mail), or none — with clear guidance on each.
- **Style controls**: accent / text / muted / link colors, web-safe font, size.
- **Live preview** rendered in a sandboxed iframe, with a light/dark background
  toggle to check dark-mode rendering.
- **Rich copy** (`text/html` clipboard, so Gmail re-hosts inlined images) +
  **copy HTML source** + **download .html**.
- **Gmail character counter** with a warning before the 10 000-character
  truncation limit.
- **Install guides** for Gmail, classic Outlook, new Outlook / Web, Apple Mail
  (its two workarounds), and Thunderbird.
- **Bilingual** FR / EN, **offline PWA**, data persisted locally.

## Why it works everywhere

Email signatures are built the way email clients actually render: `<table>` layout,
100% inline CSS, web-safe fonts, explicit image dimensions, and the
`mso-table-lspace/rspace` hacks for Outlook's Word engine. Generated HTML is
sanitized with DOMPurify (email-safe tag/attribute whitelist) before it ever
reaches the preview or the clipboard.

## Stack

Vite 7 · React 19 · TypeScript (strict) · DOMPurify · Vitest · Playwright ·
vite-plugin-pwa. No backend. Strict CSP (`connect-src 'self'` — the browser itself
blocks any network call).

## Development

```bash
npm install
npm run dev            # dev server
npm run build          # type-check + production build
npm run test           # Vitest unit tests
npm run test:e2e       # Playwright E2E against the production build
npm run lint           # ESLint (strict, type-checked)
npm run check:licenses # fail on any non-permissive dependency license
```

## Privacy

Everything runs client-side. There is no analytics, no upload, and no external
request at runtime. The only images that leave your machine are the ones you
choose to reference by public URL.

## License

[MIT](./LICENSE) — © 2026 Kevin Tomas, Custom Digital Services.

## About

Built and maintained by [Kevin Tomas](https://www.custom-digital-services.com/?utm_source=github&utm_medium=readme&utm_campaign=signature-email-local), freelance Power Platform and Microsoft AI consultant (Custom Digital Services).
Try it online: [www.custom-digital-services.com/outils/signature-email](https://www.custom-digital-services.com/outils/signature-email/?utm_source=github&utm_medium=readme&utm_campaign=signature-email-local). More free tools: [www.custom-digital-services.com/outils](https://www.custom-digital-services.com/outils/?utm_source=github&utm_medium=readme&utm_campaign=signature-email-local)
