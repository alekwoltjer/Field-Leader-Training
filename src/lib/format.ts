import type { IsoDate } from "@/data/types";

function parseIsoDate(iso: IsoDate): Date {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid ISO date: ${iso}`);
  return date;
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const longDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const weekdayDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "Oct 12" */
export const formatShortDate = (iso: IsoDate) => shortDate.format(parseIsoDate(iso));
/** "Oct 12, 2026" */
export const formatLongDate = (iso: IsoDate) => longDate.format(parseIsoDate(iso));
/** "Thu, Oct 15" */
export const formatWeekdayDate = (iso: IsoDate) => weekdayDate.format(parseIsoDate(iso));

/** "18 min" or "1 hr 05 min" */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${String(rest).padStart(2, "0")} min`;
}

/** "02:07" */
export function formatTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const firstName = (name: string) => name.split(/\s+/)[0] ?? name;

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Digits-only phone for tel: links. */
export const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, "")}`;
