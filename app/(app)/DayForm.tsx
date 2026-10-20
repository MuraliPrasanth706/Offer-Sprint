import { saveDay } from "@/lib/actions";
import { DAY_STATUSES } from "@/lib/plan";
import type { DayLog } from "@/lib/schema";

export default function DayForm({ day, log }: { day: string; log?: DayLog }) {
  return (
    <form action={saveDay} className="form">
      <input type="hidden" name="day" value={day} />
      <div className="row">
        <div className="field">
          <label>DSA solved</label>
          <input type="number" name="dsaSolved" min={0} max={50} defaultValue={log?.dsaSolved ?? 0} />
        </div>
        <div className="field">
          <label>Apps sent</label>
          <input type="number" name="appsSent" min={0} max={50} defaultValue={log?.appsSent ?? 0} />
        </div>
        <div className="field">
          <label>Status</label>
          <select name="status" defaultValue={log?.status ?? ""}>
            <option value="">—</option>
            {DAY_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label>Notes / mistakes</label>
        <textarea name="notes" defaultValue={log?.notes ?? ""} placeholder="What went wrong, what to revisit" />
      </div>
      <div><button className="primary">Save</button></div>
    </form>
  );
}
