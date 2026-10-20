import { getScope } from "@/lib/queries";
import { toggleScope } from "@/lib/actions";
import { RULES, WEEKS } from "@/lib/plan";

const weekday = [
  ["60 min", "DSA: 2 problems (1 new + 1 revisit)"],
  ["20 min", "Theory: 1 small topic (event loop, indexing, JWT…)"],
  ["10 min", "Applications: 3–5/day + referral messages (do on phone)"],
];
const weekend = [
  ["2 hrs", "DSA: new pattern + 4 problems", "DSA: timed (2 in 45 min)"],
  ["2 hrs", "System design (1 HLD)", "LLD or backend deep dive"],
  ["1.5 hrs", "Backend core (DB/Node/Spring)", "Mock interview"],
  ["1 hr", "Review week's mistakes", "Resume/project story + bulk apply"],
];

export default async function Plan() {
  const scope = await getScope();
  return (
    <div className="stack">
      <h1>Plan</h1>

      <section className="card">
        <h2>Scope ({scope.filter((s) => s.done).length}/{scope.length})</h2>
        <table>
          <tbody>
            {scope.map((s) => (
              <tr key={s.id}>
                <td style={{ width: 40 }}>
                  <form action={toggleScope}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="done" value={String(!s.done)} />
                    <button aria-label={s.done ? "Mark not done" : "Mark done"}>{s.done ? "✓" : "○"}</button>
                  </form>
                </td>
                <td className="muted" style={{ width: 110 }}>{s.area}</td>
                <td style={{ textDecoration: s.done ? "line-through" : "none" }}>{s.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid two">
        <section className="card scroll">
          <h2>Weekday (1.5 hrs)</h2>
          <table><tbody>{weekday.map(([t, d]) => <tr key={d}><td style={{ width: 80 }}>{t}</td><td>{d}</td></tr>)}</tbody></table>
        </section>
        <section className="card scroll">
          <h2>Weekend (~7 hrs/day)</h2>
          <table>
            <thead><tr><th>Block</th><th>Sat</th><th>Sun</th></tr></thead>
            <tbody>{weekend.map(([t, a, b]) => <tr key={a}><td>{t}</td><td>{a}</td><td>{b}</td></tr>)}</tbody>
          </table>
        </section>
      </div>

      <section className="card scroll">
        <h2>8 weeks</h2>
        <table>
          <thead><tr><th>Wk</th><th>Dates</th><th>DSA</th><th>Design / Backend</th></tr></thead>
          <tbody>{WEEKS.map((w) => <tr key={w.week}><td>{w.week}</td><td>{w.dates}</td><td>{w.dsa}</td><td>{w.design}</td></tr>)}</tbody>
        </table>
      </section>

      <section className="card">
        <h2>Rules</h2>
        <ol className="plain">{RULES.map((r) => <li key={r}>{r}</li>)}</ol>
      </section>
    </div>
  );
}
