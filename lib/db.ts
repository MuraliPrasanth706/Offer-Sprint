import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { SCOPE } from "./plan";
import { PREP_TRACKS } from "./prep";
import { DSA_PATTERNS } from "./dsa";

function url() {
  const u = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!u) throw new Error("DATABASE_URL is not set. Add the Neon integration in Vercel, or set it in .env.local.");
  return u;
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let ready: Promise<void> | null = null;

// Creates/updates tables on first use, so there's no migration step to run on deploy.
// Everything is sent as ONE batched HTTP request to Neon (a single round trip),
// instead of ~11 sequential queries on every cold start.
async function bootstrap() {
  const sql = neon(url());

  const sa: string[] = [], st: string[] = [], sp: number[] = [];
  SCOPE.forEach((x, i) => { sa.push(x.area); st.push(x.target); sp.push(i); });

  const tracks: string[] = [], topics: string[] = [], pos: number[] = [];
  PREP_TRACKS.forEach((t) => t.topics.forEach((topic, i) => { tracks.push(t.track); topics.push(topic); pos.push(i); }));

  const dp: string[] = [], dt: string[] = [], ds: string[] = [], dd: string[] = [], dpos: number[] = [];
  DSA_PATTERNS.forEach((p) => p.problems.forEach(([title, slug, diff], i) => {
    dp.push(p.pattern); dt.push(title); ds.push(slug); dd.push(diff); dpos.push(i);
  }));

  await sql.transaction([
    sql`CREATE TABLE IF NOT EXISTS day_logs (
      day date PRIMARY KEY,
      dsa_solved integer NOT NULL DEFAULT 0,
      apps_sent integer NOT NULL DEFAULT 0,
      status text,
      notes text NOT NULL DEFAULT '',
      updated_at timestamptz NOT NULL DEFAULT now()
    )`,
    sql`ALTER TABLE day_logs ADD COLUMN IF NOT EXISTS tasks_done text NOT NULL DEFAULT ''`,
    sql`CREATE TABLE IF NOT EXISTS applications (
      id serial PRIMARY KEY,
      applied_on date NOT NULL,
      company text NOT NULL,
      role text NOT NULL DEFAULT '',
      source text NOT NULL DEFAULT 'LinkedIn',
      referral boolean NOT NULL DEFAULT false,
      status text NOT NULL DEFAULT 'Applied',
      next_round text NOT NULL DEFAULT '',
      notes text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
    sql`CREATE TABLE IF NOT EXISTS scope_items (
      id serial PRIMARY KEY,
      area text NOT NULL,
      target text NOT NULL,
      done boolean NOT NULL DEFAULT false,
      position integer NOT NULL DEFAULT 0
    )`,
    sql`INSERT INTO scope_items (area, target, position)
      SELECT n.area, n.target, n.pos
      FROM unnest(${sa}::text[], ${st}::text[], ${sp}::int[]) AS n(area, target, pos)
      WHERE NOT EXISTS (SELECT 1 FROM scope_items)`,
    sql`CREATE TABLE IF NOT EXISTS learnings (
      id serial PRIMARY KEY,
      learned_on date NOT NULL,
      topic text NOT NULL,
      category text NOT NULL DEFAULT 'Other',
      notes text NOT NULL DEFAULT '',
      link text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
    sql`CREATE TABLE IF NOT EXISTS interview_questions (
      id serial PRIMARY KEY,
      company text NOT NULL,
      round text NOT NULL DEFAULT 'Tech 1',
      category text NOT NULL DEFAULT 'Other',
      question text NOT NULL,
      answer text NOT NULL DEFAULT '',
      result text NOT NULL DEFAULT 'Partial',
      asked_on date NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
    sql`CREATE TABLE IF NOT EXISTS prep_topics (
      id serial PRIMARY KEY,
      track text NOT NULL,
      topic text NOT NULL,
      status text NOT NULL DEFAULT 'Not started',
      position integer NOT NULL DEFAULT 0
    )`,
    // Add any syllabus topic not in the DB yet (statuses you set are never touched).
    sql`INSERT INTO prep_topics (track, topic, position)
      SELECT n.track, n.topic, n.pos
      FROM unnest(${tracks}::text[], ${topics}::text[], ${pos}::int[]) AS n(track, topic, pos)
      WHERE NOT EXISTS (SELECT 1 FROM prep_topics p WHERE p.track = n.track AND p.topic = n.topic)`,
    sql`CREATE TABLE IF NOT EXISTS dsa_problems (
      id serial PRIMARY KEY,
      pattern text NOT NULL,
      title text NOT NULL,
      slug text NOT NULL,
      difficulty text NOT NULL,
      status text NOT NULL DEFAULT 'To do',
      position integer NOT NULL DEFAULT 0
    )`,
    sql`INSERT INTO dsa_problems (pattern, title, slug, difficulty, position)
      SELECT n.pattern, n.title, n.slug, n.diff, n.pos
      FROM unnest(${dp}::text[], ${dt}::text[], ${ds}::text[], ${dd}::text[], ${dpos}::int[]) AS n(pattern, title, slug, diff, pos)
      WHERE NOT EXISTS (SELECT 1 FROM dsa_problems d WHERE d.pattern = n.pattern AND d.slug = n.slug)`,
  ]);
}

export async function getDb() {
  if (!_db) _db = drizzle(neon(url()), { schema });
  if (!ready) ready = bootstrap().catch((e) => { ready = null; throw e; });
  await ready;
  return _db;
}
