import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The dashboard page opts out of prerendering (via `connection()`), so it is
// always rendered dynamically and reads fresh data from KV per request. We do
// not use ISR, so the default in-memory incremental cache is sufficient and no
// R2/KV cache override is needed.
export default defineCloudflareConfig({});
