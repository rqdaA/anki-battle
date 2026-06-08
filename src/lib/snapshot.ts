import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { UserSnapshot } from "@/types";

// Snapshots are stored in Workers KV (key: `snapshot:<userKey>`) instead of the
// filesystem, since the Workers runtime has no `fs`. All functions are async.
function kv() {
  return getCloudflareContext().env.KV;
}

function snapshotKey(userKey: string): string {
  return `snapshot:${userKey}`;
}

export async function saveSnapshot(
  userKey: string,
  snapshot: UserSnapshot
): Promise<void> {
  await kv().put(snapshotKey(userKey), JSON.stringify(snapshot));
}

export async function loadSnapshot(
  userKey: string
): Promise<UserSnapshot | null> {
  const raw = await kv().get(snapshotKey(userKey));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSnapshot;
  } catch {
    return null;
  }
}

export async function loadAllSnapshots(
  userKeys: string[]
): Promise<UserSnapshot[]> {
  const snapshots = await Promise.all(userKeys.map((key) => loadSnapshot(key)));
  return snapshots.filter((s): s is UserSnapshot => s !== null);
}
