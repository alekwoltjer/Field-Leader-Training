import Link from "next/link";
import { STATUS_LABEL, StatusMark } from "@/components/AssignmentStatus";
import { Avatar } from "@/components/ui/Avatar";
import { leaders } from "@/data/leaders";
import { MODULE_CATEGORIES, type AssignmentStatus, type ModuleCategory } from "@/data/types";
import { cn } from "@/lib/cn";
import { getAssignment, getAssignmentsForLeader, getAssignmentsForModule, getModulesByCategory } from "@/lib/queries";

const groups = MODULE_CATEGORIES.map((category) => ({
  category,
  modules: getModulesByCategory(category),
})).filter((g) => g.modules.length > 0);

const columns = groups.flatMap((g) =>
  g.modules.map((m, i) => ({ module: m, startsGroup: i === 0 })),
);

const LEGEND: (AssignmentStatus | "none")[] = ["completed", "this-week", "scheduled", "none"];

const CATEGORY_LABEL: Record<ModuleCategory, string> = {
  Safety: "Safety",
  Scheduling: "Scheduling",
  "Crew Leadership": "Crew Leadership",
  "Quality & QA/QC": "Quality",
  "Client & Owner Relations": "Owner Relations",
  Preconstruction: "Precon",
  Closeout: "Closeout",
};

export function ContentMatrix() {
  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-600" aria-label="Legend">
        {LEGEND.map((status) => (
          <li key={status} className="flex items-center gap-2">
            <StatusMark status={status} />
            {status === "none" ? "Not mapped" : STATUS_LABEL[status]}
          </li>
        ))}
      </ul>

      <div className="relative overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-sm">
          <caption className="sr-only">Training modules mapped to each upcoming leader</caption>
          <colgroup>
            <col className="w-36 sm:w-56" />
            {columns.map(({ module: m }) => (
              <col key={m.id} />
            ))}
            <col className="w-28" />
          </colgroup>
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th scope="col" rowSpan={2} className="sticky left-0 z-10 border-r border-neutral-200 bg-neutral-50 px-3 py-3 sm:px-4 text-left align-bottom text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                Leader
              </th>
              {groups.map((g) => (
                <th
                  key={g.category}
                  scope="colgroup"
                  colSpan={g.modules.length}
                  title={g.category}
                  className="border-l border-neutral-200 px-1 py-2 text-center align-bottom text-[10px] leading-tight font-medium text-balance text-neutral-600 sm:text-[11px]"
                >
                  <span aria-hidden="true">{CATEGORY_LABEL[g.category]}</span>
                  <span className="sr-only">{g.category}</span>
                </th>
              ))}
              <th scope="col" rowSpan={2} className="border-l border-neutral-200 px-4 py-3 text-right align-bottom text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                Progress
              </th>
            </tr>
            <tr className="border-b border-neutral-200">
              {columns.map(({ module: m, startsGroup }) => (
                <th
                  key={m.id}
                  scope="col"
                  className={cn("h-40 px-0 pb-3 align-bottom font-normal", startsGroup && "border-l border-neutral-200")}
                >
                  <div className="flex justify-center">
                    <Link
                      href={`/library/${m.id}`}
                      title={m.title}
                      className="rotate-180 rounded text-left text-xs whitespace-nowrap text-neutral-700 [writing-mode:vertical-rl] hover:text-neutral-950 hover:underline focus-visible:outline-2 focus-visible:outline-black"
                    >
                      {m.shortTitle}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {leaders.map((leader) => {
              const mapped = getAssignmentsForLeader(leader.id);
              const completed = mapped.filter((a) => a.status === "completed").length;
              return (
                <tr key={leader.id} className="group hover:bg-neutral-50">
                  <th scope="row" className="sticky left-0 z-10 border-r border-neutral-200 bg-white px-3 py-2.5 text-left font-normal group-hover:bg-neutral-50 sm:px-4">
                    <span className="flex items-center gap-2.5">
                      <Avatar name={leader.name} size="xs" className="hidden sm:inline-flex" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{leader.name}</span>
                        <span className="block truncate text-[11px] text-neutral-500">{leader.role}</span>
                      </span>
                    </span>
                  </th>
                  {columns.map(({ module: m, startsGroup }) => {
                    const status = getAssignment(leader.id, m.id)?.status ?? "none";
                    const label = status === "none" ? "Not mapped" : STATUS_LABEL[status];
                    return (
                      <td
                        key={m.id}
                        title={`${leader.name} · ${m.title}: ${label}`}
                        className={cn("px-0 py-2.5 text-center", startsGroup && "border-l border-neutral-200")}
                      >
                        <StatusMark status={status} />
                        <span className="sr-only">{label}</span>
                      </td>
                    );
                  })}
                  <td className="border-l border-neutral-200 px-4 py-2.5 text-right">
                    <span className="flex items-center justify-end gap-2">
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-neutral-100" aria-hidden="true">
                        <span
                          className="block h-full rounded-full bg-neutral-950"
                          style={{ width: `${(completed / Math.max(mapped.length, 1)) * 100}%` }}
                        />
                      </span>
                      <span className="text-xs tabular-nums text-neutral-700">
                        {completed}/{mapped.length}
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t border-neutral-200 bg-neutral-50">
            <tr>
              <th scope="row" className="sticky left-0 z-10 border-r border-neutral-200 bg-neutral-50 px-3 py-2.5 text-left text-xs font-medium text-neutral-600 sm:px-4">
                Leaders mapped
              </th>
              {columns.map(({ module: m, startsGroup }) => (
                <td
                  key={m.id}
                  className={cn("py-2.5 text-center text-xs tabular-nums text-neutral-600", startsGroup && "border-l border-neutral-200")}
                >
                  {getAssignmentsForModule(m.id).length}
                </td>
              ))}
              <td className="border-l border-neutral-200" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
