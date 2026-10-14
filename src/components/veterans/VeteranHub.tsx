"use client";

import { useRef, useState } from "react";
import { Container, SectionHeading } from "@/components/ui/Headings";
import { useToast } from "@/components/ui/Toast";
import { CURRENT_WEEK } from "@/data/org";
import type { QuestionStatus, Veteran, WeeklyQuestion } from "@/data/types";
import { veterans } from "@/data/veterans";
import { formatLongDate, formatTimer, pluralize } from "@/lib/format";
import {
  getCallNotesForVeteran,
  getModulesBySourceVeteran,
  getQuestionsForWeek,
  getVeteran,
} from "@/lib/queries";
import { CallDialog, type CallResult } from "./CallDialog";
import { CallNotesArchive, type NotesFilter } from "./CallNotesArchive";
import { KeyThemes } from "./KeyThemes";
import { VeteranCard } from "./VeteranCard";
import { WeeklyQuestions } from "./WeeklyQuestions";

const weekQuestions = getQuestionsForWeek(CURRENT_WEEK);

interface ActiveCall {
  session: number;
  veteran: Veteran;
  questions: WeeklyQuestion[];
  result?: CallResult;
}

export function VeteranHub() {
  const toast = useToast();
  const sessionCounter = useRef(0);
  const announcedSessions = useRef(new Set<number>());
  const [statusById, setStatusById] = useState<Record<string, QuestionStatus>>(() =>
    Object.fromEntries(weekQuestions.map((q) => [q.id, q.status])),
  );
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [notesFilter, setNotesFilter] = useState<NotesFilter>("all");

  const openQuestionsFor = (veteranId: string) =>
    weekQuestions.filter((q) => q.routedToVeteranId === veteranId && statusById[q.id] === "open");

  function startCall(veteranId: string) {
    sessionCounter.current += 1;
    setActiveCall({
      session: sessionCounter.current,
      veteran: getVeteran(veteranId),
      questions: openQuestionsFor(veteranId),
    });
  }

  function completeCall(result: CallResult) {
    if (result.coveredQuestionIds.length > 0) {
      setStatusById((current) => {
        const next = { ...current };
        for (const id of result.coveredQuestionIds) next[id] = "answered";
        return next;
      });
    }
    setActiveCall((current) => (current ? { ...current, result } : current));
  }

  /** Toasts render below the modal's top layer, so confirm the call once the dialog closes. */
  function closeCall() {
    const call = activeCall;
    setActiveCall(null);
    if (!call?.result || announcedSessions.current.has(call.session)) return;
    announcedSessions.current.add(call.session);
    const { durationSeconds, coveredQuestionIds } = call.result;
    toast({
      title: `Call with ${call.veteran.name} logged`,
      description: `${formatTimer(durationSeconds)} · ${pluralize(coveredQuestionIds.length, "question")} answered`,
    });
  }

  function toggleQuestion(id: string) {
    setStatusById((current) => ({
      ...current,
      [id]: current[id] === "answered" ? "open" : "answered",
    }));
  }

  function viewNotes(veteranId: string) {
    setNotesFilter(veteranId);
    document.getElementById("call-notes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <SubNav />

      <section aria-labelledby="directory-heading" className="scroll-mt-28" id="directory">
        <Container className="py-12">
          <SectionHeading
            id="directory-heading"
            eyebrow="Directory"
            title="Veteran leaders"
            description="Contact details, background, and availability for each veteran. Click to call starts a call and pulls up this week's questions for them."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {veterans.map((veteran) => (
              <VeteranCard
                key={veteran.id}
                veteran={veteran}
                openQuestions={openQuestionsFor(veteran.id).length}
                callsLogged={getCallNotesForVeteran(veteran.id).length}
                modulesAuthored={getModulesBySourceVeteran(veteran.id).length}
                onCall={() => startCall(veteran.id)}
                onViewNotes={() => viewNotes(veteran.id)}
              />
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="questions-heading"
        id="questions"
        className="scroll-mt-28 border-y border-neutral-200 bg-neutral-50"
      >
        <Container className="py-12">
          <SectionHeading
            id="questions-heading"
            eyebrow={`Week of ${formatLongDate(CURRENT_WEEK)}`}
            title="Questions for the week"
            description="Questions submitted by upcoming leaders, routed to the veteran best placed to answer them. Mark them answered as they're covered on calls."
          />
          <WeeklyQuestions
            questions={weekQuestions}
            statusById={statusById}
            onToggle={toggleQuestion}
            onCall={startCall}
          />
        </Container>
      </section>

      <section aria-labelledby="themes-heading" id="themes" className="scroll-mt-28">
        <Container className="py-12">
          <SectionHeading
            id="themes-heading"
            eyebrow="Across all veterans"
            title="Key themes"
            description="Lessons that keep coming up across different veterans, ranked by how many calls they were raised on."
          />
          <KeyThemes />
        </Container>
      </section>

      <section
        aria-labelledby="notes-heading"
        id="call-notes"
        className="scroll-mt-28 border-t border-neutral-200"
      >
        <Container className="py-12">
          <SectionHeading
            id="notes-heading"
            eyebrow="Archive"
            title="Notes from past calls"
            description="Summaries, takeaways, and follow-ups from every veteran call, grouped by week."
          />
          <CallNotesArchive filter={notesFilter} onFilterChange={setNotesFilter} />
        </Container>
      </section>

      {activeCall && (
        <CallDialog
          key={activeCall.session}
          veteran={activeCall.veteran}
          questions={activeCall.questions}
          onComplete={completeCall}
          onClose={closeCall}
        />
      )}
    </>
  );
}

const SUBNAV = [
  { href: "#directory", label: "Directory" },
  { href: "#questions", label: "Questions this week" },
  { href: "#themes", label: "Key themes" },
  { href: "#call-notes", label: "Call notes" },
];

function SubNav() {
  return (
    <div className="border-b border-neutral-200">
      <Container>
        <nav aria-label="On this page" className="scrollbar-none flex gap-1 overflow-x-auto py-2">
          {SUBNAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-black"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
