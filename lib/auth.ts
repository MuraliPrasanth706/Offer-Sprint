import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "os_session";
const MAX_AGE = 60 * 60 * 24 * 60; // 60 days, covers the whole sprint

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set.");
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function token() {
  // Changing APP_PASSWORD logs out every existing session.
  return sign("v1:" + (process.env.APP_PASSWORD ?? ""));
}

export function checkPassword(input: string) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) throw new Error("APP_PASSWORD is not set.");
  const a = Buffer.from(sign("pw:" + input));
  const b = Buffer.from(sign("pw:" + expected));
  return timingSafeEqual(a, b);
}

export async function startSession() {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthed() {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const t = token();
  return v.length === t.length && timingSafeEqual(Buffer.from(v), Buffer.from(t));
}

export async function requireAuth() {
  if (!(await isAuthed())) redirect("/login");
}
