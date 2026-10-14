import type { Metadata } from "next";
import { LeadersView } from "@/components/leaders/LeadersView";
import { PageHeader } from "@/components/ui/Headings";

export const metadata: Metadata = {
  title: "Upcoming Leaders",
  description: "Upcoming field leaders, their jobs, questions, responsibilities, and the training mapped to them.",
};

export default function LeadersPage() {
  return (
    <>
      <PageHeader
        title="Upcoming Leaders"
        description="The next generation of superintendents, foremen, and field engineers. See where they're working, what they're responsible for, and send each of them this week's training."
      />
      <LeadersView />
    </>
  );
}
