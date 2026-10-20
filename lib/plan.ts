// The 8-week plan. Dates are IST calendar days, stored as YYYY-MM-DD strings.

export const PLAN_START = "2026-10-20";
export const PLAN_END = "2026-12-20";
export const DSA_TARGET = 100;
export const APPS_TARGET = 70;

export type Week = { week: number; dates: string; dsa: string; design: string };

export const WEEKS: Week[] = [
  { week: 1, dates: "Oct 20–26", dsa: "Arrays, hashing, two pointers", design: "Resume + LinkedIn fix, JS core" },
  { week: 2, dates: "Oct 27–Nov 2", dsa: "Sliding window, binary search", design: "Node + DB indexing/transactions" },
  { week: 3, dates: "Nov 3–9", dsa: "Stack, linked list", design: "HLD basics + URL shortener" },
  { week: 4, dates: "Nov 10–16", dsa: "Trees, heap", design: "Rate limiter + caching/Redis" },
  { week: 5, dates: "Nov 17–23", dsa: "Graphs", design: "LLD: parking lot + patterns" },
  { week: 6, dates: "Nov 24–30", dsa: "DP (basic)", design: "Notification system + Spring Boot revision" },
  { week: 7, dates: "Dec 1–7", dsa: "Revision of old problems", design: "Chat system + design your own SaaS" },
  { week: 8, dates: "Dec 8–20", dsa: "Revision only", design: "Mocks + negotiation" },
];

export const SCOPE: { area: string; target: string }[] = [
  { area: "DSA", target: "~100 problems — NeetCode 150, Easy + Medium only" },
  { area: "HLD", target: "URL shortener" },
  { area: "HLD", target: "Rate limiter" },
  { area: "HLD", target: "Notification system" },
  { area: "HLD", target: "Chat system" },
  { area: "LLD", target: "Parking lot" },
  { area: "LLD", target: "BookMyShow" },
  { area: "LLD", target: "Patterns: Factory, Strategy, Observer, Singleton" },
  { area: "Java", target: "Revision only — lead with Node/JS" },
  { area: "Own project", target: "Design your SaaS end to end (multi-tenancy, billing)" },
];

export const RULES = [
  "Weekday interview → that day's 1.5 hrs = prep for that company",
  "No long videos on weekdays; watch on weekends at 1.5x",
  "One mistakes notebook — revise every Saturday",
  "Book real interviews from Week 3 (practice rounds earlier are fine)",
  "Protect weekends — 65% of prep time",
];

export const LEARNING_CATEGORIES = ["DSA", "JavaScript", "TypeScript", "Node.js", "Express", "React", "Java/Spring", "Python", "FastAPI", "Database", "System Design", "LLD", "Behavioral", "Other"] as const;
export const INTERVIEW_ROUNDS = ["Screening", "Online test", "Tech 1", "Tech 2", "Tech 3", "System design", "Machine coding", "Managerial", "HR"] as const;
export const QUESTION_RESULTS = ["Nailed it", "Partial", "Couldn't answer"] as const;
export const DAY_STATUSES = ["Done", "Partial", "Skipped"] as const;
export const APP_STATUSES = ["Applied", "Screening", "Interviewing", "Offer", "Rejected", "On hold"] as const;
export const APP_SOURCES = ["Referral", "LinkedIn", "Naukri", "Instahyre", "Cutshort", "Wellfound", "Company site", "Other"] as const;

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function weekOf(iso: string) {
  const diff = Math.round((Date.parse(iso + "T00:00:00Z") - Date.parse(PLAN_START + "T00:00:00Z")) / 86400000);
  return Math.min(8, Math.max(1, Math.floor(diff / 7) + 1));
}

export function plannedFor(iso: string) {
  const w = WEEKS[weekOf(iso) - 1];
  const dow = new Date(iso + "T00:00:00Z").getUTCDay(); // 0 Sun, 6 Sat
  let tasks: string[];
  if (dow === 6) {
    tasks = [
      `2 hrs DSA: new pattern + 4 problems (${w.dsa})`,
      `2 hrs system design (${w.design})`,
      "1.5 hrs backend core (DB/Node/Spring)",
      "1 hr review the week's mistakes",
    ];
  } else if (dow === 0) {
    tasks = [
      "2 hrs DSA: timed (2 problems in 45 min)",
      `2 hrs LLD / backend deep dive (${w.design})`,
      "1.5 hrs mock interview",
      "1 hr resume/project story + bulk apply",
    ];
  } else {
    tasks = [
      `60 min DSA: 2 problems (${w.dsa}) — 1 new + 1 revisit`,
      `20 min theory (${w.design})`,
      "10 min apply: 3–5 + referrals",
    ];
  }
  if (iso === PLAN_START) tasks.unshift("Fix resume, LinkedIn, Naukri (mark 'serving notice, LWD Dec 20')");
  return { week: w.week, type: dow === 0 || dow === 6 ? "Weekend" : "Weekday", tasks };
}

export function allPlanDays() {
  const out: string[] = [];
  for (let d = PLAN_START; d <= PLAN_END; d = addDays(d, 1)) out.push(d);
  return out;
}

export function todayIST() {
  return new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
}

export function fmt(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
  });
}
