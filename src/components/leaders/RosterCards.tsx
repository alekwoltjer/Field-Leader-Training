"use client";

import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { FormatIcon } from "@/components/FormatIcon";
import { Avatar } from "@/components/ui/Avatar";
import { leaders } from "@/data/leaders";
import type { Leader } from "@/data/types";
import { pluralize } from "@/lib/format";
import { getAssignmentsForLeader, getJob, getModule, getQuestionsByLeader } from "@/lib/queries";
import { EmailAction } from "./EmailAction";

/** Stacked roster layout for small screens, where the six-column table cannot fit. */
export function RosterCards({
  sentAtByLeader,
  onOpen,
  onEmail,
}: {
  sentAtByLeader: Record<string, string>;
  onOpen: (leader: Leader) => void;
  onEmail: (leader: Leader) => void;
}) {
  return (
    <ul className="space-y-3">
      {leaders.map((leader) => {
        const job = getJob(leader.jobId);
        const questions = getQuestionsByLeader(leader.id);
        const latest = questions[0];
        const thisWeek = getAssignmentsForLeader(leader.id, "this-week").map((a) => getModule(a.moduleId));

        return (
          <li key={leader.id} className="rounded-lg border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => onOpen(leader)}
              aria-label={`Open profile for ${leader.name}`}
              className="flex w-full items-center gap-3 rounded-t-lg border-b border-neutral-100 px-4 py-3 text-left hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
            >
              <Avatar name={leader.name} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{leader.name}</span>
                <span className="block truncate text-xs text-neutral-500">
                  {leader.role} · {leader.yearsExperience} yrs
                </span>
              </span>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-neutral-400" />
            </button>

            <div className="space-y-4 px-4 py-4">
              <div>
                <p className="text-sm font-medium leading-snug">{job.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin aria-hidden="true" className="size-3" />
                    {job.location}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{job.phase}</span>
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                  {pluralize(questions.length, "question")} asked
                </p>
                {latest && (
                  <p className="mt-1.5 line-clamp-3 border-l-2 border-neutral-200 pl-2.5 text-xs leading-relaxed text-neutral-600">
                    &ldquo;{latest.text}&rdquo;
                  </p>
                )}
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                  Training this week
                </p>
                <ul className="mt-2 space-y-2">
                  {thisWeek.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/library/${m.id}`}
                        className="flex items-start gap-2 rounded text-xs leading-snug font-medium underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        <FormatIcon format={m.format} className="mt-px size-3.5 shrink-0 text-neutral-500" />
                        {m.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <EmailAction leader={leader} sentAt={sentAtByLeader[leader.id]} onEmail={onEmail} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
