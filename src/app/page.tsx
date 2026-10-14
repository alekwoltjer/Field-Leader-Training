import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Headings";
import { CURRENT_WEEK, ORG } from "@/data/org";
import { formatMinutes, formatShortDate } from "@/lib/format";
import { getQuestionsForWeek, totals } from "@/lib/queries";

const openQuestions = getQuestionsForWeek(CURRENT_WEEK).filter((q) => q.status === "open").length;

const stats = [
  { value: totals.modules, label: "Training modules", detail: `${formatMinutes(totals.contentMinutes)} of content` },
  { value: totals.veterans, label: "Veteran leaders", detail: `${totals.veteranYears} combined years in the field` },
  { value: totals.leaders, label: "Upcoming leaders", detail: `Across ${totals.jobs} active jobs` },
  { value: totals.callsLogged, label: "Calls logged", detail: `Since ${formatShortDate(totals.firstCallWeek)}` },
];

const sections = [
  {
    href: "/veterans",
    number: "01",
    title: "Veteran Experience Hub",
    body: "Bios and contact details for our veteran leaders, this week's questions for them, notes from past calls, and the themes that keep coming up.",
    meta: `${totals.veterans} veterans · ${openQuestions} open questions this week`,
  },
  {
    href: "/leaders",
    number: "02",
    title: "Upcoming Leaders",
    body: "Who is coming up, what job they're on, what they're responsible for, what they've asked, and the training they're getting this week.",
    meta: `${totals.leaders} leaders · ${totals.jobs} active jobs`,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-neutral-200">
        <Container className="grid grid-cols-1 gap-12 py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:py-20">
          <div>
            <Eyebrow className="mb-4">
              {ORG.company} · Field Leadership Program
            </Eyebrow>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Decades of field experience, captured and passed on.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-neutral-600">
              One home for the training our veteran superintendents create, the calls where they
              share it, and the upcoming leaders who learn from it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/library" className={buttonStyles()}>
                Browse the library
              </Link>
              <Link href="/veterans" className={buttonStyles({ variant: "secondary" })}>
                Veteran Experience Hub
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-neutral-200">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  "p-6",
                  i % 2 === 0 ? "border-r border-neutral-200" : "",
                  i < 2 ? "border-b border-neutral-200" : "",
                ].join(" ")}
              >
                <dt className="text-sm font-medium text-neutral-950">{stat.label}</dt>
                <dd className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
                <dd className="mt-1 text-xs text-neutral-500">{stat.detail}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col justify-between gap-8 rounded-lg border border-neutral-200 p-6 transition-colors hover:border-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:p-8"
            >
              <div>
                <span className="font-mono text-xs text-neutral-400">{section.number}</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{section.title}</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-600">{section.body}</p>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-neutral-500">{section.meta}</span>
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 transition-colors group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white">
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
