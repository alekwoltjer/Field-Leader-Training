import { describe, expect, it } from "vitest";
import { getThemeStats, getStoragePath } from "@/lib/queries";
import { assignments } from "./assignments";
import { callNotes } from "./callNotes";
import { jobs } from "./jobs";
import { leaders } from "./leaders";
import { modules } from "./modules";
import { CURRENT_WEEK } from "./org";
import { questions } from "./questions";
import { themes } from "./themes";
import { veterans } from "./veterans";

const ids = <T extends { id: string }>(items: readonly T[]) => new Set(items.map((i) => i.id));
const veteranIds = ids(veterans);
const leaderIds = ids(leaders);
const jobIds = ids(jobs);
const moduleIds = ids(modules);
const themeIds = ids(themes);

const isMonday = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay() === 1;
const daysBetween = (a: string, b: string) =>
  (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000;

describe("mock data integrity", () => {
  it("has unique ids in every collection", () => {
    const collections: ReadonlyArray<readonly { id: string }[]> = [
      veterans,
      leaders,
      jobs,
      modules,
      themes,
      questions,
      callNotes,
    ];
    for (const items of collections) {
      expect(ids(items).size).toBe(items.length);
    }
  });

  it("uses Mondays for every program week", () => {
    expect(isMonday(CURRENT_WEEK)).toBe(true);
    for (const weekOf of [
      ...questions.map((q) => q.weekOf),
      ...callNotes.map((n) => n.weekOf),
      ...assignments.map((a) => a.weekOf),
    ]) {
      expect(isMonday(weekOf), weekOf).toBe(true);
    }
  });

  it("links leaders to real jobs and mentors", () => {
    for (const leader of leaders) {
      expect(jobIds.has(leader.jobId), leader.id).toBe(true);
      expect(veteranIds.has(leader.mentorId), leader.id).toBe(true);
    }
  });

  it("links modules to real veterans and matches outline time to duration", () => {
    for (const trainingModule of modules) {
      expect(veteranIds.has(trainingModule.sourceVeteranId), trainingModule.id).toBe(true);
      const outlineMinutes = trainingModule.outline.reduce((sum, s) => sum + s.minutes, 0);
      expect(outlineMinutes, trainingModule.id).toBe(trainingModule.durationMinutes);
      expect(getStoragePath(trainingModule).at(-1)).toBe(trainingModule.fileName);
    }
  });

  it("links questions to real leaders and veterans", () => {
    for (const q of questions) {
      expect(leaderIds.has(q.askedByLeaderId), q.id).toBe(true);
      expect(veteranIds.has(q.routedToVeteranId), q.id).toBe(true);
      expect(q.weekOf <= CURRENT_WEEK, q.id).toBe(true);
    }
  });

  it("keeps call notes consistent with veterans, leaders, and themes", () => {
    for (const note of callNotes) {
      expect(veteranIds.has(note.veteranId), note.id).toBe(true);
      const offset = daysBetween(note.weekOf, note.date);
      expect(offset >= 0 && offset < 7, note.id).toBe(true);
      expect(note.weekOf < CURRENT_WEEK, note.id).toBe(true);
      for (const attendee of note.attendeeIds) {
        expect(leaderIds.has(attendee), `${note.id}:${attendee}`).toBe(true);
        const leader = leaders.find((l) => l.id === attendee);
        expect(leader && leader.joinedProgram <= note.date, `${note.id}:${attendee}`).toBe(true);
      }
      for (const f of note.followUps) {
        expect(leaderIds.has(f.ownerId) || veteranIds.has(f.ownerId), f.ownerId).toBe(true);
      }
      for (const t of note.themeIds) expect(themeIds.has(t), t).toBe(true);
    }
  });

  it("keeps assignment status consistent with the current week", () => {
    const seen = new Set<string>();
    for (const a of assignments) {
      const key = `${a.leaderId}:${a.moduleId}`;
      expect(seen.has(key), `duplicate ${key}`).toBe(false);
      seen.add(key);
      expect(leaderIds.has(a.leaderId), key).toBe(true);
      expect(moduleIds.has(a.moduleId), key).toBe(true);
      if (a.status === "completed") expect(a.weekOf < CURRENT_WEEK, key).toBe(true);
      if (a.status === "this-week") expect(a.weekOf).toBe(CURRENT_WEEK);
      if (a.status === "scheduled") expect(a.weekOf > CURRENT_WEEK, key).toBe(true);
    }
  });

  it("gives every leader training this week and maps every module", () => {
    for (const leader of leaders) {
      const thisWeek = assignments.filter(
        (a) => a.leaderId === leader.id && a.status === "this-week",
      );
      expect(thisWeek.length, leader.id).toBeGreaterThan(0);
    }
    for (const trainingModule of modules) {
      expect(assignments.some((a) => a.moduleId === trainingModule.id), trainingModule.id).toBe(true);
    }
  });

  it("has every theme raised on at least two calls", () => {
    for (const stat of getThemeStats()) {
      expect(stat.mentions, stat.theme.id).toBeGreaterThanOrEqual(2);
      expect(veteranIds.has(stat.theme.quote.veteranId)).toBe(true);
    }
  });
});
