import Link from "next/link";
import { getLearnings, getStats } from "@/lib/queries";
import { toggleTask } from "@/lib/actions";
import { PLAN_END, PLAN_START, WEEKS, fmt, plannedFor, todayIST } from "@/lib/plan";
import Composer from "./Composer";
import DayForm from "./DayForm";
import { Entry, LogHeader, filterLog } from "./LogList";

const SHOW = 10;

function pct(a: number, b: number) {
  return b ? `${Math.min(100, Math.round((a / b) * 100))}%` : "0%";
}

export default async function Today({ searchParams }: { searchParams: Promise<{ c?: string; q?: string }> }) {
  const { c, q } = await searchParams;
  const [s, all] = await Promise.all([getStats(), getLearnings()]);
  const raw = todayIST();
  const today = raw < PLAN_START ? PLAN_START : raw > PLAN_END ? PLAN_END : raw;
  const plan = plannedFor(today);
  const week = WEEKS[plan.week - 1];
  const log = s.logs.get(today);
  const done = new Set((log?.tasksDone ?? "").split(",").filter(Boolean).map(Number));
  const shown = filterLog(all, c, q);
  const progress = [
    { label: "Core prep (confident)", value: `${s.prepConf} / ${s.prepTotal}`, w: pct(s.prepConf, s.prepTotal) },
    { label: "DSA solved", value: `${s.dsaSolved} / ${s.dsaTotal}`, w: pct(s.dsaSolved, s.dsaTotal) },
    { label: "Applications", value: `${s.sent} / ${s.appsTarget}`, w: pct(s.sent, s.appsTarget) },
  ];

  return (
    <div className="focus">
      <section className="focus-main" aria-labelledby="log-h">
        <div>
          <div className="eyebrow">{fmt(today)} · Week {plan.week}</div>
          <h1 id="log-h">What did you learn today?</h1>
        </div>

        <Composer today={today} />

        <div className="stack" style={{ gap: 14 }}>
          <LogHeader base="/" all={all} c={c} q={q} title="My log" />
          {shown.length === 0 ? (
            <div className="empty">
              {all.length ? "Nothing matches this filter." : "Nothing here yet. Write the first thing you learned today."}
            </div>
          ) : (
            <ol className="log">
              {shown.slice(0, SHOW).map((l) => <Entry key={l.id} l={l} clamp />)}
            </ol>
          )}
          {shown.length > 0 ? (
            <Link href="/learnings" className="more">
              {shown.length > SHOW ? `See all ${shown.length} →` : "Open My Log to edit →"}
            </Link>
          ) : null}
        </div>
      </section>

      <aside className="focus-side" aria-label="Today's focus and progress">
        <section className="card">
          <div className="row between" style={{ marginBottom: 10, alignItems: "baseline" }}>
            <h2 style={{ fontSize: 15 }}>Today&apos;s focus</h2>
            <span className="mono small muted">{done.size}/{plan.tasks.length} · {plan.type === "Weekend" ? "~7 hrs" : "1.5 hrs"}</span>
          </div>
          <ul className="tasks-list">
            {plan.tasks.map((t, i) => (
              <li key={i}>
                <form action={toggleTask}>
                  <input type="hidden" name="day" value={today} />
                  <input type="hidden" name="idx" value={i} />
                  <button className="task" aria-pressed={done.has(i)}>
                    <span className="box" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                    </span>
                    <span className="task-text">{t}</span>
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>

        <section className="quiet">
          <h2 className="label-caps">Progress</h2>
          <div className="stack" style={{ gap: 14 }}>
            {progress.map((p) => (
              <div key={p.label}>
                <div className="prog-row"><span>{p.label}</span><span>{p.value}</span></div>
                <div className="bar"><span style={{ width: p.w }} /></div>
              </div>
            ))}
          </div>
        </section>

        <details className="card drawer">
          <summary>Log today&apos;s numbers</summary>
          <div style={{ marginTop: 14 }}>
            <DayForm day={today} log={log} />
          </div>
        </details>

        <section className="week-note">
          <strong>This week</strong>
          <span>DSA: {week.dsa}</span>
          <span>{week.design}</span>
        </section>
      </aside>
    </div>
  );
}
