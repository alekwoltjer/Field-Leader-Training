"use client";

import { useState } from "react";
import { Container, SectionHeading } from "@/components/ui/Headings";
import { useToast } from "@/components/ui/Toast";
import { assignments } from "@/data/assignments";
import { leaders } from "@/data/leaders";
import { CURRENT_WEEK } from "@/data/org";
import type { Leader } from "@/data/types";
import { formatLongDate, pluralize } from "@/lib/format";
import { getLeader, getQuestionsForWeek, getVeteran, totals } from "@/lib/queries";
import { ContentMatrix } from "./ContentMatrix";
import { EmailTrainingDialog, type EmailResult } from "./EmailTrainingDialog";
import { LeaderDrawer } from "./LeaderDrawer";
import { RosterCards } from "./RosterCards";
import { RosterTable } from "./RosterTable";

const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

const modulesThisWeek = assignments.filter((a) => a.status === "this-week").length;
const openQuestions = getQuestionsForWeek(CURRENT_WEEK).filter((q) => q.status === "open").length;

export function LeadersView() {
  const toast = useToast();
  const [sentAtByLeader, setSentAtByLeader] = useState<Record<string, string>>({});
  const [drawerLeader, setDrawerLeader] = useState<Leader | null>(null);
  const [emailLeader, setEmailLeader] = useState<Leader | null>(null);

  const sentCount = Object.keys(sentAtByLeader).length;

  function openEmail(leader: Leader) {
    setDrawerLeader(null);
    setEmailLeader(leader);
  }

  function handleSent({ leaderId, moduleIds, ccMentor }: EmailResult) {
    const leader = getLeader(leaderId);
    setSentAtByLeader((current) => ({ ...current, [leaderId]: timeFormat.format(new Date()) }));
    setEmailLeader(null);
    toast({
      title: `Training emailed to ${leader.name}`,
      description: `${pluralize(moduleIds.length, "module")}${ccMentor ? ` · Cc ${getVeteran(leader.mentorId).name}` : ""}`,
    });
  }

  const stats = [
    { label: "Upcoming leaders", value: String(totals.leaders), detail: `Across ${totals.jobs} active jobs` },
    { label: "Modules assigned this week", value: String(modulesThisWeek), detail: `Week of ${formatLongDate(CURRENT_WEEK)}` },
    { label: "Open questions", value: String(openQuestions), detail: "Routed to veterans this week" },
    { label: "Training emails sent", value: `${sentCount}/${leaders.length}`, detail: sentCount === leaders.length ? "Everyone is set for the week" : `${leaders.length - sentCount} still to send` },
  ];

  return (
    <>
      <Container className="pt-10">
        <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-neutral-200 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={[
                "p-5",
                i % 2 === 0 ? "border-r border-neutral-200" : "",
                i < 2 ? "border-b border-neutral-200 lg:border-b-0" : "",
                i === 1 ? "lg:border-r" : "",
              ].join(" ")}
            >
              <dt className="text-xs font-medium text-neutral-600">{stat.label}</dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
              <dd className="mt-1 text-xs text-neutral-500">{stat.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <section aria-labelledby="roster-heading" id="roster" className="scroll-mt-28">
        <Container className="py-12">
          <SectionHeading
            id="roster-heading"
            eyebrow="Roster"
            title="Upcoming leaders"
            description="Where each leader is working, what they own, what they've asked, and the training lined up for them this week. Select a leader for their full profile."
          />
          <div className="md:hidden">
            <RosterCards sentAtByLeader={sentAtByLeader} onOpen={setDrawerLeader} onEmail={openEmail} />
          </div>
          <div className="hidden md:block">
            <RosterTable sentAtByLeader={sentAtByLeader} onOpen={setDrawerLeader} onEmail={openEmail} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="content-map-heading" id="content-map" className="scroll-mt-28 border-t border-neutral-200">
        <Container className="py-12">
          <SectionHeading
            id="content-map-heading"
            eyebrow="Content mapping"
            title="Which content is mapped to which leader"
            description="Every training module in the library against every upcoming leader. Columns are grouped by category; select a module to open it."
          />
          <ContentMatrix />
        </Container>
      </section>

      {drawerLeader && (
        <LeaderDrawer
          key={drawerLeader.id}
          leader={drawerLeader}
          sentAt={sentAtByLeader[drawerLeader.id]}
          onEmail={() => openEmail(drawerLeader)}
          onClose={() => setDrawerLeader(null)}
        />
      )}

      {emailLeader && (
        <EmailTrainingDialog
          key={emailLeader.id}
          leader={emailLeader}
          onSent={handleSent}
          onClose={() => setEmailLeader(null)}
        />
      )}
    </>
  );
}
