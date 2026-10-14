"use client";

import { Check, Phone, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FilterChips } from "@/components/ui/FilterChips";
import { veterans } from "@/data/veterans";
import type { QuestionStatus, WeeklyQuestion } from "@/data/types";
import { cn } from "@/lib/cn";
import { firstName } from "@/lib/format";
import { getJob, getLeader } from "@/lib/queries";

type Filter = QuestionStatus | "all";

export function WeeklyQuestions({
  questions,
  statusById,
  onToggle,
  onCall,
}: {
  questions: WeeklyQuestion[];
  statusById: Record<string, QuestionStatus>;
  onToggle: (id: string) => void;
  onCall: (veteranId: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const statusOf = (q: WeeklyQuestion) => statusById[q.id] ?? q.status;

  const openCount = questions.filter((q) => statusOf(q) === "open").length;
  const answeredCount = questions.length - openCount;
  const visible = questions.filter((q) => filter === "all" || statusOf(q) === filter);

  const groups = veterans
    .map((veteran) => ({
      veteran,
      items: visible.filter((q) => q.routedToVeteranId === veteran.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          label="Filter questions by status"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: questions.length },
            { value: "open", label: "Open", count: openCount },
            { value: "answered", label: "Answered", count: answeredCount },
          ]}
        />
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span>Answered this week</span>
          <span className="h-1.5 w-28 overflow-hidden rounded-full bg-neutral-200" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-neutral-950 transition-[width] duration-300"
              style={{ width: `${(answeredCount / Math.max(questions.length, 1)) * 100}%` }}
            />
          </span>
          <span className="tabular-nums text-neutral-950">
            {answeredCount}/{questions.length}
          </span>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500">
          No {filter === "all" ? "" : filter} questions this week.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {groups.map(({ veteran, items }) => (
            <section
              key={veteran.id}
              aria-label={`Questions for ${veteran.name}`}
              className="rounded-lg border border-neutral-200 bg-white"
            >
              <header className="flex items-center gap-3 border-b border-neutral-200 px-5 py-3">
                <Avatar name={veteran.name} size="sm" inverted />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">For {veteran.name}</p>
                  <p className="truncate text-xs text-neutral-500">{veteran.title}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => onCall(veteran.id)}>
                  <Phone />
                  Call {firstName(veteran.name)}
                </Button>
              </header>
              <ul className="divide-y divide-neutral-100">
                {items.map((q) => {
                  const leader = getLeader(q.askedByLeaderId);
                  const answered = statusOf(q) === "answered";
                  return (
                    <li key={q.id} className="px-5 py-4">
                      <p className={cn("text-sm leading-relaxed", answered && "text-neutral-500")}>
                        {q.text}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2 text-xs text-neutral-500">
                          <Avatar name={leader.name} size="xs" />
                          <span className="truncate">
                            <span className="font-medium text-neutral-800">{leader.name}</span> ·{" "}
                            {getJob(leader.jobId).name}
                          </span>
                          <Badge variant="muted" className="hidden sm:inline-flex">
                            {q.category}
                          </Badge>
                        </div>
                        {answered ? (
                          <div className="flex items-center gap-1">
                            <Badge variant="solid">
                              <Check aria-hidden="true" strokeWidth={3} />
                              Answered
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggle(q.id)}
                              aria-label={`Reopen question from ${leader.name}`}
                            >
                              <RotateCcw />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="secondary" size="sm" onClick={() => onToggle(q.id)}>
                            <Check />
                            Mark answered
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
