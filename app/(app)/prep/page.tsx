import Link from "next/link";
import { getPrep } from "@/lib/queries";
import { setPrepStatus } from "@/lib/actions";
import { PREP_STATUSES, PREP_TRACKS } from "@/lib/prep";

const SHORT: Record<string, string> = { "Not started": "To do", Learning: "Learning", Confident: "Confident" };

export default async function Prep({ searchParams }: { searchParams: Promise<{ t?: string; s?: string }> }) {
  const { t, s } = await searchParams;
  const all = await getPrep();
  const track = PREP_TRACKS.find((x) => x.track === t) ?? PREP_TRACKS[0];

  const stats = PREP_TRACKS.map((x) => {
    const items = all.filter((p) => p.track === x.track);
    const conf = items.filter((p) => p.status === "Confident").length;
    const learning = items.filter((p) => p.status === "Learning").length;
    return { ...x, total: items.length, conf, learning, pct: items.length ? Math.round((conf / items.length) * 100) : 0 };
  });
  const totalConf = stats.reduce((a, x) => a + x.conf, 0);
  const total = stats.reduce((a, x) => a + x.total, 0);
  const cur = stats.find((x) => x.track === track.track)!;
  const topics = all
    .filter((p) => p.track === track.track)
    .filter((p) => !s || p.status === s);

  const href = (tr: string, st?: string) => `/prep?t=${encodeURIComponent(tr)}${st ? `&s=${encodeURIComponent(st)}` : ""}`;

  return (
    <div className="stack" style={{ maxWidth: 900 }}>
      <div>
        <div className="eyebrow">{totalConf} / {total} topics confident</div>
        <h1>Core prep</h1>
        <p className="muted" style={{ margin: "6px 0 0" }}>React, machine coding, Node.js, Express, TypeScript and databases. Mark each topic as you go; aim for <strong>Confident</strong> on all before final rounds.</p>
      </div>

      <div className="prep-tracks">
        {stats.map((x) => (
          <Link key={x.track} href={href(x.track)} className={`prep-track ${x.track === track.track ? "on" : ""}`} aria-current={x.track === track.track ? "page" : undefined}>
            <div className="row between"><strong>{x.track}</strong><span className="mono small muted">{x.conf}/{x.total}</span></div>
            <div className="bar" style={{ marginTop: 10 }}><span style={{ width: `${x.pct}%` }} /></div>
          </Link>
        ))}
      </div>

      <section className="stack" style={{ gap: 14 }}>
        <div className="row between">
          <div>
            <h2>{track.track}</h2>
            <p className="small muted" style={{ margin: "2px 0 0" }}>{track.blurb} · {cur.learning} learning · {cur.conf} confident</p>
          </div>
          <nav className="filters" aria-label="Filter by status">
            <Link href={href(track.track)} className={!s ? "on" : ""}>All</Link>
            {PREP_STATUSES.map((st) => (
              <Link key={st} href={href(track.track, st)} className={s === st ? "on" : ""}>{SHORT[st]}</Link>
            ))}
          </nav>
        </div>

        {topics.length === 0 ? (
          <div className="empty">Nothing in this filter.</div>
        ) : (
          <ol className="prep-list">
            {topics.map((p, i) => (
              <li key={p.id} className={`prep-item s-${p.status.replace(" ", "-").toLowerCase()}`}>
                <span className="mono small muted prep-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="prep-topic">{p.topic}</span>
                <form action={setPrepStatus} className="seg" aria-label={`Status for ${p.topic}`}>
                  <input type="hidden" name="id" value={p.id} />
                  {PREP_STATUSES.map((st) => (
                    <button key={st} name="status" value={st} aria-pressed={p.status === st} className={`seg-btn seg-${st.replace(" ", "-").toLowerCase()}`}>
                      {SHORT[st]}
                    </button>
                  ))}
                </form>
              </li>
            ))}
          </ol>
        )}
        <p className="small muted" style={{ margin: 0 }}>
          Learned something on a topic? Add the notes in <Link href="/learnings" className="more">My Log</Link> under the same category.
        </p>
      </section>
    </div>
  );
}
