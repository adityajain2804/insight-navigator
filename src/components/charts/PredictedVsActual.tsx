import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PredictedVsActual({ data }: { data: { week: string; predicted: number; actual: number }[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }} barCategoryGap="26%">
          <CartesianGrid stroke="oklch(0.93 0.01 258)" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `${v}K`} />
          <Tooltip
            cursor={{ fill: "oklch(0.95 0.01 258 / 0.6)" }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid oklch(0.9 0.01 258)" }}
            formatter={(v: number, n: string) => [`${v.toFixed(1)}K incremental units`, n === "predicted" ? "Predicted" : "Actual"]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="predicted" name="Predicted" fill="oklch(0.72 0.09 258)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="actual" name="Actual" fill="oklch(0.55 0.17 258)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
