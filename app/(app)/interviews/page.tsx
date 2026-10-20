import Link from "next/link";
import { getApplications, getQuestions } from "@/lib/queries";
import { addQuestion, deleteQuestion, updateQuestion } from "@/lib/actions";
import { INTERVIEW_ROUNDS, LEARNING_CATEGORIES, QUESTION_RESULTS, todayIST } from "@/lib/plan";
import type { InterviewQuestion } from "@/lib/schema";

type SP = { co?: string; r?: string; q?: string };

const RESULT_CLASS: Record<string, string> = { "Nailed it": "Done", Partial: "Partial", "Couldn't answer": "Skipped" };

function short(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
}

function Fields({ x, companies }: { x?: InterviewQuestion; companies: string[] }) {
  const id = x ? `-${x.id}` : "";
  return (
    <>
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div className="field" style={{ flex: "1 1 200px" }}>
          <label htmlFor={`co${id}`}>Company</label>
          <input id={`co${id}`} name="company" required list="companies" defaultValue={x?.company} placeholder="e.g. Freshworks" autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor={`r${id}`}>Round</label>
          <select id={`r${id}`} name="round" defaultValue={x?.round ?? "Tech 1"}>{INTERVIEW_ROUNDS.map((k) => <option key={k}>{k}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor={`c${id}`}>Topic</label>
          <select id={`c${id}`} name="category" defaultValue={x?.category ?? "DSA"}>{LEARNING_CATEGORIES.map((k) => <option key={k}>{k}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor={`d${id}`}>Date</label>
          <input id={`d${id}`} type="date" name="askedOn" defaultValue={x?.askedOn ?? todayIST()} />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`qq${id}`}>Question asked</label>
        <textarea id={`qq${id}`} name="question" required rows={2} defaultValue={x?.question} placeholder="e.g. Design a rate limiter for a multi-tenant API" />
      </div>
      <div className="field">
        <label htmlFor={`a${id}`}>My answer / what I should have said</label>
        <textarea id={`a${id}`} name="answer" rows={4} defaultValue={x?.answer} placeholder="Your answer, the follow-ups, the better answer you found later…" />
      </div>
      <fieldset className="chips">
        <legend className="field" style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 6, padding: 0 }}>How did it go?</legend>
        {QUESTION_RESULTS.map((k) => (
          <label key={k} className="chip">
            <input type="radio" name="result" value={k} defaultChecked={(x?.result ?? "Partial") === k} />
            <span>{k}</span>
          </label>
        ))}
      </fieldset>
    </>
  );
}

export default async function Interviews({ searchParams }: { searchParams: Promise<SP> }) {
  const { co, r, q } = await searchParams;
  const [all, apps] = await Promise.all([getQuestions(), getApplications()]);
  const companies = [...new Set([...all.map((x) => x.company), ...apps.map((a) => a.company)])].sort((a, b) => a.localeCompare(b));

  const query = (q ?? "").trim().toLowerCase();
  const items = all.filter((x) =>
    (!co || x.company === co) &&
    (r !== "revise" || x.result !== "Nailed it") &&
    (!query || x.question.toLowerCase().includes(query) || x.answer.toLowerCase().includes(query)));

  // group by company, companies with the latest question first
  const groups = new Map<string, InterviewQuestion[]>();
  for (const x of items) {
    if (!groups.has(x.company)) groups.set(x.company, []);
    groups.get(x.company)!.push(x);
  }
  const perCompany = new Map<string, number>();
  for (const x of all) perCompany.set(x.company, (perCompany.get(x.company) ?? 0) + 1);
  const toRevise = all.filter((x) => x.result !== "Nailed it").length;

  const href = (p: SP) => {
    const s = new URLSearchParams();
    if (p.co) s.set("co", p.co);
    if (p.r) s.set("r", p.r);
    if (q) s.set("q", q);
    const str = s.toString();
    return str ? `/interviews?${str}` : "/interviews";
  };

  return (
    <div className="stack" style={{ maxWidth: 860 }}>
      <datalist id="companies">{companies.map((c) => <option key={c} value={c} />)}</datalist>

      <div>
        <div className="eyebrow">{all.length} questions · {perCompany.size} companies · {toRevise} to revise</div>
        <h1>Interview questions</h1>
      </div>

      <details className="card drawer" open={all.length === 0}>
        <summary>Add a question you were asked</summary>
        <form action={addQuestion} className="form" style={{ marginTop: 14 }}>
          <Fields companies={companies} />
          <div><button className="primary">Save question</button></div>
        </form>
      </details>

      {all.length > 0 ? (
        <div className="stack" style={{ gap: 12 }}>
          <div className="row between">
            <nav className="filters" aria-label="Show">
              <Link href={href({ co })} className={r !== "revise" ? "on" : ""}>All</Link>
              <Link href={href({ co, r: "revise" })} className={r === "revise" ? "on" : ""}>Needs revision · {toRevise}</Link>
            </nav>
            <form className="search" action="/interviews" role="search">
              {co ? <input type="hidden" name="co" value={co} /> : null}
              {r ? <input type="hidden" name="r" value={r} /> : null}
              <label htmlFor="iq" className="sr">Search questions</label>
              <input id="iq" name="q" defaultValue={q} placeholder="Search questions" />
            </form>
          </div>
          <nav className="filters" aria-label="Company">
            <Link href={href({ r })} className={!co ? "on" : ""}>All companies</Link>
            {[...perCompany.keys()].sort((a, b) => a.localeCompare(b)).map((c) => (
              <Link key={c} href={href({ co: c, r })} className={co === c ? "on" : ""}>{c} · {perCompany.get(c)}</Link>
            ))}
          </nav>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="empty">{all.length ? "Nothing matches this filter." : "No questions yet. After each round, write down every question while it's fresh."}</div>
      ) : (
        [...groups.entries()].map(([company, qs]) => (
          <section key={company} className="stack" style={{ gap: 10 }}>
            <h2>{company} <span className="muted" style={{ fontWeight: 500 }}>· {qs.length}</span></h2>
            <ol className="log">
              {qs.map((x) => (
                <li key={x.id} className="entry">
                  <div className="entry-date">{short(x.askedOn)}</div>
                  <div className="entry-body">
                    <div className="entry-head">
                      <h3 className="entry-title" style={{ whiteSpace: "pre-wrap" }}>{x.question}</h3>
                      <span className={`pill ${RESULT_CLASS[x.result] ?? ""}`}>{x.result}</span>
                    </div>
                    <div className="row small muted" style={{ gap: 6 }}>
                      <span className="tag">{x.round}</span>
                      <span className="tag">{x.category}</span>
                    </div>
                    {x.answer ? <p className="entry-notes">{x.answer}</p> : null}
                    <details className="drawer" style={{ marginTop: 4 }}>
                      <summary className="small muted" style={{ fontWeight: 500 }}>Edit</summary>
                      <form action={updateQuestion} className="form" style={{ marginTop: 10 }}>
                        <input type="hidden" name="id" value={x.id} />
                        <Fields x={x} companies={companies} />
                        <div className="row">
                          <button className="primary">Save</button>
                          <button className="link" formAction={deleteQuestion}>Delete</button>
                        </div>
                      </form>
                    </details>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}
