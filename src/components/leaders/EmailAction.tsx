"use client";

import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Leader } from "@/data/types";

/** "Email training" button, or the sent badge plus "Resend" once the email has gone out. */
export function EmailAction({
  leader,
  sentAt,
  onEmail,
}: {
  leader: Leader;
  sentAt: string | undefined;
  onEmail: (leader: Leader) => void;
}) {
  if (sentAt) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-950 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white">
          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
          Sent {sentAt}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEmail(leader);
          }}
          aria-label={`Resend training to ${leader.name}`}
        >
          Resend
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onEmail(leader);
      }}
      aria-label={`Email training to ${leader.name}`}
    >
      <Send />
      Email training
    </Button>
  );
}
