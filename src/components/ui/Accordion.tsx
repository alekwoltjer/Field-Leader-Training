import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Disclosure built on native <details>, so it is keyboard and screen-reader accessible. */
export function AccordionItem({
  summary,
  children,
  defaultOpen = false,
  className,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group rounded-lg border border-neutral-200 bg-white transition-colors open:border-neutral-950",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 rounded-lg px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">{summary}</div>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-neutral-500 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-neutral-200 px-5 py-5">{children}</div>
    </details>
  );
}
