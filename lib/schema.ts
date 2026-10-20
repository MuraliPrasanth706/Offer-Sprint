import { pgTable, serial, text, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";

// One row per plan day you've logged. Planned tasks come from lib/plan.ts.
export const dayLogs = pgTable("day_logs", {
  day: date("day").primaryKey(),
  dsaSolved: integer("dsa_solved").notNull().default(0),
  appsSent: integer("apps_sent").notNull().default(0),
  status: text("status"),
  notes: text("notes").notNull().default(""),
  tasksDone: text("tasks_done").notNull().default(""), // comma-separated indexes of ticked tasks
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  appliedOn: date("applied_on").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull().default(""),
  source: text("source").notNull().default("LinkedIn"),
  referral: boolean("referral").notNull().default(false),
  status: text("status").notNull().default("Applied"),
  nextRound: text("next_round").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const scopeItems = pgTable("scope_items", {
  id: serial("id").primaryKey(),
  area: text("area").notNull(),
  target: text("target").notNull(),
  done: boolean("done").notNull().default(false),
  position: integer("position").notNull().default(0),
});

// Your own learning log: one row per topic you learned.
export const learnings = pgTable("learnings", {
  id: serial("id").primaryKey(),
  learnedOn: date("learned_on").notNull(),
  topic: text("topic").notNull(),
  category: text("category").notNull().default("Other"),
  notes: text("notes").notNull().default(""),
  link: text("link").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Questions you were asked in real interviews, grouped by company.
export const interviewQuestions = pgTable("interview_questions", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  round: text("round").notNull().default("Tech 1"),
  category: text("category").notNull().default("Other"),
  question: text("question").notNull(),
  answer: text("answer").notNull().default(""),
  result: text("result").notNull().default("Partial"),
  askedOn: date("asked_on").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Core prep syllabus (React, Node.js, Express, TypeScript, Database).
export const prepTopics = pgTable("prep_topics", {
  id: serial("id").primaryKey(),
  track: text("track").notNull(),
  topic: text("topic").notNull(),
  status: text("status").notNull().default("Not started"),
  position: integer("position").notNull().default(0),
});

// DSA problems, grouped by pattern.
export const dsaProblems = pgTable("dsa_problems", {
  id: serial("id").primaryKey(),
  pattern: text("pattern").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  difficulty: text("difficulty").notNull(),
  status: text("status").notNull().default("To do"),
  position: integer("position").notNull().default(0),
});

export type DsaProblem = typeof dsaProblems.$inferSelect;
export type PrepTopic =typeof prepTopics.$inferSelect;
export type InterviewQuestion =typeof interviewQuestions.$inferSelect;
export type Learning =typeof learnings.$inferSelect;
export type Application =typeof applications.$inferSelect;
export type DayLog = typeof dayLogs.$inferSelect;
export type ScopeItem = typeof scopeItems.$inferSelect;
