import { getDayLogs } from "@/lib/queries";
import { allPlanDays, fmt, plannedFor, todayIST } from "@/lib/plan";
import DayForm from "../DayForm";

export default async function Days() {
  const logs = await getDayLogs();
  const today = todayIST();
  return (
    <div className="stack">
      <div>
        <h1>Daily plan</h1>
        <p className="muted small">Tap a day to see its plan and log it.</p>
      </div>
      {allPlanDays().map((d) => {
        const p = plannedFor(d);
        const l = logs.get(d);
        return (
          <details key={d} className={`card ${p.type === "Weekend" ? "weekend" : ""} ${d === today ? "today" : ""}`} open={d === today}>
            <summary className="row" style={{ cursor: "pointer", justifyContent: "space-between" }}>
              <span><strong>{fmt(d)}</strong> <span className="muted small">· Week {p.week} · {p.type}</span></span>
              <span className="row small">
                {l ? <span className="muted">DSA {l.dsaSolved} · Apps {l.appsSent}</span> : null}
                {l?.status ? <span className={`pill ${l.status}`}>{l.status}</span> : null}
              </span>
            </summary>
            <div className="day" style={{ marginTop: 12 }}>
              <ul className="plain">{p.tasks.map((t) => <li key={t}>{t}</li>)}</ul>
              <DayForm day={d} log={l} />
            </div>
          </details>
        );
      })}
    </div>
  );
}
