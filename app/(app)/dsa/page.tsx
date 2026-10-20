import Link from "next/link";
import { getDsa } from "@/lib/queries";
import { setDsaStatus } from "@/lib/actions";
import { DSA_PATTERNS, DSA_STATUSES } from "@/lib/dsa";

const DIFF: Record<string, string> = { E: "Easy", M: "Medium", H: "Hard" };
const cls = (s: string) => s.replace(" ", "-").toLowerCase();

export default async function Dsa({ searchParams }: { searchParams: Promise<{ p?: string; view?: string }> }) {
  const { p, view } = await searchParams;
  const all = await getDsa();
  const reviseMode = view === "revise";
  const pat = DSA_PATTERNS.find((x) => x.pattern === p) ?? DSA_PATTERNS[0];

  const stats = DSA_PATTERNS.map((x) => {
    const rows = all.filter((d) => d.pattern === x.pattern);
    const solved = rows.filter((d) => d.status !== "To do").length;
    return { pattern: x.pattern, week: x.week, total: rows.length, solved, pct: rows.length ? Math.round((solved / rows.length) * 100) : 0 };
  });
  const solved = all.filter((d) => d.status !== "To do").length;
  const revise = all.filter((d) => d.status === "Revise");
  const rows = reviseMode ? revise : all.filter((d) => d.pattern === pat.pattern);
  const cur = stats.find((x) => x.pattern === pat.pattern)!;

  return (
    <div className="stack">
      <div className="row between" style={{ alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow">{solved} / {all.length} solved · {revise.length} to revise</div>
          <h1>DSA by pattern</h1>
          <p className="muted" style={{ margin: "6px 0 0" }}>Learn the pattern first, then solve its problems. Mark <strong>Revise</strong> when you needed a hint.</p>
        </div>
        <nav className="filters" aria-label="View">
          <Link href={`/dsa?p=${encodeURIComponent(pat.pattern)}`} className={!reviseMode ? "on" : ""}>Patterns</Link>
          <Link href="/dsa?view=revise" className={reviseMode ? "on" : ""}>Revise list · {revise.length}</Link>
        </nav>
      </div>

      <div className="dsa-wrap">
        <nav className="dsa-pats" aria-label="Patterns">
          {stats.map((x, i) => {
            const on = !reviseMode && x.pattern === pat.pattern;
            return (
              <Link key={x.pattern} href={`/dsa?p=${encodeURIComponent(x.pattern)}`} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
                <span className="row between" style={{ gap: 8, flexWrap: "nowrap" }}>
                  <span><span className="mono small muted">{String(i + 1).padStart(2, "0")}</span> {x.pattern}</span>
                  <span className="mono small muted">{x.solved}/{x.total}</span>
                </span>
                <span className="bar"><span style={{ width: `${x.pct}%` }} /></span>
              </Link>
            );
          })}
        </nav>

        <section className="dsa-main">
          {reviseMode ? (
            <div>
              <h2>Revise list</h2>
              <p className="small muted" style={{ margin: "4px 0 0" }}>Problems you solved with help. Redo them without looking, then mark Solved.</p>
            </div>
          ) : (
            <>
              <div>
                <div className="eyebrow">Plan week {pat.week} · {cur.solved}/{cur.total} solved</div>
                <h2 style={{ fontSize: 22 }}>{pat.pattern}</h2>
              </div>
              <div className="dsa-info">
                <div className="card"><h3 className="label-caps">Key idea</h3>{pat.idea}</div>
                <div className="card"><h3 className="label-caps">Use it when you see</h3>{pat.signals}</div>
              </div>
            </>
          )}

          {rows.length === 0 ? (
            <div className="empty">{reviseMode ? "Nothing to revise. Nice." : "No problems here."}</div>
          ) : (
            <ol className="prep-list">
              {rows.map((d, i) => (
                <li key={d.id} className={`prep-item s-${cls(d.status)}`}>
                  <span className="mono small muted prep-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`diff diff-${d.difficulty}`} title={DIFF[d.difficulty]}>{DIFF[d.difficulty]}</span>
                  <span className="dsa-title">
                    <a href={`https://leetcode.com/problems/${d.slug}/`} target="_blank" rel="noreferrer">{d.title}</a>
                    {reviseMode ? <span className="small muted"> · {d.pattern}</span> : null}
                  </span>
                  <form action={setDsaStatus} className="seg" aria-label={`Status for ${d.title}`}>
                    <input type="hidden" name="id" value={d.id} />
                    {DSA_STATUSES.map((st) => (
                      <button key={st} name="status" value={st} aria-pressed={d.status === st} className={`seg-btn seg-${cls(st)}`}>{st}</button>
                    ))}
                  </form>
                </li>
              ))}
            </ol>
          )}
          <p className="small muted" style={{ margin: 0 }}>
            Problem titles open on LeetCode. Write the trick you learned in <Link href="/learnings" className="more">My Log</Link> under DSA.
          </p>
        </section>
      </div>
    </div>
  );
}
