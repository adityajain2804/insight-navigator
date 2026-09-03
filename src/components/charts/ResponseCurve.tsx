import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ResponseCurve({
  data,
  recommended,
}: {
  data: { depth: number; units: number }[];
  recommended: number;
}) {
  const point = data.reduce((best, d) => (Math.abs(d.depth - recommended) < Math.abs(best.depth - recommended) ? d : best), data[0]);
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="oklch(0.93 0.01 258)" vertical={false} />
          <XAxis dataKey="depth" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid oklch(0.9 0.01 258)" }}
            formatter={(v: number) => [`${v.toFixed(2)} incremental units`, "Expected"]}
            labelFormatter={(l) => `Discount depth ${l}%`}
          />
          <ReferenceLine x={recommended} stroke="oklch(0.62 0.15 152)" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="units"
            stroke="oklch(0.55 0.17 258)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "oklch(0.55 0.17 258)" }}
            isAnimationActive={false}
          />
          <ReferenceDot x={point.depth} y={point.units} r={6} fill="oklch(0.62 0.15 152)" stroke="white" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
