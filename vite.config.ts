import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Strict CSP injected at build time only (the dev server needs inline scripts
// for HMR). connect-src 'self' is the technical enforcement of the "no upload"
// promise: the browser itself blocks any cross-origin request, so a signature's
// data never leaves the device.
//
// Two directives are looser than the pdf-editor baseline, on purpose:
//   - style-src allows 'unsafe-inline': the live preview renders the signature
//     inside an <iframe srcdoc>, and a srcdoc iframe INHERITS the parent CSP.
//     Email signatures are, by spec, styled with inline `style="..."` attributes
//     (Outlook's Word engine ignores <style> blocks), so without 'unsafe-inline'
//     every preview style would be blocked. No script ever runs inline.
//   - img-src allows https: and data:: the logo/photo can be a hosted https URL
//     (the Gmail-safe option) or a base64 data URI (the Outlook/Apple option),
//     and social icons are inlined as data URIs.
// frame-src 'self' authorises the about:srcdoc preview frame under default-src
// 'none'.
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "font-src 'self'",
  "worker-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "frame-src 'self'",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
].join("; ");

function injectCsp(): Plugin {
  return {
    name: "inject-csp",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      );
    },
  };
}

/**
 * Offline PWA. The precache is limited to the app shell (HTML, CSS and every JS
 * chunk). maximumFileSizeToCacheInBytes stays at the 2 MiB default on purpose:
 * it is a regression alarm. If a future change lets a multi-megabyte asset match
 * globPatterns, the build fails loudly instead of silently bloating the
 * precache.
 */
function pwa(): Plugin[] {
  return VitePWA({
    registerType: "autoUpdate",
    // External registerSW.js rather than an inline script: keeps the strict
    // CSP (script-src 'self') intact.
    injectRegister: "script-defer",
    includeAssets: ["icon.svg"],
    workbox: {
      globPatterns: ["**/*.{js,css,html}"],
      clientsClaim: true,
    },
    manifest: {
      name: "Générateur de signatures email",
      short_name: "Signatures",
      description:
        "Créez des signatures email HTML professionnelles dans votre navigateur. Aucun upload.",
      theme_color: "#ff6b00",
      background_color: "#0e0e12",
      display: "standalone",
      icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    },
  });
}

// Deployed under /outils/signature-email/ on the CDS site; base must stay
// relative so the same build also works on a local preview or GitHub Pages.
export default defineConfig({
  base: "./",
  plugins: [react(), injectCsp(), pwa()],
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
