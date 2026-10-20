"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null as { error?: string } | null);
  return (
    <main className="login">
      <form action={action} className="card form">
        <div>
          <h1>Offer Sprint</h1>
          <p className="muted small">Oct 20 → Dec 20, 2026</p>
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoFocus required autoComplete="current-password" />
        </div>
        {state?.error && <p className="error">{state.error}</p>}
        <button className="primary" disabled={pending}>{pending ? "Checking…" : "Log in"}</button>
      </form>
    </main>
  );
}
