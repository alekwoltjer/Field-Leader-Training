import { AvatarStack } from "@/components/ui/Avatar";
import { totals, getThemeStats, getVeteran } from "@/lib/queries";

export function KeyThemes() {
  const stats = getThemeStats();

  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map(({ theme, mentions, veteranIds }, index) => {
        const names = veteranIds.map((id) => getVeteran(id).name);
        const quoteBy = getVeteran(theme.quote.veteranId);
        return (
          <li key={theme.id} className="flex flex-col rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-neutral-400">{String(index + 1).padStart(2, "0")}</span>
              <AvatarStack names={names} />
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight">{theme.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{theme.description}</p>

            <div className="mt-5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-neutral-500">
                  Raised on {mentions} of {totals.callsLogged} calls
                </span>
                <span className="font-medium tabular-nums">
                  {Math.round((mentions / totals.callsLogged) * 100)}%
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100"
                role="img"
                aria-label={`Raised on ${mentions} of ${totals.callsLogged} calls`}
              >
                <div
                  className="h-full rounded-full bg-neutral-950"
                  style={{ width: `${(mentions / totals.callsLogged) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500">{names.join(", ")}</p>
            </div>

            <blockquote className="mt-5 border-l-2 border-neutral-950 pl-4">
              <p className="text-sm leading-relaxed font-medium">&ldquo;{theme.quote.text}&rdquo;</p>
              <footer className="mt-1.5 text-xs text-neutral-500">{quoteBy.name}</footer>
            </blockquote>
          </li>
        );
      })}
    </ol>
  );
}
