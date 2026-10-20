import { getApplications } from "@/lib/queries";
import { addApplication, deleteApplication, updateApplication } from "@/lib/actions";
import { APP_SOURCES, APP_STATUSES, todayIST } from "@/lib/plan";
import type { Application } from "@/lib/schema";

function Fields({ a }: { a?: Application }) {
  return (
    <>
      <div className="field"><label>Date</label><input type="date" name="appliedOn" defaultValue={a?.appliedOn ?? todayIST()} /></div>
      <div className="field"><label>Company</label><input name="company" required defaultValue={a?.company} placeholder="Company" /></div>
      <div className="field"><label>Role</label><input name="role" defaultValue={a?.role} placeholder="SDE-2 Backend" /></div>
      <div className="field"><label>Source</label>
        <select name="source" defaultValue={a?.source ?? "LinkedIn"}>{APP_SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="field"><label>Status</label>
        <select name="status" defaultValue={a?.status ?? "Applied"}>{APP_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="field"><label>Next round</label><input name="nextRound" defaultValue={a?.nextRound} placeholder="Tech 2 · Nov 12" /></div>
      <label className="row small"><input type="checkbox" name="referral" defaultChecked={a?.referral} /> Referral</label>
    </>
  );
}

export default async function Applications() {
  const apps = await getApplications();
  const count = (s: string) => apps.filter((a) => a.status === s).length;

  return (
    <div className="stack">
      <div>
        <h1>Applications</h1>
        <p className="muted small">
          {apps.length} total · {count("Interviewing") + count("Screening")} in process · {count("Offer")} offers · {count("Rejected")} rejected
        </p>
      </div>

      <section className="card">
        <h2>Add</h2>
        <form action={addApplication} className="form">
          <div className="row"><Fields /></div>
          <div className="field"><label>Notes</label><textarea name="notes" placeholder="Recruiter, CTC discussed, prep notes" /></div>
          <div><button className="primary">Add application</button></div>
        </form>
      </section>

      {apps.length === 0 ? (
        <p className="muted">No applications yet. Add your first one above.</p>
      ) : (
        apps.map((a) => (
          <details key={a.id} className="card">
            <summary className="row" style={{ cursor: "pointer", justifyContent: "space-between" }}>
              <span><strong>{a.company}</strong> <span className="muted small">· {a.role || "—"} · {a.source}{a.referral ? " · referral" : ""}</span></span>
              <span className="row small">
                {a.nextRound ? <span className="muted">{a.nextRound}</span> : null}
                <span className={`pill ${a.status.replace(" ", "")}`}>{a.status}</span>
              </span>
            </summary>
            <form action={updateApplication} className="form" style={{ marginTop: 12 }}>
              <input type="hidden" name="id" value={a.id} />
              <div className="row"><Fields a={a} /></div>
              <div className="field"><label>Notes</label><textarea name="notes" defaultValue={a.notes} /></div>
              <div className="row">
                <button className="primary">Save</button>
                <button className="link" formAction={deleteApplication}>Delete</button>
              </div>
            </form>
          </details>
        ))
      )}
    </div>
  );
}
