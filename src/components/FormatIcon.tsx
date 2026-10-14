import { AudioLines, FileText, Footprints, ListChecks, PlayCircle, type LucideIcon } from "lucide-react";
import type { ModuleFormat } from "@/data/types";

const ICONS: Record<ModuleFormat, LucideIcon> = {
  Video: PlayCircle,
  "PDF Guide": FileText,
  Checklist: ListChecks,
  "Call Recording": AudioLines,
  "Field Walk": Footprints,
};

export function FormatIcon({ format, className }: { format: ModuleFormat; className?: string }) {
  const Icon = ICONS[format];
  return <Icon aria-hidden="true" className={className ?? "size-4"} />;
}
