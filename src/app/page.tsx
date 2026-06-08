import { connection } from "next/server";
import { loadConfig } from "@/lib/config";
import { formatJstDateTime } from "@/lib/date-format";
import { getDashboardData } from "@/lib/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PlayerGrid } from "@/components/dashboard/player-grid";

export default async function Home() {
  // Opt out of prerendering so this renders per request and reads fresh KV data.
  await connection();

  const config = loadConfig();
  const { ranked, lastUpdated } = await getDashboardData();

  const lastUpdatedLabel =
    lastUpdated !== null ? `${formatJstDateTime(lastUpdated)} JST` : null;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <DashboardHeader
        deckName={config.anki.deck_name}
        lastUpdated={lastUpdatedLabel}
      />

      {ranked.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg">データがまだありません</p>
          <p className="text-sm mt-2">
            最初の取得中です。少し待ってから再読み込みしてください...
          </p>
        </div>
      ) : (
        <PlayerGrid users={ranked} />
      )}
    </main>
  );
}
