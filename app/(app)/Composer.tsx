"use client";

import { useRef } from "react";
import { addLearning } from "@/lib/actions";
import { LEARNING_CATEGORIES } from "@/lib/plan";

// Quick capture for the learning log. Category chips are plain radios, so it works without JS too.
export default function Composer({ today }: { today: string }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      className="card composer"
      action={async (f) => {
        await addLearning(f);
        ref.current?.reset();
      }}
    >
      <input type="hidden" name="learnedOn" value={today} />
      <label htmlFor="topic" className="sr">Topic</label>
      <input id="topic" name="topic" className="topic" required maxLength={200} autoComplete="off"
        placeholder="Topic — e.g. Sliding window: when to shrink" />
      <label htmlFor="notes" className="sr">Notes</label>
      <textarea id="notes" name="notes" className="notes" rows={3}
        placeholder="Key points, a snippet, the mistake you made, your one-line interview answer…" />
      <div className="composer-foot">
        <fieldset className="chips">
          <legend className="sr">Category</legend>
          {LEARNING_CATEGORIES.map((c, i) => (
            <label key={c} className="chip">
              <input type="radio" name="category" value={c} defaultChecked={i === 0} />
              <span>{c}</span>
            </label>
          ))}
        </fieldset>
        <button className="primary">Save to log</button>
      </div>
    </form>
  );
}
