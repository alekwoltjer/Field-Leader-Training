"use client";

import { Loader2, Send } from "lucide-react";
import { useEffect, useEffectEvent, useId, useState, type ReactNode } from "react";
import { FormatIcon } from "@/components/FormatIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { CURRENT_WEEK, ORG } from "@/data/org";
import type { Leader } from "@/data/types";
import { cn } from "@/lib/cn";
import { firstName, formatMinutes, formatShortDate, pluralize } from "@/lib/format";
import {
  getAssignmentsForLeader,
  getModule,
  getQuestionsByLeader,
  getVeteran,
} from "@/lib/queries";

const SEND_DELAY_MS = 900;

export interface EmailResult {
  leaderId: string;
  moduleIds: string[];
  ccMentor: boolean;
}

export function EmailTrainingDialog({
  leader,
  onSent,
  onClose,
}: {
  leader: Leader;
  onSent: (result: EmailResult) => void;
  onClose: () => void;
}) {
  const mentor = getVeteran(leader.mentorId);
  const candidates = getAssignmentsForLeader(leader.id).filter((a) => a.status !== "completed");
  const latestQuestion = getQuestionsByLeader(leader.id)[0];

  const [selected, setSelected] = useState<ReadonlySet<string>>(
    () => new Set(candidates.filter((a) => a.status === "this-week").map((a) => a.moduleId)),
  );
  const [ccMentor, setCcMentor] = useState(true);
  const [customSubject, setCustomSubject] = useState<string | null>(null);
  const [note, setNote] = useState(
    `Hi ${firstName(leader.name)},\n\nHere is your field training for this week. Work through it before your next check-in with ${firstName(mentor.name)}, and bring any questions to the call.`,
  );
  const [sending, setSending] = useState(false);
  const subjectId = useId();
  const noteId = useId();

  const selectedModules = candidates.filter((a) => selected.has(a.moduleId)).map((a) => getModule(a.moduleId));
  const defaultSubject = `Your field training for the week of ${formatShortDate(CURRENT_WEEK)}: ${pluralize(selectedModules.length, "module")}`;
  const subject = customSubject ?? defaultSubject;
  const canSend = selectedModules.length > 0 && subject.trim().length > 0 && !sending;

  const deliver = useEffectEvent(() => {
    onSent({
      leaderId: leader.id,
      moduleIds: selectedModules.map((m) => m.id),
      ccMentor,
    });
  });

  useEffect(() => {
    if (!sending) return;
    const timer = window.setTimeout(deliver, SEND_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [sending]);

  function toggle(moduleId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      eyebrow="Email training to leader"
      title={`Send this week's training to ${leader.name}`}
      description="Demo only. No email is actually sent."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={() => setSending(true)} disabled={!canSend}>
            {sending ? <Loader2 className="animate-spin" /> : <Send />}
            {sending ? "Sending…" : "Send email"}
          </Button>
        </>
      }
    >
      <fieldset disabled={sending} className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <dl className="divide-y divide-neutral-100 rounded-md border border-neutral-200 text-sm">
            <Row label="From">
              {ORG.programName}
              <span className="block text-neutral-500 [overflow-wrap:anywhere]">{ORG.programEmail}</span>
            </Row>
            <Row label="To">
              {leader.name}
              <span className="block text-neutral-500 [overflow-wrap:anywhere]">{leader.email}</span>
            </Row>
            <Row label="Cc">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={ccMentor}
                  onChange={(e) => setCcMentor(e.target.checked)}
                  className="size-4 accent-neutral-950"
                />
                Mentor: {mentor.name}
              </label>
            </Row>
          </dl>

          <div>
            <label htmlFor={subjectId} className="text-xs font-medium text-neutral-600">
              Subject
            </label>
            <input
              id={subjectId}
              value={subject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-neutral-950 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-neutral-600">Modules to include</p>
            <ul className="mt-1.5 space-y-2">
              {candidates.map((a) => {
                const trainingModule = getModule(a.moduleId);
                const checked = selected.has(a.moduleId);
                return (
                  <li key={a.moduleId}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-black",
                        checked ? "border-neutral-950" : "border-neutral-200 hover:border-neutral-400",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(a.moduleId)}
                        className="mt-0.5 size-4 shrink-0 accent-neutral-950"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-snug">{trainingModule.title}</span>
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                          <FormatIcon format={trainingModule.format} className="size-3.5" />
                          {trainingModule.format} · {formatMinutes(trainingModule.durationMinutes)}
                        </span>
                      </span>
                      <Badge variant={a.status === "this-week" ? "solid" : "outline"}>
                        {a.status === "this-week" ? "This week" : `Wk of ${formatShortDate(a.weekOf)}`}
                      </Badge>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <label htmlFor={noteId} className="text-xs font-medium text-neutral-600">
              Personal note
            </label>
            <textarea
              id={noteId}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              className="mt-1.5 w-full resize-y rounded-md border border-neutral-300 px-3 py-2 text-sm leading-relaxed focus:border-neutral-950 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-600">Preview</p>
          <div className="mt-1.5 rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <article className="rounded-md border border-neutral-200 bg-white p-5 text-sm shadow-sm">
              <p className="font-semibold leading-snug">{subject || "(No subject)"}</p>
              <p className="mt-1 text-xs text-neutral-500">
                To {leader.email}
                {ccMentor && ` · Cc ${mentor.email}`}
              </p>
              <hr className="my-4 border-neutral-100" />
              <p className="whitespace-pre-line leading-relaxed text-neutral-800">{note}</p>
              {selectedModules.length > 0 ? (
                <ol className="mt-4 space-y-2">
                  {selectedModules.map((m, i) => (
                    <li key={m.id} className="flex gap-3 rounded-md border border-neutral-200 p-3">
                      <span className="font-mono text-xs text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="block font-medium leading-snug">{m.title}</span>
                        <span className="mt-0.5 block text-xs text-neutral-500">
                          {m.format} · {formatMinutes(m.durationMinutes)} · from {getVeteran(m.sourceVeteranId).name}
                        </span>
                        <span className="mt-1 block text-xs font-medium underline underline-offset-2">
                          Open in the training library
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 rounded-md border border-dashed border-neutral-300 p-3 text-xs text-neutral-500">
                  Select at least one module to include.
                </p>
              )}
              {latestQuestion && (
                <p className="mt-4 rounded-md bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">
                  <span className="font-medium text-neutral-900">Your latest question:</span> &ldquo;{latestQuestion.text}&rdquo;{" "}
                  {latestQuestion.status === "answered" ? "has been answered by" : "is routed to"}{" "}
                  {getVeteran(latestQuestion.routedToVeteranId).name}.
                </p>
              )}
              <p className="mt-4 text-neutral-800">
                Thanks,
                <br />
                {ORG.programName} team
              </p>
            </article>
          </div>
        </div>
      </fieldset>
    </Dialog>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 px-3 py-2.5">
      <dt className="w-10 shrink-0 text-xs font-medium text-neutral-500">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}
