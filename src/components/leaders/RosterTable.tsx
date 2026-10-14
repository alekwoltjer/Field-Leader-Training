"use client";

import Link from "next/link";
import { EmailAddress } from "@/components/EmailAddress";
import { FormatIcon } from "@/components/FormatIcon";
import { Avatar } from "@/components/ui/Avatar";
import { leaders } from "@/data/leaders";
import type { Leader } from "@/data/types";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";
import { getAssignmentsForLeader, getJob, getModule, getQuestionsByLeader } from "@/lib/queries";
import { EmailAction } from "./EmailAction";

const COLUMNS = [
  { label: "Leader", width: "19%" },
  { label: "Current job", width: "13%" },
  { label: "Background", width: "16%" },
  { label: "Responsibilities", width: "16%" },
  { label: "Questions asked", width: "16%" },
  { label: "Training this week", width: "20%" },
];

const VISIBLE_RESPONSIBILITIES = 3;

export function RosterTable({
  sentAtByLeader,
  onOpen,
  onEmail,
}: {
  sentAtByLeader: Record<string, string>;
  onOpen: (leader: Leader) => void;
  onEmail: (leader: Leader) => void;
}) {
  return (
    <div className="relative overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full min-w-[1120px] table-fixed border-collapse text-left text-sm">
        <caption className="sr-only">Upcoming leaders roster</caption>
        <colgroup>
          {COLUMNS.map((c) => (
            <col key={c.label} style={{ width: c.width }} />
          ))}
        </colgroup>
        <thead className="border-b border-neutral-200 bg-neutral-50">
          <tr>
            {COLUMNS.map((c, i) => (
              <th
                key={c.label}
                scope="col"
                className={cn(
                  "px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] whitespace-nowrap text-neutral-500",
                  i === 0 && "sticky left-0 z-10 bg-neutral-50",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {leaders.map((leader) => {
            const job = getJob(leader.jobId);
            const questions = getQuestionsByLeader(leader.id);
            const latest = questions[0];
            const thisWeek = getAssignmentsForLeader(leader.id, "this-week").map((a) => getModule(a.moduleId));
            const extraResponsibilities = leader.responsibilities.length - VISIBLE_RESPONSIBILITIES;
            const sentAt = sentAtByLeader[leader.id];

            return (
              <tr
                key={leader.id}
                onClick={() => onOpen(leader)}
                className="group cursor-pointer align-top transition-colors hover:bg-neutral-50"
              >
                <td className="sticky left-0 z-10 bg-white px-4 py-4 transition-colors group-hover:bg-neutral-50">
                  <div className="flex items-start gap-3">
                    <Avatar name={leader.name} size="sm" />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(leader);
                        }}
                        className="rounded text-left font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        {leader.name}
                      </button>
                      <p className="mt-0.5 text-xs leading-snug text-neutral-700">{leader.role}</p>
                      <p className="mt-2 font-mono text-[11px] text-neutral-500">{leader.phone}</p>
                      <p className="font-mono text-[11px] text-neutral-500">
                        <EmailAddress email={leader.email} />
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium leading-snug">{job.name}</p>
                  <p className="mt-1 text-xs text-neutral-500">{job.location}</p>
                  <p className="mt-2 inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] leading-snug text-neutral-700">
                    {job.phase}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-xs font-medium">{leader.yearsExperience} yrs experience</p>
                  <p className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-neutral-600">{leader.background}</p>
                </td>
                <td className="px-4 py-4">
                  <ul className="space-y-1 text-xs leading-relaxed text-neutral-700">
                    {leader.responsibilities.slice(0, VISIBLE_RESPONSIBILITIES).map((r) => (
                      <li key={r} className="flex gap-2">
                        <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 rounded-full bg-neutral-400" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  {extraResponsibilities > 0 && (
                    <p className="mt-1 pl-3 text-xs text-neutral-500">+{extraResponsibilities} more</p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <p className="text-xs font-medium">{pluralize(questions.length, "question")}</p>
                  {latest && (
                    <p className="mt-1.5 line-clamp-4 border-l-2 border-neutral-200 pl-2.5 text-xs leading-relaxed text-neutral-600">
                      &ldquo;{latest.text}&rdquo;
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <ul className="space-y-2">
                    {thisWeek.map((m) => (
                      <li key={m.id}>
                        <Link
                          href={`/library/${m.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-start gap-2 rounded text-xs leading-snug font-medium underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                          <FormatIcon format={m.format} className="mt-px size-3.5 shrink-0 text-neutral-500" />
                          {m.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <EmailAction leader={leader} sentAt={sentAt} onEmail={onEmail} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
