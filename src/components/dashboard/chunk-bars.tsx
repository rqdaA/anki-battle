import type { ChunkProgress } from "@/types";

interface ChunkBarsProps {
  chunks: ChunkProgress[];
}

export function ChunkBars({ chunks }: ChunkBarsProps) {
  return (
    <div>
      <div className="text-[11px] text-gray-400 mb-1.5">セクションごとの進捗</div>
      <div className="flex flex-col gap-1.5">
        {chunks.map((c) => (
          <SectionBar key={c.index} chunk={c} />
        ))}
      </div>
    </div>
  );
}

function SectionBar({ chunk }: { chunk: ChunkProgress }) {
  const pct = chunk.total > 0 ? (chunk.studied / chunk.total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[10px] text-gray-500 w-16 shrink-0 truncate"
        title={chunk.label}
      >
        {chunk.label}
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
        <div className="bg-[#22c55e]" style={{ width: `${pct}%` }} />
        <div className="flex-1" />
      </div>
      <span className="text-[10px] text-gray-400 tabular-nums w-9 text-right">
        {Math.round(pct)}%
      </span>
    </div>
  );
}
