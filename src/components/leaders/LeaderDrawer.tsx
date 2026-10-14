"use client";

import { ArrowRight, Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { StatusMark, STATUS_LABEL } from "@/components/AssignmentStatus";
import { EmailAddress } from "@/components/EmailAddress";
import { FormatIcon } from "@/components/FormatIcon";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { AssignmentStatus, Leader } from "@/data/types";
import { formatLongDate, formatMinutes, formatShortDate } from "@/lib/format";
import {
  getAssignmentsForLeader,
  getJob,
  getModule,
  getQuestionsByLeader,
  getVeteran,
} from "@/lib/queries";

const GROUPS: AssignmentStatus[] = ["this-week", "scheduled", "completed"];

export function LeaderDrawer({
  leader,
  sentAt,
  onEmail,
  onClose,
}: {
  leader: Leader;
  sentAt?: string;
  onEmail: () => void;
  onClose: () => void;
}) {
  const job = getJob(leader.jobId);
  const mentor = getVeteran(leader.mentorId);
  const questions = getQuestionsByLeader(leader.id);

  return (
    <Dialog
      open
      placement="right"
      onClose={onClose}
      eyebrow={leader.role}
      title={leader.name}
      description={`${job.name} · ${leader.yearsExperience} years experience`}
      footer={
        <>
          {sentAt && (
            <span className="w-full text-xs text-neutral-500 sm:mr-auto sm:w-auto">
              Training emailed today at {sentAt}
            </span>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEmail}>
            <Send />
            {sentAt ? "Resend training" : "Email training"}
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Avatar name={leader.name} size="lg" />
          <dl className="min-w-0 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Phone</dt>
              <Phone aria-hidden="true" className="size-3.5 text-neutral-400" />
              <dd className="font-mono text-[13px]">{leader.phone}</dd>
            </div>
            <div className="flex items-start gap-2">
              <dt className="sr-only">Email</dt>
              <Mail aria-hidden="true" className="mt-[3px] size-3.5 shrink-0 text-neutral-400" />
              <dd className="min-w-0 font-mono text-[13px]">
                <EmailAddress email={leader.email} />
              </dd>
            </div>
            <div className="text-xs text-neutral-500">
              <dt className="inline">Joined program </dt>
              <dd className="inline">{formatLongDate(leader.joinedProgram)}</dd>
            </div>
          </dl>
        </div>

        <DrawerSection title="Current job">
          <div className="rounded-md border border-neutral-200 p-4">
            <p className="font-medium">{job.name}</p>
            <p className="mt-0.5 text-sm text-neutral-600">{job.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden="true" className="size-3" />
                {job.location}
              </span>
              <span>{job.contractValue}</span>
              <span>{job.phase}</span>
            </div>
          </div>
        </DrawerSection>

        <DrawerSection title="Mentor">
          <div className="flex items-center gap-3">
            <Avatar name={mentor.name} size="sm" inverted />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{mentor.name}</p>
              <p className="truncate text-xs text-neutral-500">{mentor.title}</p>
            </div>
            <Link
              href={`/veterans#${mentor.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded text-xs font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Veteran Hub
              <ArrowRight aria-hidden="true" className="size-3" />
            </Link>
          </div>
        </DrawerSection>

        <DrawerSection title="Background">
          <p className="text-sm leading-relaxed text-neutral-700">{leader.background}</p>
          <p className="mt-3 rounded-md bg-neutral-50 px-4 py-3 text-sm">
            <span className="font-medium">Development goal: </span>
            {leader.developmentGoal}
          </p>
        </DrawerSection>

        <DrawerSection title="Responsibilities">
          <ul className="space-y-1.5 text-sm">
            {leader.responsibilities.map((r) => (
              <li key={r} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-neutral-950" />
                {r}
              </li>
            ))}
          </ul>
        </DrawerSection>

        <DrawerSection title={`Questions asked (${questions.length})`}>
          <ul className="space-y-3">
            {questions.map((q) => (
              <li key={q.id} className="rounded-md border border-neutral-200 p-3">
                <p className="text-sm leading-relaxed">{q.text}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span>Week of {formatShortDate(q.weekOf)}</span>
                  <span>·</span>
                  <span>For {getVeteran(q.routedToVeteranId).name}</span>
                  <Badge variant={q.status === "answered" ? "muted" : "solid"} className="ml-auto">
                    {q.status === "answered" ? "Answered" : "Open"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </DrawerSection>

        <DrawerSection title="Training">
          <div className="space-y-5">
            {GROUPS.map((status) => {
              const items = getAssignmentsForLeader(leader.id, status);
              if (items.length === 0) return null;
              return (
                <div key={status}>
                  <p className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-600">
                    <StatusMark status={status} size="sm" />
                    {STATUS_LABEL[status]}
                  </p>
                  <ul className="divide-y divide-neutral-100 rounded-md border border-neutral-200">
                    {items.map((a) => {
                      const m = getModule(a.moduleId);
                      return (
                        <li key={a.moduleId}>
                          <Link
                            href={`/library/${m.id}`}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
                          >
                            <FormatIcon format={m.format} className="size-4 shrink-0 text-neutral-500" />
                            <span className="min-w-0 flex-1 truncate">{m.title}</span>
                            <span className="shrink-0 text-xs tabular-nums text-neutral-500">
                              {status === "this-week" ? formatMinutes(m.durationMinutes) : `Wk of ${formatShortDate(a.weekOf)}`}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </DrawerSection>
      </div>
    </Dialog>
  );
}

function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">{title}</h3>
      {children}
    </section>
  );
}
