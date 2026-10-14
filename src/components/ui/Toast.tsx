"use client";

import { AlertTriangle, Check, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ToastInput {
  title: string;
  description?: string;
  tone?: "success" | "error";
}

interface ToastItem extends ToastInput {
  id: number;
}

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

const TOAST_DURATION_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast: ToastInput) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-lg bg-neutral-950 px-4 py-3 text-white shadow-xl"
    >
      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950">
        {toast.tone === "error" ? (
          <AlertTriangle aria-hidden="true" className="size-3" strokeWidth={3} />
        ) : (
          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-[13px] text-neutral-300">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="-mr-1 rounded p-1 text-neutral-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return show;
}
