import { ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";
import { FormatIcon } from "@/components/FormatIcon";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { TrainingModule } from "@/data/types";
import { formatMinutes, pluralize } from "@/lib/format";
import { getAssignmentsForModule, getVeteran } from "@/lib/queries";

export function ModuleCard({ trainingModule }: { trainingModule: TrainingModule }) {
  const veteran = getVeteran(trainingModule.sourceVeteranId);
  const assignedCount = getAssignmentsForModule(trainingModule.id).length;

  return (
    <Link
      href={`/library/${trainingModule.id}`}
      className="group flex h-full flex-col rounded-lg border border-neutral-200 bg-white transition-colors hover:border-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.12em] text-neutral-700">
            <FormatIcon format={trainingModule.format} className="size-3.5" />
            {trainingModule.format}
          </span>
          <span className="tabular-nums">{formatMinutes(trainingModule.durationMinutes)}</span>
        </div>
        <h3 className="mt-3 flex items-start justify-between gap-2 text-[15px] font-semibold leading-snug tracking-tight">
          <span>{trainingModule.title}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-950"
          />
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">{trainingModule.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          <Badge variant="muted">{trainingModule.category}</Badge>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3 text-xs text-neutral-600">
        <span className="flex min-w-0 items-center gap-2">
          <Avatar name={veteran.name} size="xs" inverted />
          <span className="truncate">{veteran.name}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 tabular-nums">
          <Users aria-hidden="true" className="size-3.5" />
          {pluralize(assignedCount, "leader")}
        </span>
      </div>
    </Link>
  );
}
