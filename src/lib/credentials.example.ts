import type { AppConfig } from "@/types";
// Template for the hardcoded configuration.
//
// Copy this file to `src/lib/credentials.ts` and fill in real values:
//
//   cp src/lib/credentials.example.ts src/lib/credentials.ts
//
// `src/lib/credentials.ts` is gitignored so your AnkiWeb credentials are never
// committed. When you deploy with `npm run deploy` (wrangler), local files —
// including gitignored ones — are bundled into the Worker, so the credentials
// ship with the deploy without being pushed to git.
//
// The `users` object keys (e.g. `alice`, `bob`) are shown as the player names
// on the dashboard. Add up to ~4 users; delete the ones you don't need.
export const credentials: AppConfig = {
  users: {
    alice: {
      name: "Alice",
      email: "alice@example.com",
      password: "your-password",
    },
    bob: {
      name: "Bob",
      email: "bob@example.com",
      password: "your-password",
    },
  },
  anki: {
    deck_name: "TOEIC L＆R TEST 出る単特急　金のフレーズ",
    fetch_interval_minutes: 10,
  },
};
