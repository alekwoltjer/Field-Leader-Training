import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import Link from "next/link";
import { FormatIcon } from "@/components/FormatIcon";
import { MODULE_CATEGORIES } from "@/data/types";
import { formatMinutes } from "@/lib/format";
import { REPOSITORY_ROOT, getCategoryFolder, getModulesByCategory } from "@/lib/queries";

export function RepositoryTree() {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 border-b border-neutral-200 bg-neutral-50 px-4 py-3 font-mono text-[11px] text-neutral-600">
        {REPOSITORY_ROOT.map((segment, i) => (
          <span key={segment} className="inline-flex items-center gap-1 whitespace-nowrap">
            {i > 0 && <ChevronRight aria-hidden="true" className="size-3 text-neutral-400" />}
            <span className={i === REPOSITORY_ROOT.length - 1 ? "font-semibold text-neutral-950" : ""}>
              {segment}
            </span>
          </span>
        ))}
      </div>
      <ul className="divide-y divide-neutral-100">
        {MODULE_CATEGORIES.map((category, index) => {
          const files = getModulesByCategory(category);
          const minutes = files.reduce((sum, m) => sum + m.durationMinutes, 0);
          return (
            <li key={category}>
              <details open={index < 2} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black [&::-webkit-details-marker]:hidden">
                  <ChevronRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-neutral-400 transition-transform group-open:rotate-90"
                  />
                  <Folder aria-hidden="true" className="size-4 shrink-0 group-open:hidden" />
                  <FolderOpen aria-hidden="true" className="hidden size-4 shrink-0 group-open:block" />
                  <span className="flex-1 truncate font-medium">{getCategoryFolder(category)}</span>
                  <span className="shrink-0 text-xs tabular-nums text-neutral-500">
                    {files.length} {files.length === 1 ? "file" : "files"} · {formatMinutes(minutes)}
                  </span>
                </summary>
                <ul className="pb-2">
                  {files.map((file) => (
                    <li key={file.id}>
                      <Link
                        href={`/library/${file.id}`}
                        className="flex items-center gap-2.5 py-1.5 pr-4 pl-[3.25rem] font-mono text-xs text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
                      >
                        <FormatIcon format={file.format} className="size-3.5 shrink-0" />
                        <span className="truncate">{file.fileName}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
