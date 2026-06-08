import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { AnkiSession } from "./client";

// Sessions are cached in Workers KV (key: `session:<key>`) instead of an
// in-memory Map. The Workers runtime can serve each request from a different
// isolate, so an in-memory map would effectively force a fresh AnkiWeb login on
// every request. KV persistence lets us reuse a session cookie until it expires.
function kv() {
  return getCloudflareContext().env.KV;
}

function sessionKey(key: string): string {
  return `session:${key}`;
}

export async function getCachedSession(
  key: string
): Promise<AnkiSession | undefined> {
  const raw = await kv().get(sessionKey(key));
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as AnkiSession;
  } catch {
    return undefined;
  }
}

export async function setCachedSession(
  key: string,
  session: AnkiSession
): Promise<void> {
  await kv().put(sessionKey(key), JSON.stringify(session));
}

export async function clearCachedSession(key: string): Promise<void> {
  await kv().delete(sessionKey(key));
}
