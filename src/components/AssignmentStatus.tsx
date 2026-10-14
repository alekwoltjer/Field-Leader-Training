import { Check } from "lucide-react";
import type { AssignmentStatus } from "@/data/types";
import { cn } from "@/lib/cn";
import { Badge } from "./ui/Badge";

export const STATUS_LABEL: Record<AssignmentStatus, string> = {
  completed: "Completed",
  "this-week": "This week",
  scheduled: "Scheduled",
};

const SIZES = {
  sm: { box: "size-4", dot: "size-3", check: "size-3" },
  md: { box: "size-5", dot: "size-3.5", check: "size-3.5" },
} as const;

/** Compact glyph used in the content mapping matrix and legends. */
export function StatusMark({
  status,
  size = "md",
}: {
  status: AssignmentStatus | "none";
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  const box = cn("inline-flex shrink-0 items-center justify-center", s.box);
  switch (status) {
    case "completed":
      return (
        <span className={cn(box, "rounded bg-neutral-950 text-white")}>
          <Check aria-hidden="true" className={s.check} strokeWidth={3} />
        </span>
      );
    case "this-week":
      return (
        <span className={box}>
          <span className={cn("rounded-full bg-neutral-950", s.dot)} />
        </span>
      );
    case "scheduled":
      return (
        <span className={box}>
          <span className={cn("rounded-full border-2 border-neutral-950", s.dot)} />
        </span>
      );
    case "none":
      return (
        <span className={box}>
          <span className="size-1 rounded-full bg-neutral-300" />
        </span>
      );
  }
}

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  if (status === "completed") {
    return (
      <Badge variant="muted">
        <Check aria-hidden="true" strokeWidth={3} />
        Completed
      </Badge>
    );
  }
  return <Badge variant={status === "this-week" ? "solid" : "outline"}>{STATUS_LABEL[status]}</Badge>;
}
