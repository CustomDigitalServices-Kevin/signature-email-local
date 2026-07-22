// Small controlled field primitives shared by every panel. Each keeps its label
// bound to its control (htmlFor/id) for accessibility. This file exports only
// components, so react-refresh/only-export-components stays happy.

import { useState } from "react";
import type { ChangeEvent, ReactNode, SyntheticEvent } from "react";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: TextFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder ?? ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function TextAreaField({ id, label, value, onChange, rows = 3 }: TextAreaFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}

interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ id, label, value, onChange }: ColorFieldProps) {
  return (
    <div className="field field-color">
      <label htmlFor={id}>{label}</label>
      <div className="color-row">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
          }}
        />
        <span className="color-hex">{value}</span>
      </div>
    </div>
  );
}

interface RangeFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export function RangeField({ id, label, value, min, max, step = 1, onChange }: RangeFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} <span className="range-value">{value}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(Number(e.target.value));
        }}
      />
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
}

export function SelectField({ id, label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          onChange(e.target.value);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  // Optional section glyph shown before the title (a section icon component).
  icon?: ReactNode;
}

// A native <details> collapsible. The open state is seeded from defaultOpen and
// kept in React state, synced to the browser's own toggle via onToggle. Passing
// a bare open={constant} would make React *control* the element and silently
// veto the user's clicks (React resets it on the next render), so the section
// would never expand. Tracking state + onToggle keeps it user-toggleable.
export function Collapsible({ title, children, defaultOpen = true, icon }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      className="collapsible"
      open={open}
      onToggle={(e: SyntheticEvent<HTMLDetailsElement>) => {
        setOpen(e.currentTarget.open);
      }}
    >
      <summary className="collapsible-summary">
        {icon ? (
          <span className="collapsible-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="collapsible-title">{title}</span>
      </summary>
      <div className="collapsible-body">{children}</div>
    </details>
  );
}
