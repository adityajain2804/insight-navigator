import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type SensitivityRow = { factor: string; low: number; high: number };

export function SensitivityChart({ rows }: { rows: SensitivityRow[] }) {
  const data = rows.map((r) => ({ ...r }));
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }} barCategoryGap="26%">
          <XAxis
            type="number"
            domain={[-30, 30]}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis type="category" dataKey="factor" width={140} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "oklch(0.95 0.01 258 / 0.6)" }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid oklch(0.9 0.01 258)" }}
            formatter={(v: number, n: string) => [`${v > 0 ? "+" : ""}${v}% margin impact`, n === "low" ? "Downside" : "Upside"]}
          />
          <ReferenceLine x={0} stroke="oklch(0.75 0.01 258)" />
          <Bar dataKey="low" stackId="s" radius={[3, 0, 0, 3]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={`l-${d.factor}`} fill="oklch(0.62 0.19 27)" />
            ))}
          </Bar>
          <Bar dataKey="high" stackId="s" radius={[0, 3, 3, 0]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={`h-${d.factor}`} fill="oklch(0.62 0.15 152)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
