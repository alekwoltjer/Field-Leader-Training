import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8 lg:py-14">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-3 text-base leading-relaxed text-pretty text-neutral-600">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  actions,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h2 id={id} className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-pretty text-neutral-600">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
