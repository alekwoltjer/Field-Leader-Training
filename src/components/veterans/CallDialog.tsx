"use client";

import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { Veteran, WeeklyQuestion } from "@/data/types";
import { cn } from "@/lib/cn";
import { firstName, formatTimer } from "@/lib/format";
import { getLeader } from "@/lib/queries";

type Phase = "dialing" | "connected" | "ended";

const RING_DURATION_MS = 2200;

export interface CallResult {
  veteranId: string;
  coveredQuestionIds: string[];
  durationSeconds: number;
}

export function CallDialog({
  veteran,
  questions,
  onComplete,
  onClose,
}: {
  veteran: Veteran;
  /** Open questions routed to this veteran for the current week. */
  questions: WeeklyQuestion[];
  onComplete: (result: CallResult) => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("dialing");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [covered, setCovered] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    if (phase !== "dialing") return;
    const timer = window.setTimeout(() => setPhase("connected"), RING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "connected") return;
    const interval = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [phase]);

  function toggleCovered(id: string) {
    setCovered((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function endCall() {
    setPhase("ended");
    onComplete({
      veteranId: veteran.id,
      coveredQuestionIds: [...covered],
      durationSeconds: seconds,
    });
  }

  const statusLine =
    phase === "dialing" ? "Calling…" : phase === "connected" ? `Connected · ${formatTimer(seconds)}` : `Call ended · ${formatTimer(seconds)}`;

  const footer =
    phase === "dialing" ? (
      <Button variant="secondary" onClick={onClose}>
        <PhoneOff />
        Cancel call
      </Button>
    ) : phase === "connected" ? (
      <>
        <Button variant="secondary" onClick={() => setMuted((m) => !m)} aria-pressed={muted}>
          {muted ? <MicOff /> : <Mic />}
          {muted ? "Unmute" : "Mute"}
        </Button>
        <Button onClick={endCall}>
          <PhoneOff />
          End call
        </Button>
      </>
    ) : (
      <Button onClick={onClose}>Done</Button>
    );

  return (
    <Dialog
      open
      onClose={onClose}
      eyebrow="Click to call"
      title={phase === "ended" ? `Call with ${veteran.name}` : `Calling ${veteran.name}`}
      description="Demo only. No real call is placed."
      footer={footer}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative my-2">
          {phase === "dialing" && (
            <>
              <span className="absolute inset-0 animate-ring rounded-full bg-neutral-950" />
              <span className="absolute inset-0 animate-ring rounded-full bg-neutral-950 [animation-delay:0.8s]" />
            </>
          )}
          <Avatar name={veteran.name} size="xl" inverted className="relative" />
        </div>
        <p className="mt-4 text-lg font-semibold tracking-tight">{veteran.name}</p>
        <p className="text-sm text-neutral-500">{veteran.title}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-sm">
          <Phone aria-hidden="true" className="size-3.5" />
          {veteran.phone}
        </p>
        <p
          role="status"
          className={cn(
            "mt-4 rounded-full px-3 py-1 text-xs font-medium tabular-nums",
            phase === "connected" ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-700",
          )}
        >
          {statusLine}
          {phase === "connected" && muted && " · Muted"}
        </p>
      </div>

      <div className="mt-6 border-t border-neutral-200 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold">Questions to cover this week</h3>
          {questions.length > 0 && (
            <span className="text-xs tabular-nums text-neutral-500">
              {covered.size}/{questions.length} covered
            </span>
          )}
        </div>
        {questions.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            No open questions are routed to {firstName(veteran.name)} this week. Use the call to check in
            on mentees.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {questions.map((q) => {
              const leader = getLeader(q.askedByLeaderId);
              const checked = covered.has(q.id);
              return (
                <li key={q.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-md border p-3 text-left transition-colors has-focus-visible:outline-2 has-focus-visible:outline-black",
                      checked ? "border-neutral-950 bg-neutral-50" : "border-neutral-200 hover:border-neutral-400",
                      phase === "ended" && "pointer-events-none opacity-70",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={phase === "ended"}
                      onChange={() => toggleCovered(q.id)}
                      className="mt-0.5 size-4 shrink-0 accent-neutral-950"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm leading-snug">{q.text}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                        From {leader.name}
                        <Badge variant="muted">{q.category}</Badge>
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        {phase === "ended" && (
          <p className="mt-4 rounded-md bg-neutral-950 px-4 py-3 text-sm text-white">
            Call logged. {covered.size > 0 ? `${covered.size} ${covered.size === 1 ? "question" : "questions"} marked answered.` : "No questions were marked answered."}
          </p>
        )}
      </div>
    </Dialog>
  );
}
