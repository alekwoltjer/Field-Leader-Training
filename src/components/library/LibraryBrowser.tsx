"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FilterChips, type ChipOption } from "@/components/ui/FilterChips";
import { modules } from "@/data/modules";
import {
  MODULE_CATEGORIES,
  MODULE_FORMATS,
  type ModuleCategory,
  type ModuleFormat,
  type TrainingModule,
} from "@/data/types";
import { getVeteran } from "@/lib/queries";
import { ModuleCard } from "./ModuleCard";

type CategoryFilter = ModuleCategory | "all";
type FormatFilter = ModuleFormat | "all";

const categoryOptions: ChipOption<CategoryFilter>[] = [
  { value: "all", label: "All categories", count: modules.length },
  ...MODULE_CATEGORIES.map((c) => ({
    value: c,
    label: c,
    count: modules.filter((m) => m.category === c).length,
  })),
];

const formatOptions: ChipOption<FormatFilter>[] = [
  { value: "all", label: "All formats" },
  ...MODULE_FORMATS.map((f) => ({ value: f, label: f })),
];

function matchesQuery(trainingModule: TrainingModule, query: string): boolean {
  if (!query) return true;
  const haystack = [
    trainingModule.title,
    trainingModule.summary,
    trainingModule.category,
    trainingModule.format,
    getVeteran(trainingModule.sourceVeteranId).name,
    ...trainingModule.tags,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function LibraryBrowser() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());

  const results = modules.filter(
    (m) =>
      (category === "all" || m.category === category) &&
      (format === "all" || m.format === format) &&
      matchesQuery(m, deferredQuery),
  );

  const filtersActive = category !== "all" || format !== "all" || query !== "";

  function reset() {
    setCategory("all");
    setFormat("all");
    setQuery("");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <label className="relative block">
          <span className="sr-only">Search training modules</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, veteran, or tag (e.g. concrete, owner, crane)"
            className="h-10 w-full rounded-md border border-neutral-300 bg-white pr-3 pl-9 text-sm placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
          />
        </label>
        <FilterChips label="Filter by category" options={categoryOptions} value={category} onChange={setCategory} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterChips label="Filter by format" options={formatOptions} value={format} onChange={setFormat} />
          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <X />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <p className="mt-6 mb-3 text-xs text-neutral-500" aria-live="polite">
        Showing {results.length} of {modules.length} modules
      </p>

      {results.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((trainingModule) => (
            <li key={trainingModule.id}>
              <ModuleCard trainingModule={trainingModule} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-neutral-300 px-6 py-16 text-center">
          <p className="text-sm font-medium">No modules match these filters.</p>
          <p className="mt-1 text-sm text-neutral-500">Try a different category, format, or search term.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={reset}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
