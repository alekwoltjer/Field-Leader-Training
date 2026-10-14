import { AudioLines, FolderTree, Send } from "lucide-react";
import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/library/LibraryBrowser";
import { RepositoryTree } from "@/components/library/RepositoryTree";
import { Container, PageHeader, SectionHeading } from "@/components/ui/Headings";
import { ORG } from "@/data/org";
import { formatMinutes } from "@/lib/format";
import { totals } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Training Library",
  description: "Every training module from our veteran field leaders, searchable by topic, category, and format.",
};

const flow = [
  {
    icon: AudioLines,
    title: "Capture",
    body: "Veterans share what they know on weekly calls and recorded field walks.",
  },
  {
    icon: FolderTree,
    title: "Curate",
    body: "Each lesson is summarized, tagged, and filed by category in the shared library.",
  },
  {
    icon: Send,
    title: "Assign",
    body: "Modules are mapped to upcoming leaders and emailed to them every week.",
  },
];

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Content library"
        title="Training Library"
        description={`${totals.modules} modules and ${formatMinutes(totals.contentMinutes)} of content from our veteran superintendents. Filter by category or format, or search for a topic.`}
      />

      <section aria-labelledby="library-heading">
        <Container className="py-14">
          <SectionHeading
            id="library-heading"
            eyebrow="Training library"
            title="Browse every module"
            description="Each module shows the veteran it came from and how many leaders it is mapped to."
          />
          <LibraryBrowser />
        </Container>
      </section>

      <section aria-labelledby="storage-heading" className="border-t border-neutral-200 bg-neutral-50">
        <Container className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <SectionHeading
              id="storage-heading"
              eyebrow="Content repository"
              title="Where the training content lives"
              description={`Every module is stored in the ${ORG.repository.library} library on ${ORG.repository.system}, organized into one folder per category. Call recordings, guides, checklists, and field walk videos sit side by side, so anyone can find them in two clicks.`}
            />
            <ol className="space-y-px overflow-hidden rounded-lg border border-neutral-200">
              {flow.map((step, i) => (
                <li key={step.title} className="flex gap-4 bg-white p-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral-950 text-white">
                    <step.icon aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      <span className="mr-2 font-mono text-xs font-normal text-neutral-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <RepositoryTree />
        </Container>
      </section>
    </>
  );
}
