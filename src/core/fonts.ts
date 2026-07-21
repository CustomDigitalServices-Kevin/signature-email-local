// Web-safe font stacks only. Email clients block web fonts and silently fall
// back (Outlook -> Times New Roman), so every option here is a system font
// available across Windows/macOS/Linux mail clients. Each `stack` is the exact
// value to drop into a `font-family:` inline style.
import type { FontStack } from "./types";

export const FONT_STACKS: FontStack[] = [
  { id: "arial", label: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { id: "helvetica", label: "Helvetica", stack: "Helvetica, Arial, sans-serif" },
  { id: "verdana", label: "Verdana", stack: "Verdana, Geneva, sans-serif" },
  { id: "tahoma", label: "Tahoma", stack: "Tahoma, Verdana, sans-serif" },
  {
    id: "trebuchet",
    label: "Trebuchet MS",
    stack: '"Trebuchet MS", Helvetica, sans-serif',
  },
  { id: "georgia", label: "Georgia", stack: 'Georgia, "Times New Roman", serif' },
  {
    id: "times",
    label: "Times New Roman",
    stack: '"Times New Roman", Times, serif',
  },
  {
    id: "courier",
    label: "Courier New",
    stack: '"Courier New", Courier, monospace',
  },
  {
    id: "system",
    label: "System UI",
    stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
];

// Arial stack: the most universally rendered option, used as the default.
export const DEFAULT_FONT_STACK = "Arial, Helvetica, sans-serif";
