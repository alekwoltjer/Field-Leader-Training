import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "muted";

const variants: Record<Variant, string> = {
  solid: "bg-neutral-950 text-white border-neutral-950",
  outline: "bg-white text-neutral-800 border-neutral-300",
  muted: "bg-neutral-100 text-neutral-700 border-transparent",
};

export function Badge({
  children,
  variant = "outline",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 [&_svg]:size-3",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
