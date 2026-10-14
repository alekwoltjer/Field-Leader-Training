"use client";

import { CalendarClock, Mail, NotebookText, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Veteran } from "@/data/types";
import { formatWeekdayDate, pluralize } from "@/lib/format";

export function VeteranCard({
  veteran,
  openQuestions,
  callsLogged,
  modulesAuthored,
  onCall,
  onViewNotes,
}: {
  veteran: Veteran;
  openQuestions: number;
  callsLogged: number;
  modulesAuthored: number;
  onCall: () => void;
  onViewNotes: () => void;
}) {
  return (
    <article
      id={veteran.id}
      aria-labelledby={`${veteran.id}-name`}
      className="row-span-5 grid scroll-mt-32 grid-rows-subgrid gap-0 rounded-lg border border-neutral-200 bg-white transition-colors target:border-neutral-950 target:ring-1 target:ring-neutral-950"
    >
      <div className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <Avatar name={veteran.name} size="lg" inverted />
          <div className="min-w-0">
            <h3 id={`${veteran.id}-name`} className="text-lg font-semibold leading-tight tracking-tight">
              {veteran.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">{veteran.title}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {veteran.yearsInField} years in the field · {veteran.location}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {veteran.specialties.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </div>

      <p className="px-6 pt-4 text-sm leading-relaxed text-neutral-700">{veteran.bio}</p>

      <div className="px-6 pt-5">
        <dl className="space-y-2 border-t border-neutral-100 pt-4 text-sm">
          <div className="flex items-center gap-3">
            <dt className="sr-only">Phone</dt>
            <Phone aria-hidden="true" className="size-3.5 shrink-0 text-neutral-400" />
            <dd className="font-mono text-[13px]">{veteran.phone}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="sr-only">Email</dt>
            <Mail aria-hidden="true" className="size-3.5 shrink-0 text-neutral-400" />
            <dd className="min-w-0 truncate font-mono text-[13px]">{veteran.email}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="sr-only">Availability</dt>
            <CalendarClock aria-hidden="true" className="size-3.5 shrink-0 text-neutral-400" />
            <dd className="text-[13px] text-neutral-600">{veteran.availability}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col px-6 pt-4 pb-6">
        <div className="flex-1 rounded-md bg-neutral-50 px-4 py-3">
          {veteran.nextCall ? (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                Next call · {formatWeekdayDate(veteran.nextCall.date)}, {veteran.nextCall.time}
              </p>
              <p className="mt-1 text-sm font-medium">{veteran.nextCall.topic}</p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">Next call</p>
              <p className="mt-1 text-sm text-neutral-600">Not scheduled yet</p>
            </>
          )}
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          {pluralize(callsLogged, "call")} logged · {pluralize(modulesAuthored, "module")} authored ·{" "}
          <span className={openQuestions > 0 ? "font-medium text-neutral-950" : undefined}>
            {pluralize(openQuestions, "open question")}
          </span>
        </p>
      </div>

      <div className="flex gap-2 border-t border-neutral-200 p-4">
        <Button onClick={onCall} className="flex-1">
          <Phone />
          Click to call
        </Button>
        <Button variant="secondary" onClick={onViewNotes} aria-label={`View call notes from ${veteran.name}`}>
          <NotebookText />
          Notes
        </Button>
      </div>
    </article>
  );
}
