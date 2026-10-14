import { assignments } from "@/data/assignments";
import { callNotes } from "@/data/callNotes";
import { jobs } from "@/data/jobs";
import { leaders } from "@/data/leaders";
import { modules } from "@/data/modules";
import { CURRENT_WEEK, ORG } from "@/data/org";
import { questions } from "@/data/questions";
import { themes } from "@/data/themes";
import {
  MODULE_CATEGORIES,
  type Assignment,
  type AssignmentStatus,
  type CallNote,
  type Job,
  type Leader,
  type ModuleCategory,
  type Theme,
  type TrainingModule,
  type Veteran,
  type WeeklyQuestion,
} from "@/data/types";
import { veterans } from "@/data/veterans";

function indexById<T extends { id: string }>(items: readonly T[], label: string) {
  const map = new Map<string, T>();
  for (const item of items) {
    if (map.has(item.id)) throw new Error(`Duplicate ${label} id: ${item.id}`);
    map.set(item.id, item);
  }
  return map;
}

const veteranById = indexById(veterans, "veteran");
const leaderById = indexById(leaders, "leader");
const jobById = indexById(jobs, "job");
const moduleById = indexById(modules, "module");
const themeById = indexById(themes, "theme");

function mustGet<T>(map: Map<string, T>, id: string, label: string): T {
  const value = map.get(id);
  if (!value) throw new Error(`Unknown ${label} id: ${id}`);
  return value;
}

export const getVeteran = (id: string): Veteran => mustGet(veteranById, id, "veteran");
export const getLeader = (id: string): Leader => mustGet(leaderById, id, "leader");
export const getJob = (id: string): Job => mustGet(jobById, id, "job");
export const getModule = (id: string): TrainingModule => mustGet(moduleById, id, "module");
export const getTheme = (id: string): Theme => mustGet(themeById, id, "theme");
export const findModule = (id: string): TrainingModule | undefined => moduleById.get(id);
export const isVeteranId = (id: string): boolean => veteranById.has(id);

/** Resolves a follow-up owner, which may be a leader or a veteran. */
export function getPersonName(id: string): string {
  const person = leaderById.get(id) ?? veteranById.get(id);
  if (!person) throw new Error(`Unknown person id: ${id}`);
  return person.name;
}

export function getAssignmentsForLeader(leaderId: string, status?: AssignmentStatus): Assignment[] {
  return assignments.filter(
    (a) => a.leaderId === leaderId && (status === undefined || a.status === status),
  );
}

export function getAssignmentsForModule(moduleId: string): Assignment[] {
  return assignments.filter((a) => a.moduleId === moduleId);
}

export function getAssignment(leaderId: string, moduleId: string): Assignment | undefined {
  return assignments.find((a) => a.leaderId === leaderId && a.moduleId === moduleId);
}

export function getModulesBySourceVeteran(veteranId: string): TrainingModule[] {
  return modules.filter((m) => m.sourceVeteranId === veteranId);
}

export function getQuestionsForWeek(weekOf: string = CURRENT_WEEK): WeeklyQuestion[] {
  return questions.filter((q) => q.weekOf === weekOf);
}

export function getQuestionsByLeader(leaderId: string): WeeklyQuestion[] {
  return questions
    .filter((q) => q.askedByLeaderId === leaderId)
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf));
}

export function getCallNotesForVeteran(veteranId: string): CallNote[] {
  return callNotes.filter((n) => n.veteranId === veteranId);
}

/** Call notes grouped by program week, most recent week first. */
export function getCallNotesByWeek(notes: readonly CallNote[] = callNotes) {
  const groups = new Map<string, CallNote[]>();
  for (const note of notes) {
    const list = groups.get(note.weekOf) ?? [];
    list.push(note);
    groups.set(note.weekOf, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([weekOf, list]) => ({
      weekOf,
      notes: list.sort((a, b) => b.date.localeCompare(a.date)),
    }));
}

export interface ThemeStat {
  theme: Theme;
  mentions: number;
  veteranIds: string[];
  callIds: string[];
}

/** Theme frequency derived from call notes, most-mentioned first. */
export function getThemeStats(): ThemeStat[] {
  return themes
    .map((theme) => {
      const calls = callNotes.filter((n) => n.themeIds.includes(theme.id));
      return {
        theme,
        mentions: calls.length,
        veteranIds: [...new Set(calls.map((c) => c.veteranId))],
        callIds: calls.map((c) => c.id),
      };
    })
    .sort((a, b) => b.mentions - a.mentions || a.theme.title.localeCompare(b.theme.title));
}

/** Folder name for a category in the content repository, e.g. "01 Safety". */
export function getCategoryFolder(category: ModuleCategory): string {
  const index = MODULE_CATEGORIES.indexOf(category);
  return `${String(index + 1).padStart(2, "0")} ${category.replace("/", "-")}`;
}

export const REPOSITORY_ROOT = [
  ORG.repository.system,
  ORG.repository.site,
  ORG.repository.library,
] as const;

export function getStoragePath(trainingModule: TrainingModule): string[] {
  return [...REPOSITORY_ROOT, getCategoryFolder(trainingModule.category), trainingModule.fileName];
}

export function getModulesByCategory(category: ModuleCategory): TrainingModule[] {
  return modules.filter((m) => m.category === category);
}

export const totals = {
  modules: modules.length,
  veterans: veterans.length,
  leaders: leaders.length,
  jobs: jobs.length,
  callsLogged: callNotes.length,
  firstCallWeek: callNotes.map((n) => n.weekOf).sort()[0] ?? CURRENT_WEEK,
  contentMinutes: modules.reduce((sum, m) => sum + m.durationMinutes, 0),
  veteranYears: veterans.reduce((sum, v) => sum + v.yearsInField, 0),
};
