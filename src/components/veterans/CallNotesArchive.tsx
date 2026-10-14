"use client";

import { Clock, Users } from "lucide-react";
import { AccordionItem } from "@/components/ui/Accordion";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { FilterChips } from "@/components/ui/FilterChips";
import { callNotes } from "@/data/callNotes";
import type { CallNote } from "@/data/types";
import { veterans } from "@/data/veterans";
import { firstName, formatLongDate, formatMinutes, formatWeekdayDate, pluralize } from "@/lib/format";
import { getCallNotesByWeek, getLeader, getPersonName, getTheme, getVeteran } from "@/lib/queries";

export type NotesFilter = string | "all";

export function CallNotesArchive({
  filter,
  onFilterChange,
}: {
  filter: NotesFilter;
  onFilterChange: (value: NotesFilter) => void;
}) {
  const filtered = filter === "all" ? callNotes : callNotes.filter((n) => n.veteranId === filter);
  const weeks = getCallNotesByWeek(filtered);
  const latestId = weeks[0]?.notes[0]?.id;

  return (
    <div>
      <FilterChips
        label="Filter call notes by veteran"
        value={filter}
        onChange={onFilterChange}
        className="mb-6"
        options={[
          { value: "all", label: "All veterans", count: callNotes.length },
          ...veterans.map((v) => ({
            value: v.id,
            label: v.name,
            count: callNotes.filter((n) => n.veteranId === v.id).length,
          })),
        ]}
      />

      {weeks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500">
          No calls logged with {getVeteran(filter).name} yet.
        </p>
      ) : (
        <div className="space-y-10">
          {weeks.map(({ weekOf, notes }) => (
            <section key={weekOf} aria-label={`Week of ${formatLongDate(weekOf)}`}>
              <div className="mb-3 flex items-baseline gap-3">
                <h3 className="text-sm font-semibold">Week of {formatLongDate(weekOf)}</h3>
                <span className="text-xs text-neutral-500">{pluralize(notes.length, "call")}</span>
              </div>
              <div className="space-y-2">
                {notes.map((note) => (
                  <CallNoteItem key={note.id} note={note} defaultOpen={note.id === latestId} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function CallNoteItem({ note, defaultOpen }: { note: CallNote; defaultOpen: boolean }) {
  const veteran = getVeteran(note.veteranId);
  const attendees = note.attendeeIds.map(getLeader);

  return (
    <AccordionItem
      defaultOpen={defaultOpen}
      summary={
        <div className="grid grid-cols-1 items-center gap-x-6 gap-y-2 sm:grid-cols-[7rem_minmax(0,1fr)_auto]">
          <span className="text-xs font-medium text-neutral-500">{formatWeekdayDate(note.date)}</span>
          <span className="flex min-w-0 items-center gap-3">
            <Avatar name={veteran.name} size="sm" inverted />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{note.topic}</span>
              <span className="block truncate text-xs text-neutral-500">with {veteran.name}</span>
            </span>
          </span>
          <span className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock aria-hidden="true" className="size-3.5" />
              {formatMinutes(note.durationMinutes)}
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Users aria-hidden="true" className="size-3.5" />
              {attendees.length}
            </span>
          </span>
        </div>
      }
    >
      <p className="max-w-3xl text-sm leading-relaxed text-neutral-700">{note.summary}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">Key takeaways</h4>
          <ol className="mt-3 space-y-2.5">
            {note.takeaways.map((t, i) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-px font-mono text-xs text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">Follow-ups</h4>
          <ul className="mt-3 space-y-2.5">
            {note.followUps.map((f) => (
              <li key={f.text} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-1 size-3 shrink-0 rounded-sm border border-neutral-400" aria-hidden="true" />
                <span>
                  {f.text}
                  <span className="text-neutral-500"> · {firstName(getPersonName(f.ownerId))}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">
          <span className="font-medium text-neutral-800">Attendees:</span>{" "}
          {attendees.map((a) => a.name).join(", ")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {note.themeIds.map((id) => (
            <Badge key={id} variant="muted">
              {getTheme(id).title}
            </Badge>
          ))}
        </div>
      </div>
    </AccordionItem>
  );
}
