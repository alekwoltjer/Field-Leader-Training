"use client";

import { X } from "lucide-react";
import {
  useId,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { cn } from "@/lib/cn";

type Placement = "center" | "right";
type Size = "md" | "lg";

let openOverlays = 0;

function lockScroll() {
  openOverlays += 1;
  document.documentElement.dataset.overlayOpen = "true";
}

function unlockScroll() {
  openOverlays = Math.max(0, openOverlays - 1);
  if (openOverlays === 0) delete document.documentElement.dataset.overlayOpen;
}

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  placement?: Placement;
  size?: Size;
}

/**
 * Accessible modal built on the native <dialog> element, which provides focus
 * trapping, Escape-to-close, and inert background content.
 *
 * Cache Components keeps hidden routes mounted inside React <Activity>. A modal
 * dialog left open in a hidden route would keep the visible page inert, so the
 * layout-effect cleanup always closes the native dialog. The same cleanup runs
 * during Strict Mode's simulated remount, which is why `close` events that
 * arrive after the dialog has been reopened are ignored.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  eyebrow,
  children,
  footer,
  placement = "center",
  size = "md",
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    lockScroll();
    return () => {
      unlockScroll();
      if (dialog.open) dialog.close();
    };
  }, [open]);

  function handleNativeClose(event: SyntheticEvent<HTMLDialogElement>) {
    if (!event.currentTarget.open) onClose();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={handleNativeClose}
      onClick={handleBackdropClick}
      className={cn(
        "bg-white p-0 text-neutral-950 shadow-2xl backdrop:bg-neutral-950/45",
        placement === "center" &&
          "m-auto max-h-[min(calc(100dvh-2rem),56rem)] w-[calc(100%-2rem)] rounded-xl open:animate-dialog-in",
        placement === "center" && (size === "lg" ? "max-w-3xl" : "max-w-lg"),
        placement === "right" &&
          "my-0 mr-0 ml-auto h-dvh max-h-none w-full max-w-xl border-l border-neutral-200 open:animate-sheet-in",
      )}
    >
      {open && (
        <div
          className={cn(
            "flex flex-col",
            placement === "right" ? "h-full" : "max-h-[inherit]",
          )}
        >
          <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
            <div className="min-w-0">
              {eyebrow && (
                <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                  {eyebrow}
                </div>
              )}
              <h2 id={titleId} className="text-lg font-semibold leading-snug tracking-tight">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1 text-sm text-neutral-600">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-1 rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-black"
            >
              <X className="size-4" />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && (
            <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-6 py-4">
              {footer}
            </footer>
          )}
        </div>
      )}
    </dialog>
  );
}
