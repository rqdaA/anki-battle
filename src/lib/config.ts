import type { AppConfig } from "@/types";
import { credentials } from "./credentials";

// Configuration is hardcoded in `credentials.ts` (gitignored). On the Workers
// runtime there is no filesystem, so the previous toml-on-disk approach is
// replaced by a plain imported module. The function signatures are kept stable
// so callers don't need to change.
export function loadConfig(): AppConfig {
  return credentials;
}

export function getUserKeys(): string[] {
  return Object.keys(credentials.users);
}

export function getUserCount(): number {
  return getUserKeys().length;
}
