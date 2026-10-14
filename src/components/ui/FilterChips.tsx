"use client";

import { cn } from "@/lib/cn";

export interface ChipOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
              active
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-950 hover:text-neutral-950",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  "tabular-nums text-[11px]",
                  active ? "text-neutral-300" : "text-neutral-400",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
