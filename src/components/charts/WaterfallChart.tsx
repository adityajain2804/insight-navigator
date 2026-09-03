import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type WaterfallStage = { name: string; value: number; kind: "base" | "pos" | "neg" | "total" };

const COLORS = {
  base: "oklch(0.55 0.17 258)",
  pos: "oklch(0.62 0.15 152)",
  neg: "oklch(0.62 0.19 27)",
  total: "oklch(0.45 0.16 258)",
} as const;

export function WaterfallChart({ stages, symbol = "$" }: { stages: WaterfallStage[]; symbol?: string }) {
  let running = 0;
  const data = stages.map((s) => {
    if (s.kind === "base" || s.kind === "total") {
      const row = { ...s, offset: 0, bar: s.value, display: s.value };
      running = s.value;
      return row;
    }
    const start = running;
    running = start + s.value;
    return { ...s, offset: Math.min(start, running), bar: Math.abs(s.value), display: s.value };
  });

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 18, right: 8, left: 8, bottom: 4 }} barCategoryGap="24%">
          <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-18} textAnchor="end" height={38} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => `${symbol}${Math.round(Number(v) / 1000)}K`} />
          <Tooltip
            cursor={{ fill: "oklch(0.95 0.01 258 / 0.6)" }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid oklch(0.9 0.01 258)" }}
            formatter={(_v, _n, item) => [`${symbol}${Math.round(Number(item.payload.display)).toLocaleString()}`, item.payload.name]}
          />
          <Bar dataKey="offset" stackId="w" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="bar" stackId="w" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.name} fill={COLORS[d.kind]} />
            ))}
            <LabelList
              dataKey="display"
              position="top"
              style={{ fontSize: 10, fill: "oklch(0.45 0.02 258)" }}
              formatter={(v: number) => `${v < 0 ? "-" : ""}${symbol}${Math.abs(Math.round(v / 100) / 10)}K`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
