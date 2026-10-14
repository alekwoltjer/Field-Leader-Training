import type { CallNote } from "./types";

/** Follow-up `ownerId` may reference either a leader or a veteran. */
export const callNotes: CallNote[] = [
  {
    id: "call-1008-tom",
    weekOf: "2026-10-05",
    date: "2026-10-08",
    veteranId: "tom-brennan",
    topic: "Recovering a slipping schedule",
    durationMinutes: 52,
    attendeeIds: ["hannah-brooks", "emily-carter", "derek-johnson"],
    summary:
      "Tom walked the group through how he diagnoses a slipping activity before reacting. Most slips come from missing information or material, not from lazy crews. He shared the recovery plan he used on Cedar Point Apartments when framing fell eight days behind.",
    takeaways: [
      "Ask whether the slip is manpower, material, or information before you push anyone.",
      "Re-sequence the trades behind a slip before you ask the slipping trade for overtime.",
      "Tell the PM the same day. Bring the recovery plan, not just the problem.",
    ],
    followUps: [
      { text: "Send the Cedar Point recovery schedule as an example", ownerId: "tom-brennan" },
      { text: "Draft a recovery plan for Level 4 framing and review with Tom", ownerId: "hannah-brooks" },
    ],
    themeIds: ["own-the-lookahead", "plan-on-friday", "hard-conversation-early"],
  },
  {
    id: "call-1006-maria",
    weekOf: "2026-10-05",
    date: "2026-10-06",
    veteranId: "maria-santos",
    topic: "Crane and rigging: who has the call",
    durationMinutes: 40,
    attendeeIds: ["marcus-hill", "derek-johnson", "luis-ortega"],
    summary:
      "Maria clarified stop-work authority on lifts and how to run a pre-lift meeting when the operator, rigger, and foreman have different opinions. Everyone on site can stop a pick. Only the lift director can start it again.",
    takeaways: [
      "Anyone can stop a lift. Only the designated lift director restarts it.",
      "Hold the pre-lift meeting at the load, not in the trailer.",
      "Write the sequence down and have the operator and rigger initial it.",
    ],
    followUps: [
      { text: "Share the critical lift plan template", ownerId: "maria-santos" },
      { text: "Name a lift director for every tilt-up erection day", ownerId: "derek-johnson" },
    ],
    themeIds: ["safety-first-five", "walk-it"],
  },
  {
    id: "call-1009-linda",
    weekOf: "2026-10-05",
    date: "2026-10-09",
    veteranId: "linda-okafor",
    topic: "Cold weather is coming",
    durationMinutes: 35,
    attendeeIds: ["aisha-patel", "marcus-hill", "luis-ortega"],
    summary:
      "With the first frost a few weeks away, Linda covered how she plans cold-weather pours on elevated decks. The decision is made on Friday with the forecast, the mix design, and the blanket count, not on pour morning.",
    takeaways: [
      "Make the go/no-go call on Friday for anything poured early next week.",
      "Count blankets and heaters before you need them. Rentals run out in November.",
      "Put temperature loggers in every placement and check them yourself.",
    ],
    followUps: [
      { text: "Order 40 additional insulated blankets for Harbor Point", ownerId: "marcus-hill" },
      { text: "Add cold-weather checks to the pour card", ownerId: "aisha-patel" },
    ],
    themeIds: ["plan-on-friday", "walk-it"],
  },
  {
    id: "call-0930-gene",
    weekOf: "2026-09-28",
    date: "2026-09-30",
    veteranId: "gene-kowalski",
    topic: "Leading crews through a bad week",
    durationMinutes: 48,
    attendeeIds: ["luis-ortega", "derek-johnson", "hannah-brooks", "marcus-hill"],
    summary:
      "Gene shared stories from a week on the Joliet Intermodal job when a panel cracked during erection and the owner was on site. He talked about staying visible, owning the problem with the crew, and protecting foremen from blame in front of the owner.",
    takeaways: [
      "On a bad day, be the most visible person on site.",
      "Own the problem in front of the owner. Coach the foreman in private.",
      "Start the next morning's huddle by resetting, not by rehashing.",
    ],
    followUps: [
      { text: "Practice a reset huddle on Monday and report back", ownerId: "derek-johnson" },
    ],
    themeIds: ["foremen-are-partners", "safety-first-five", "hard-conversation-early"],
  },
  {
    id: "call-0923-ray",
    weekOf: "2026-09-21",
    date: "2026-09-23",
    veteranId: "ray-delgado",
    topic: "Owner relationships on occupied sites",
    durationMinutes: 38,
    attendeeIds: ["sofia-nguyen", "jordan-reyes", "derek-johnson"],
    summary:
      "Ray explained how he keeps facility staff on his side in hospitals and schools. Daily five-minute check-ins with the facility lead, a noise schedule posted a week ahead, and never letting the owner hear about a problem from someone else.",
    takeaways: [
      "Do a five-minute daily check-in with the facility lead, in person.",
      "Post the noise and shutdown schedule a full week ahead.",
      "Treat the trade foremen like partners. They represent you in the building.",
    ],
    followUps: [
      { text: "Set up a daily check-in with the Lakeview principal", ownerId: "sofia-nguyen" },
      { text: "Send the hospital noise-window template", ownerId: "ray-delgado" },
    ],
    themeIds: ["hard-conversation-early", "plan-on-friday", "foremen-are-partners"],
  },
  {
    id: "call-0924-dale",
    weekOf: "2026-09-21",
    date: "2026-09-24",
    veteranId: "dale-whitaker",
    topic: "Above-ceiling inspections",
    durationMinutes: 55,
    attendeeIds: ["jordan-reyes", "emily-carter", "hannah-brooks"],
    summary:
      "Dale described how he runs above-ceiling walks with every MEP foreman present, why he schedules them on the lookahead three weeks out, and the ten deficiencies inspectors find on almost every job.",
    takeaways: [
      "Put above-ceiling walks on the lookahead three weeks before close-in.",
      "Every trade foreman walks. No foreman, no close-in for that area.",
      "Photograph every deficiency with a room number and an owner.",
    ],
    followUps: [
      { text: "Schedule Level 2 above-ceiling walk on the lookahead", ownerId: "jordan-reyes" },
      { text: "Build a deficiency log template in the punch app", ownerId: "emily-carter" },
    ],
    themeIds: ["walk-it", "own-the-lookahead"],
  },
  {
    id: "call-0916-linda",
    weekOf: "2026-09-14",
    date: "2026-09-16",
    veteranId: "linda-okafor",
    topic: "Pour day readiness",
    durationMinutes: 42,
    attendeeIds: ["aisha-patel", "marcus-hill", "luis-ortega"],
    summary:
      "Linda took the group through her day-before deck walk and pour morning routine. She still walks every deck herself, and she pushed the group to confirm the pump, trucks, and testing lab on Friday for Monday pours.",
    takeaways: [
      "Walk the deck the day before with the pour card in hand.",
      "Confirm the pump, trucks, finishers, and lab by Friday for Monday pours.",
      "Hold a two-minute go/no-go at 5:30 AM with the foremen.",
    ],
    followUps: [
      { text: "Update the pour readiness checklist to v5.2", ownerId: "linda-okafor" },
    ],
    themeIds: ["walk-it", "plan-on-friday"],
  },
  {
    id: "call-0909-tom",
    weekOf: "2026-09-07",
    date: "2026-09-09",
    veteranId: "tom-brennan",
    topic: "Lookaheads that drive the work",
    durationMinutes: 46,
    attendeeIds: ["emily-carter", "hannah-brooks", "jordan-reyes", "sofia-nguyen"],
    summary:
      "Tom showed how to turn a master schedule activity into field tasks the foremen recognize, and how to run a lookahead review that surfaces constraints instead of just reading dates.",
    takeaways: [
      "The lookahead is the superintendent's tool, not the scheduler's.",
      "Every activity needs a named foreman and a constraint check.",
      "Spend the lookahead meeting on constraints, not on dates.",
    ],
    followUps: [
      { text: "Rebuild the interiors lookahead in the new template", ownerId: "jordan-reyes" },
      { text: "Share the lookahead template v4.0", ownerId: "tom-brennan" },
    ],
    themeIds: ["own-the-lookahead", "plan-on-friday"],
  },
  {
    id: "call-0910-maria",
    weekOf: "2026-09-07",
    date: "2026-09-10",
    veteranId: "maria-santos",
    topic: "Pre-task planning that matters",
    durationMinutes: 36,
    attendeeIds: ["luis-ortega", "marcus-hill", "aisha-patel"],
    summary:
      "Maria challenged the group on pre-task plans that are filled out in the truck. She shared the five questions she wants every crew to answer out loud and showed how to walk the work area before the huddle.",
    takeaways: [
      "Walk the work area before you lead the pre-task plan.",
      "Ask the five questions out loud. Make the crew answer, not the foreman.",
      "A PTP signed in the truck is a liability, not a plan.",
    ],
    followUps: [
      { text: "Pilot the five-question PTP with the concrete crew", ownerId: "luis-ortega" },
    ],
    themeIds: ["safety-first-five", "walk-it"],
  },
  {
    id: "call-0902-gene",
    weekOf: "2026-08-31",
    date: "2026-09-02",
    veteranId: "gene-kowalski",
    topic: "Stepping up from assistant to lead",
    durationMinutes: 42,
    attendeeIds: ["derek-johnson", "marcus-hill", "jordan-reyes"],
    summary:
      "Gene kicked off the program with the jump from assistant to lead superintendent. He covered letting go of the tasks you were good at, learning every foreman's name in week one, and having hard conversations early instead of waiting.",
    takeaways: [
      "Stop doing the work you were good at as an assistant. Coach someone else to do it.",
      "Learn every foreman's name, and something about them, in your first week.",
      "If something bothers you twice, have the conversation.",
    ],
    followUps: [
      { text: "List the tasks to hand off to the new assistant super", ownerId: "derek-johnson" },
    ],
    themeIds: ["foremen-are-partners", "hard-conversation-early"],
  },
];
