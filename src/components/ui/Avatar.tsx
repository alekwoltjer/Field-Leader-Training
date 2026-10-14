import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
};

export function Avatar({
  name,
  size = "md",
  inverted = false,
  className,
}: {
  name: string;
  size?: Size;
  /** Black fill, used for veterans. Leaders use the outlined style. */
  inverted?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold tracking-wide",
        inverted
          ? "bg-neutral-950 text-white"
          : "border border-neutral-300 bg-white text-neutral-900",
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ names, max = 4 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <span className="flex -space-x-2">
      {shown.map((name) => (
        <Avatar key={name} name={name} size="xs" inverted className="ring-2 ring-white" />
      ))}
      {extra > 0 && (
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-700 ring-2 ring-white">
          +{extra}
        </span>
      )}
    </span>
  );
}
