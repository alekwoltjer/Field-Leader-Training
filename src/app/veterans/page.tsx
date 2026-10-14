import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/Headings";
import { VeteranHub } from "@/components/veterans/VeteranHub";
import { totals } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Veteran Experience Hub",
  description: "Veteran field leaders, this week's questions, key themes, and notes from past calls.",
};

export default function VeteransPage() {
  return (
    <>
      <PageHeader
        title="Veteran Experience Hub"
        description={`${totals.veterans} veteran leaders with ${totals.veteranYears} combined years in the field. Reach them directly, see what upcoming leaders want to ask them this week, and review what they've already shared.`}
      />
      <VeteranHub />
    </>
  );
}
