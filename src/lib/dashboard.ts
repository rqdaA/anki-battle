import { getCloudflareContext } from "@opennextjs/cloudflare";
import { loadConfig, getUserKeys } from "@/lib/config";
import { loadAllSnapshots } from "@/lib/snapshot";
import { fetchAllUsers } from "@/lib/anki/orchestrator";
import { rankUsers } from "@/lib/scoring";
import type { RankedUser } from "@/types";

const LAST_FETCH_KEY = "meta:lastFetch";
const LOCK_KEY = "lock:fetch";
const LOCK_TTL_SECONDS = 120;

export interface DashboardData {
  ranked: RankedUser[];
  lastUpdated: number | null;
}

// Refresh strategy: stale-while-revalidate.
//   - KV empty (cold start): fetch synchronously so the first load shows data.
//   - data present but older than fetch_interval_minutes: serve the cached
//     data immediately and refresh in the background via ctx.waitUntil.
//   - data fresh: serve the cached data as-is.
export async function getDashboardData(): Promise<DashboardData> {
  const { env, ctx } = getCloudflareContext();
  const keys = getUserKeys();
  const intervalMs =
    (loadConfig().anki.fetch_interval_minutes || 10) * 60_000;

  const lastFetch = await env.KV.get(LAST_FETCH_KEY);
  const isStale =
    !lastFetch || Date.now() - Date.parse(lastFetch) > intervalMs;

  let snapshots = await loadAllSnapshots(keys);

  if (snapshots.length === 0) {
    await refreshWithLock();
    snapshots = await loadAllSnapshots(keys);
  } else if (isStale) {
    ctx.waitUntil(refreshWithLock());
  }

  const ranked = rankUsers(snapshots);
  const lastUpdated =
    snapshots.length > 0
      ? Math.max(...snapshots.map((s) => new Date(s.timestamp).getTime()))
      : null;

  return { ranked, lastUpdated };
}

// Fetches every user's deck data and writes it to KV. A short-lived KV lock
// keeps concurrent visits from triggering overlapping refreshes (and overlapping
// AnkiWeb logins). KV is eventually consistent, so the lock is best-effort.
async function refreshWithLock(): Promise<void> {
  const { env } = getCloudflareContext();

  if (await env.KV.get(LOCK_KEY)) return;
  await env.KV.put(LOCK_KEY, "1", { expirationTtl: LOCK_TTL_SECONDS });

  try {
    await fetchAllUsers();
    await env.KV.put(LAST_FETCH_KEY, new Date().toISOString());
  } finally {
    await env.KV.delete(LOCK_KEY);
  }
}
