// Inline line icons for the form section headers. Each is a self-contained SVG
// (16x16, currentColor stroke, no external asset) so they work under the strict
// CSP and inherit the summary text colour. This file exports only components,
// keeping react-refresh/only-export-components happy.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// Shared frame: 16px box, rounded strokes, no fill. Individual paths below.
function base(props: IconProps) {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

// Identity — a person inside a badge outline.
export function IdentityIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z" />
      <circle cx="12" cy="10" r="2.4" />
      <path d="M8 16.6a4 4 0 0 1 8 0" />
    </svg>
  );
}

// Contact — an envelope.
export function ContactIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="1.8" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

// Social links — three connected nodes (share).
export function SocialIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="m8.1 10.9 7.8-3.8M8.1 13.1l7.8 3.8" />
    </svg>
  );
}

// Extras — a star (tagline, CTA, disclaimer flourishes).
export function ExtrasIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}

// Logo & photo — a picture frame with a sun and mountain.
export function MediaIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M4 17l5-4.5 4 3.2 3-2.4 4 3.4" />
    </svg>
  );
}

// Style — a paint droplet (colours, font, size).
export function StyleIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 3.5c3.4 4 6 6.9 6 10.1a6 6 0 0 1-12 0c0-3.2 2.6-6.1 6-10.1z" />
      <path d="M9 14.2a3 3 0 0 0 3 2.8" />
    </svg>
  );
}
