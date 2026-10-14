import type { Theme } from "./types";

export const themes: Theme[] = [
  {
    id: "plan-on-friday",
    title: "Plan the week on Friday",
    description:
      "Every veteran wins or loses next week before they leave on Friday. Walk the job, confirm manpower, material, inspections, and equipment, then send one clear plan.",
    quote: {
      text: "If you're figuring out Monday on Monday, you already lost Monday.",
      veteranId: "tom-brennan",
    },
  },
  {
    id: "walk-it",
    title: "Walk it, don't read it",
    description:
      "Reports, schedules, and photos are not the job. The veterans verify readiness, quality, and safety with their own eyes, every day, before they trust a status update.",
    quote: {
      text: "The pour card says it's ready. My boots tell me if it's ready.",
      veteranId: "linda-okafor",
    },
  },
  {
    id: "hard-conversation-early",
    title: "Have the hard conversation early",
    description:
      "Bad news gets worse with time. Raise problems with foremen, PMs, and owners as soon as you see them, and bring a plan with you when you do.",
    quote: {
      text: "Owners forgive late. They don't forgive surprised.",
      veteranId: "ray-delgado",
    },
  },
  {
    id: "foremen-are-partners",
    title: "Foremen are partners, not subs",
    description:
      "Keep your word on access, hoisting, and sequencing. The goodwill you build with trade foremen on normal days is what gets you through the hard ones.",
    quote: {
      text: "Learn every foreman's name in week one. You'll need their help in month six.",
      veteranId: "gene-kowalski",
    },
  },
  {
    id: "own-the-lookahead",
    title: "Own the three-week lookahead",
    description:
      "The master schedule belongs to the project. The lookahead belongs to the superintendent. Build it with the trades and clear constraints three weeks out.",
    quote: {
      text: "A lookahead nobody argued about is a lookahead nobody read.",
      veteranId: "tom-brennan",
    },
  },
  {
    id: "safety-first-five",
    title: "Safety is set in the first five minutes",
    description:
      "The morning huddle sets the tone for the whole day. Lead it yourself, keep it real, and make sure the crew is talking, not just signing a sheet.",
    quote: {
      text: "If the crew is signing and not talking, you didn't have a pre-task plan. You had a pen.",
      veteranId: "maria-santos",
    },
  },
];
