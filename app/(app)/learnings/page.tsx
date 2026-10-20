import { getLearnings } from "@/lib/queries";
import { deleteLearning, updateLearning } from "@/lib/actions";
import { LEARNING_CATEGORIES, todayIST } from "@/lib/plan";
import Composer from "../Composer";
import { Entry, LogHeader, filterLog } from "../LogList";

export default async function Learnings({ searchParams }: { searchParams: Promise<{ c?: string; q?: string }> }) {
  const { c, q } = await searchParams;
  const all = await getLearnings();
  const items = filterLog(all, c, q);

  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <div>
        <div className="eyebrow">Revise every Saturday</div>
        <h1>My Log</h1>
      </div>

      <Composer today={todayIST()} />

      <div className="stack" style={{ gap: 14 }}>
        <LogHeader base="/learnings" all={all} c={c} q={q} title="All topics" />
        {items.length === 0 ? (
          <div className="empty">{all.length ? "Nothing matches this filter." : "No topics yet. Add the first thing you learned today."}</div>
        ) : (
          <ol className="log">
            {items.map((l) => (
              <Entry key={l.id} l={l}>
                <details className="drawer" style={{ marginTop: 4 }}>
                  <summary className="small muted" style={{ fontWeight: 500 }}>Edit</summary>
                  <form action={updateLearning} className="form" style={{ marginTop: 10 }}>
                    <input type="hidden" name="id" value={l.id} />
                    <div className="field"><label htmlFor={`t${l.id}`}>Topic</label><input id={`t${l.id}`} name="topic" required defaultValue={l.topic} /></div>
                    <div className="row">
                      <div className="field"><label htmlFor={`c${l.id}`}>Category</label>
                        <select id={`c${l.id}`} name="category" defaultValue={l.category}>{LEARNING_CATEGORIES.map((k) => <option key={k}>{k}</option>)}</select>
                      </div>
                      <div className="field"><label htmlFor={`d${l.id}`}>Date</label><input id={`d${l.id}`} type="date" name="learnedOn" defaultValue={l.learnedOn} /></div>
                    </div>
                    <div className="field"><label htmlFor={`n${l.id}`}>Notes</label><textarea id={`n${l.id}`} name="notes" rows={5} defaultValue={l.notes} /></div>
                    <div className="field"><label htmlFor={`l${l.id}`}>Link</label><input id={`l${l.id}`} name="link" type="url" defaultValue={l.link} placeholder="https://…" /></div>
                    <div className="row">
                      <button className="primary">Save</button>
                      <button className="link" formAction={deleteLearning}>Delete</button>
                    </div>
                  </form>
                </details>
              </Entry>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
