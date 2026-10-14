/** ISO calendar date, e.g. "2026-10-12". Always interpreted as UTC. */
export type IsoDate = string;

export interface Veteran {
  id: string;
  name: string;
  title: string;
  yearsInField: number;
  location: string;
  phone: string;
  email: string;
  specialties: string[];
  bio: string;
  notableProjects: string[];
  availability: string;
  nextCall?: { date: IsoDate; time: string; topic: string };
}

export interface Job {
  id: string;
  name: string;
  description: string;
  location: string;
  contractValue: string;
  phase: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  yearsExperience: number;
  phone: string;
  email: string;
  jobId: string;
  mentorId: string;
  joinedProgram: IsoDate;
  background: string;
  responsibilities: string[];
  developmentGoal: string;
}

export const MODULE_CATEGORIES = [
  "Safety",
  "Scheduling",
  "Crew Leadership",
  "Quality & QA/QC",
  "Client & Owner Relations",
  "Preconstruction",
  "Closeout",
] as const;
export type ModuleCategory = (typeof MODULE_CATEGORIES)[number];

export const MODULE_FORMATS = [
  "Video",
  "PDF Guide",
  "Checklist",
  "Call Recording",
  "Field Walk",
] as const;
export type ModuleFormat = (typeof MODULE_FORMATS)[number];

export interface TrainingModule {
  id: string;
  title: string;
  /** Compact label for dense layouts such as the content mapping matrix. */
  shortTitle: string;
  category: ModuleCategory;
  format: ModuleFormat;
  durationMinutes: number;
  sourceVeteranId: string;
  summary: string;
  objectives: string[];
  outline: { title: string; minutes: number }[];
  tags: string[];
  fileName: string;
  version: string;
  updatedAt: IsoDate;
}

export type QuestionStatus = "open" | "answered";

export interface WeeklyQuestion {
  id: string;
  weekOf: IsoDate;
  text: string;
  category: ModuleCategory;
  askedByLeaderId: string;
  routedToVeteranId: string;
  status: QuestionStatus;
}

export interface CallNote {
  id: string;
  weekOf: IsoDate;
  date: IsoDate;
  veteranId: string;
  topic: string;
  durationMinutes: number;
  attendeeIds: string[];
  summary: string;
  takeaways: string[];
  followUps: { text: string; ownerId: string }[];
  themeIds: string[];
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  quote: { text: string; veteranId: string };
}

export type AssignmentStatus = "completed" | "this-week" | "scheduled";

export interface Assignment {
  leaderId: string;
  moduleId: string;
  weekOf: IsoDate;
  status: AssignmentStatus;
}
