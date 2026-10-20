import { asc, desc } from "drizzle-orm";
import { getDb } from "./db";
import { applications, dayLogs, dsaProblems, interviewQuestions, learnings, prepTopics, scopeItems, type DayLog } from "./schema";
import { APPS_TARGET, DSA_TARGET, allPlanDays, weekOf } from "./plan";

export async function getDayLogs() {
  const db = await getDb();
  const rows = await db.select().from(dayLogs);
  const map = new Map<string, DayLog>();
  for (const r of rows) map.set(r.day, r);
  return map;
}

export async function getApplications() {
  const db = await getDb();
  return db.select().from(applications).orderBy(desc(applications.appliedOn), desc(applications.id));
}

export async function getLearnings() {
  const db = await getDb();
  return db.select().from(learnings).orderBy(desc(learnings.learnedOn), desc(learnings.id));
}

export async function getQuestions() {
  const db = await getDb();
  return db.select().from(interviewQuestions).orderBy(desc(interviewQuestions.askedOn), desc(interviewQuestions.id));
}

export async function getPrep() {
  const db = await getDb();
  return db.select().from(prepTopics).orderBy(asc(prepTopics.position), asc(prepTopics.id));
}

export async function getDsa() {
  const db = await getDb();
  return db.select().from(dsaProblems).orderBy(asc(dsaProblems.position), asc(dsaProblems.id));
}

export async function getScope() {
  const db = await getDb();
  return db.select().from(scopeItems).orderBy(asc(scopeItems.position), asc(scopeItems.id));
}

export async function getStats() {
  const [logs, apps, scope, prep, dsaRows] = await Promise.all([getDayLogs(), getApplications(), getScope(), getPrep(), getDsa()]);
  const days = allPlanDays();
  let done = 0, partial = 0, skipped = 0, dsa = 0, sent = 0;
  const perWeek = Array.from({ length: 8 }, () => ({ done: 0, dsa: 0, apps: 0 }));
  for (const d of days) {
    const l = logs.get(d);
    if (!l) continue;
    const w = perWeek[weekOf(d) - 1];
    if (l.status === "Done") { done++; w.done++; }
    if (l.status === "Partial") partial++;
    if (l.status === "Skipped") skipped++;
    dsa += l.dsaSolved; sent += l.appsSent;
    w.dsa += l.dsaSolved; w.apps += l.appsSent;
  }
  const by = (s: string) => apps.filter((a) => a.status === s).length;
  return {
    totalDays: days.length, done, partial, skipped,
    dsa, dsaTarget: DSA_TARGET,
    sent, appsTarget: APPS_TARGET,
    pipeline: apps.length,
    interviewing: by("Interviewing") + by("Screening"),
    offers: by("Offer"),
    rejected: by("Rejected"),
    scopeDone: scope.filter((s) => s.done).length,
    scopeTotal: scope.length,
    prepConf: prep.filter((p) => p.status === "Confident").length,
    prepTotal: prep.length,
    dsaSolved: dsaRows.filter((d) => d.status !== "To do").length,
    dsaTotal: dsaRows.length,
    perWeek, logs,
  };
}
