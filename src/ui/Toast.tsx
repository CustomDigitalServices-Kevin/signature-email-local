// Transient feedback for copy/download actions. Auto-dismisses after a few
// seconds; also dismissible immediately. Rendered as an aria-live region.

import { useEffect } from "react";

export type ToastTone = "success" | "error";

export interface ToastState {
  message: string;
  tone: ToastTone;
  // Monotonic id so re-showing the same message restarts the timer.
  id: number;
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.tone}`} role="status" aria-live="polite">
      <span>{toast.message}</span>
      <button type="button" className="toast-close" aria-label="OK" onClick={onDismiss}>
        &times;
      </button>
    </div>
  );
}
