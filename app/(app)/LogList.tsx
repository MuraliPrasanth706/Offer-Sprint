import Link from "next/link";
import { LEARNING_CATEGORIES } from "@/lib/plan";
import type { Learning } from "@/lib/schema";

function short(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
}

// Search + category filters + entries. Used on Today (limited) and My Log (full, editable).
export function LogHeader({ base, all, c, q, title }: { base: string; all: Learning[]; c?: string; q?: string; title: string }) {
  const counts = new Map<string, number>();
  for (const l of all) counts.set(l.category, (counts.get(l.category) ?? 0) + 1);
  const href = (cat?: string) => {
    const p = new URLSearchParams();
    if (cat) p.set("c", cat);
    if (q) p.set("q", q);
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };
  return (
    <>
      <div className="row between">
        <h2>{title} <span className="muted" style={{ fontWeight: 500 }}>· {all.length} topics</span></h2>
        <form className="search" action={base} role="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ color: "var(--faint)" }}>
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
          </svg>
          {c ? <input type="hidden" name="c" value={c} /> : null}
          <label htmlFor={`q-${base}`} className="sr">Search your log</label>
          <input id={`q-${base}`} name="q" defaultValue={q} placeholder="Search your log" />
        </form>
      </div>
      {all.length > 0 ? (
        <nav className="filters" aria-label="Filter by category">
          <Link href={href()} className={!c ? "on" : ""}>All</Link>
          {LEARNING_CATEGORIES.filter((k) => counts.get(k)).map((k) => (
            <Link key={k} href={href(k)} className={c === k ? "on" : ""}>{k} · {counts.get(k)}</Link>
          ))}
        </nav>
      ) : null}
    </>
  );
}

export function filterLog(all: Learning[], c?: string, q?: string) {
  const query = (q ?? "").trim().toLowerCase();
  return all.filter((l) =>
    (!c || l.category === c) &&
    (!query || l.topic.toLowerCase().includes(query) || l.notes.toLowerCase().includes(query)));
}

export function Entry({ l, clamp, children }: { l: Learning; clamp?: boolean; children?: React.ReactNode }) {
  return (
    <li className="entry">
      <div className="entry-date">{short(l.learnedOn)}</div>
      <div className="entry-body">
        <div className="entry-head">
          <h3 className="entry-title">{l.topic}</h3>
          <span className="tag">{l.category}</span>
        </div>
        {l.notes ? <p className={`entry-notes ${clamp ? "clamp" : ""}`}>{l.notes}</p> : null}
        {l.link ? <a className="small" href={l.link} target="_blank" rel="noreferrer" style={{ color: "var(--accent-text)", wordBreak: "break-all" }}>{l.link}</a> : null}
        {children}
      </div>
    </li>
  );
}
