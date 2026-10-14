import { ArrowLeft, ArrowRight, Check, FileText, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/AssignmentStatus";
import { FormatIcon } from "@/components/FormatIcon";
import { CopyPathButton } from "@/components/library/CopyPathButton";
import { ModuleCard } from "@/components/library/ModuleCard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container, Eyebrow } from "@/components/ui/Headings";
import { modules } from "@/data/modules";
import type { TrainingModule } from "@/data/types";
import { formatLongDate, formatMinutes, formatShortDate } from "@/lib/format";
import {
  findModule,
  getAssignmentsForModule,
  getJob,
  getLeader,
  getStoragePath,
  getVeteran,
} from "@/lib/queries";

// The module lookup must run before streaming starts so unknown ids get a real 404 status:
// `instant = false` allows reading params outside Suspense, and `ensureStatic = "navigation"`
// makes unlisted ids wait for the full render instead of serving the App Shell with a 200.
export const instant = false;
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return modules.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/library/[id]">): Promise<Metadata> {
  const { id } = await params;
  const trainingModule = findModule(id);
  return trainingModule ? { title: trainingModule.title, description: trainingModule.summary } : { title: "Module not found" };
}

const STATUS_ORDER = { "this-week": 0, scheduled: 1, completed: 2 } as const;

export default async function ModulePage({ params }: PageProps<"/library/[id]">) {
  const { id } = await params;
  const trainingModule = findModule(id);
  if (!trainingModule) notFound();

  const veteran = getVeteran(trainingModule.sourceVeteranId);
  const storagePath = getStoragePath(trainingModule);
  const assigned = getAssignmentsForModule(trainingModule.id).sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.weekOf.localeCompare(b.weekOf),
  );
  const related = modules
    .filter((m) => m.category === trainingModule.category && m.id !== trainingModule.id)
    .slice(0, 3);

  return (
    <>
      <div className="border-b border-neutral-200">
        <Container className="py-10 lg:py-12">
          <BackToLibrary />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="solid">
              <FormatIcon format={trainingModule.format} />
              {trainingModule.format}
            </Badge>
            <Badge>{trainingModule.category}</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {trainingModule.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-pretty text-neutral-600">
            {trainingModule.summary}
          </p>
          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-6 text-sm sm:grid-cols-4">
            <Meta label="Duration" value={formatMinutes(trainingModule.durationMinutes)} />
            <Meta label="Source" value={veteran.name} />
            <Meta label="Version" value={trainingModule.version} />
            <Meta label="Updated" value={formatLongDate(trainingModule.updatedAt)} />
          </dl>
        </Container>
      </div>

      <Container className="grid grid-cols-[minmax(0,1fr)] gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-12">
        <div className="min-w-0 space-y-10">
          <MediaPreview trainingModule={trainingModule} />

          <section aria-labelledby="objectives-heading">
            <h2 id="objectives-heading" className="text-lg font-semibold tracking-tight">
              What leaders will learn
            </h2>
            <ul className="mt-4 space-y-3">
              {trainingModule.objectives.map((objective) => (
                <li key={objective} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                  </span>
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="outline-heading">
            <h2 id="outline-heading" className="text-lg font-semibold tracking-tight">
              Outline
            </h2>
            <ol className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200">
              {trainingModule.outline.map((section, i) => (
                <li key={section.title} className="flex items-center gap-4 px-4 py-3 text-sm">
                  <span className="w-6 font-mono text-xs text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{section.title}</span>
                  <span className="text-xs tabular-nums text-neutral-500">{section.minutes} min</span>
                </li>
              ))}
              <li className="flex items-center justify-between bg-neutral-50 px-4 py-3 text-sm font-medium">
                <span>Total</span>
                <span className="tabular-nums">{formatMinutes(trainingModule.durationMinutes)}</span>
              </li>
            </ol>
          </section>

          <div className="flex flex-wrap gap-1.5">
            {trainingModule.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <aside className="min-w-0 space-y-4">
          <Card className="p-5">
            <Eyebrow>Storage location</Eyebrow>
            <ol className="mt-3 space-y-1 font-mono text-xs text-neutral-600">
              {storagePath.map((segment, i) => (
                <li
                  key={segment}
                  style={{ paddingLeft: `${i * 0.75}rem` }}
                  className={i === storagePath.length - 1 ? "font-semibold break-all text-neutral-950" : ""}
                >
                  {i > 0 && <span className="text-neutral-300">└ </span>}
                  {segment}
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <CopyPathButton path={storagePath.join(" / ")} />
            </div>
          </Card>

          <Card className="p-5">
            <Eyebrow>Captured from</Eyebrow>
            <div className="mt-3 flex items-center gap-3">
              <Avatar name={veteran.name} inverted />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{veteran.name}</p>
                <p className="text-xs text-neutral-500">
                  {veteran.title} · {veteran.yearsInField} yrs
                </p>
              </div>
            </div>
            <Link
              href={`/veterans#${veteran.id}`}
              className="mt-4 inline-flex items-center gap-1 rounded text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              View in Veteran Hub
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between px-5 pt-5">
              <Eyebrow>Mapped to leaders</Eyebrow>
              <span className="text-xs tabular-nums text-neutral-500">{assigned.length}</span>
            </div>
            <ul className="mt-3 divide-y divide-neutral-100">
              {assigned.map((assignment) => {
                const leader = getLeader(assignment.leaderId);
                return (
                  <li key={leader.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar name={leader.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{leader.name}</p>
                      <p className="truncate text-xs text-neutral-500">
                        {getJob(leader.jobId).name} · Week of {formatShortDate(assignment.weekOf)}
                      </p>
                    </div>
                    <StatusBadge status={assignment.status} />
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-neutral-100 px-5 py-3">
              <Link
                href="/leaders#content-map"
                className="inline-flex items-center gap-1 rounded text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Open content map
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>
          </Card>
        </aside>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-neutral-200">
          <Container className="py-12">
            <h2 id="related-heading" className="mb-6 text-lg font-semibold tracking-tight">
              More in {trainingModule.category}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((m) => (
                <li key={m.id}>
                  <ModuleCard trainingModule={m} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}

function BackToLibrary() {
  return (
    <Link
      href="/library"
      className="inline-flex items-center gap-1.5 rounded text-sm text-neutral-500 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      Training library
    </Link>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function MediaPreview({ trainingModule }: { trainingModule: TrainingModule }) {
  const isMedia = trainingModule.format !== "PDF Guide" && trainingModule.format !== "Checklist";

  if (isMedia) {
    return (
      <figure className="overflow-hidden rounded-lg border border-neutral-950 bg-neutral-950 text-white">
        <div className="relative flex aspect-video flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.08),transparent_60%)]">
          <span className="flex size-16 items-center justify-center rounded-full bg-white text-neutral-950">
            <Play aria-hidden="true" className="ml-1 size-6 fill-current" />
          </span>
          <span className="px-6 text-center text-sm text-neutral-400">
            Playback opens from SharePoint in the live platform
          </span>
          <span className="absolute right-20 bottom-4 left-4 truncate font-mono text-xs text-neutral-500">
            {trainingModule.fileName}
          </span>
          <span className="absolute right-4 bottom-4 font-mono text-xs text-neutral-500">
            {formatMinutes(trainingModule.durationMinutes)}
          </span>
        </div>
      </figure>
    );
  }

  return (
    <figure className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-10">
      <div className="w-full max-w-sm rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <FileText aria-hidden="true" className="size-4" />
          {trainingModule.fileName}
        </div>
        <p className="mt-4 text-sm font-semibold">{trainingModule.title}</p>
        <ul className="mt-4 space-y-2.5">
          {trainingModule.outline.map((section) => (
            <li key={section.title} className="flex items-center gap-2.5 text-xs text-neutral-600">
              <span className="size-3.5 shrink-0 rounded-sm border border-neutral-400" />
              {section.title}
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-1.5">
          <div className="h-1.5 w-full rounded bg-neutral-100" />
          <div className="h-1.5 w-4/5 rounded bg-neutral-100" />
          <div className="h-1.5 w-3/5 rounded bg-neutral-100" />
        </div>
      </div>
    </figure>
  );
}
