import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Minimal, dependency-free session auth for the admin dashboard.
 * Credentials come from env (ADMIN_USER / ADMIN_PASSWORD), sessions are
 * HMAC-signed tokens stored in an httpOnly cookie. No database needed.
 */

export const SESSION_COOKIE = "mb_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  return process.env.AUTH_SECRET || "insecure-dev-secret-change-me";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export interface SessionPayload {
  user: string;
  exp: number; // expiry as ms epoch
}

export function createSessionToken(user: string): string {
  const payload: SessionPayload = { user, exp: Date.now() + SESSION_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Constant-time credential check against env vars. */
export function checkCredentials(user: string, password: string): boolean {
  const envUser = process.env.ADMIN_USER || "admin";
  const envPass = process.env.ADMIN_PASSWORD || "";
  if (!envPass) return false; // refuse login if no password is configured
  const a = Buffer.from(user);
  const b = Buffer.from(envUser);
  const p = Buffer.from(password);
  const q = Buffer.from(envPass);
  const userOk = a.length === b.length && crypto.timingSafeEqual(a, b);
  const passOk = p.length === q.length && crypto.timingSafeEqual(p, q);
  return userOk && passOk;
}

export function getSession(): SessionPayload | null {
  const store = cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
