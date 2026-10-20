"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { applications, dayLogs, dsaProblems, interviewQuestions, learnings, prepTopics, scopeItems } from "./schema";
import { DSA_STATUSES } from "./dsa";
import { PREP_STATUSES } from "./prep";
import { requireAuth, checkPassword, startSession, endSession } from "./auth";
import {
  APP_SOURCES, APP_STATUSES, DAY_STATUSES, INTERVIEW_ROUNDS, LEARNING_CATEGORIES, PLAN_END, PLAN_START, QUESTION_RESULTS,
} from "./plan";

const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);
const int = (f: FormData, k: string) => {
  const n = parseInt(String(f.get(k) ?? "0"), 10);
  return Number.isFinite(n) ? Math.max(n, 0) : 0;
};
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const oneOf = <T extends readonly string[]>(v: string, list: T, fallback: T[number]) =>
  (list as readonly string[]).includes(v) ? (v as T[number]) : fallback;

function refresh() {
  revalidatePath("/", "layout");
}

// ---------- auth ----------
export async function login(_: unknown, f: FormData) {
  if (!checkPassword(str(f, "password", 200))) return { error: "Wrong password" };
  await startSession();
  redirect("/learnings");
}

export async function logout() {
  await endSession();
  redirect("/login");
}

// ---------- day logs ----------
export async function saveDay(f: FormData) {
  await requireAuth();
  const day = str(f, "day", 10);
  if (!isDate(day) || day < PLAN_START || day > PLAN_END) return;
  const statusRaw = str(f, "status", 20);
  const values = {
    day,
    dsaSolved: Math.min(int(f, "dsaSolved"), 500),
    appsSent: Math.min(int(f, "appsSent"), 500),
    status: statusRaw ? oneOf(statusRaw, DAY_STATUSES, "Partial") : null,
    notes: str(f, "notes"),
    updatedAt: new Date(),
  };
  const db = await getDb();
  await db.insert(dayLogs).values(values).onConflictDoUpdate({ target: dayLogs.day, set: values });
  refresh();
}

export async function toggleTask(f: FormData) {
  await requireAuth();
  const day = str(f, "day", 10);
  const idx = int(f, "idx");
  if (!isDate(day) || day < PLAN_START || day > PLAN_END || idx > 20) return;
  const db = await getDb();
  const [row] = await db.select().from(dayLogs).where(eq(dayLogs.day, day));
  const set = new Set((row?.tasksDone ?? "").split(",").filter(Boolean).map(Number));
  if (set.has(idx)) set.delete(idx); else set.add(idx);
  const tasksDone = [...set].sort((a, b) => a - b).join(",");
  await db.insert(dayLogs).values({ day, tasksDone })
    .onConflictDoUpdate({ target: dayLogs.day, set: { tasksDone, updatedAt: new Date() } });
  refresh();
}

// ---------- applications ----------
function appValues(f: FormData) {
  const appliedOn = str(f, "appliedOn", 10);
  return {
    appliedOn: isDate(appliedOn) ? appliedOn : new Date().toISOString().slice(0, 10),
    company: str(f, "company", 120),
    role: str(f, "role", 120),
    source: oneOf(str(f, "source", 40), APP_SOURCES, "Other"),
    referral: f.get("referral") === "on",
    status: oneOf(str(f, "status", 40), APP_STATUSES, "Applied"),
    nextRound: str(f, "nextRound", 200),
    notes: str(f, "notes"),
  };
}

export async function addApplication(f: FormData) {
  await requireAuth();
  const v = appValues(f);
  if (!v.company) return;
  const db = await getDb();
  await db.insert(applications).values(v);
  refresh();
}

export async function updateApplication(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  const v = appValues(f);
  if (!id || !v.company) return;
  const db = await getDb();
  await db.update(applications).set(v).where(eq(applications.id, id));
  refresh();
}

export async function deleteApplication(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  if (!id) return;
  const db = await getDb();
  await db.delete(applications).where(eq(applications.id, id));
  refresh();
}

// ---------- learnings ----------
function learningValues(f: FormData) {
  const learnedOn = str(f, "learnedOn", 10);
  const link = str(f, "link", 500);
  return {
    learnedOn: isDate(learnedOn) ? learnedOn : new Date().toISOString().slice(0, 10),
    topic: str(f, "topic", 200),
    category: oneOf(str(f, "category", 40), LEARNING_CATEGORIES, "Other"),
    notes: str(f, "notes", 10000),
    link: /^https?:\/\//i.test(link) ? link : "",
  };
}

export async function addLearning(f: FormData) {
  await requireAuth();
  const v = learningValues(f);
  if (!v.topic) return;
  const db = await getDb();
  await db.insert(learnings).values(v);
  refresh();
}

export async function updateLearning(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  const v = learningValues(f);
  if (!id || !v.topic) return;
  const db = await getDb();
  await db.update(learnings).set(v).where(eq(learnings.id, id));
  refresh();
}

export async function deleteLearning(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  if (!id) return;
  const db = await getDb();
  await db.delete(learnings).where(eq(learnings.id, id));
  refresh();
}

// ---------- interview questions ----------
function questionValues(f: FormData) {
  const askedOn = str(f, "askedOn", 10);
  return {
    company: str(f, "company", 120),
    round: oneOf(str(f, "round", 40), INTERVIEW_ROUNDS, "Tech 1"),
    category: oneOf(str(f, "category", 40), LEARNING_CATEGORIES, "Other"),
    question: str(f, "question", 4000),
    answer: str(f, "answer", 10000),
    result: oneOf(str(f, "result", 40), QUESTION_RESULTS, "Partial"),
    askedOn: isDate(askedOn) ? askedOn : new Date().toISOString().slice(0, 10),
  };
}

export async function addQuestion(f: FormData) {
  await requireAuth();
  const v = questionValues(f);
  if (!v.company || !v.question) return;
  const db = await getDb();
  await db.insert(interviewQuestions).values(v);
  refresh();
}

export async function updateQuestion(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  const v = questionValues(f);
  if (!id || !v.company || !v.question) return;
  const db = await getDb();
  await db.update(interviewQuestions).set(v).where(eq(interviewQuestions.id, id));
  refresh();
}

export async function deleteQuestion(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  if (!id) return;
  const db = await getDb();
  await db.delete(interviewQuestions).where(eq(interviewQuestions.id, id));
  refresh();
}

// ---------- prep tracks ----------
export async function setPrepStatus(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  if (!id) return;
  const status = oneOf(str(f, "status", 20), PREP_STATUSES, "Not started");
  const db = await getDb();
  await db.update(prepTopics).set({ status }).where(eq(prepTopics.id, id));
  refresh();
}

// ---------- DSA ----------
export async function setDsaStatus(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  if (!id) return;
  const status = oneOf(str(f, "status", 20), DSA_STATUSES, "To do");
  const db = await getDb();
  await db.update(dsaProblems).set({ status }).where(eq(dsaProblems.id, id));
  refresh();
}

// ---------- scope ----------
export async function toggleScope(f: FormData) {
  await requireAuth();
  const id = int(f, "id");
  if (!id) return;
  const db = await getDb();
  await db.update(scopeItems).set({ done: f.get("done") === "true" }).where(eq(scopeItems.id, id));
  refresh();
}
