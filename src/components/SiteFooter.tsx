import { ORG } from "@/data/org";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-neutral-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          {ORG.programName} · {ORG.company}
        </p>
        <p>Demo environment. All people, projects, and contact details are fictional.</p>
      </div>
    </footer>
  );
}
