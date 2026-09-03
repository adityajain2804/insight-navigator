import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, Panel, StatusPill } from "@/components/common/primitives";
import { BASELINE, ONGOING_PROMOS, REGIONS } from "@/data/studio";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — FarmaTodo Promotion Intelligence Studio" },
      {
        name: "description",
        content:
          "Historical baseline, ongoing promotion telemetry and regional performance breakdown across Bogotá, Medellín, Cali and Caracas/Maracaibo.",
      },
      { property: "og:title", content: "Analytics — FarmaTodo Promotion Intelligence Studio" },
      { property: "og:description", content: "Historical baselines and live promotional telemetry by region and campaign." },
    ],
  }),
  component: AnalyticsPage,
});

const RISK_TONE = { Low: "pass", Moderate: "warn", High: "fail" } as const;

function AnalyticsPage() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="90-Day Organic Baseline Revenue" value={BASELINE.organicRevenue} sub="No promotion applied" compact />
        <KpiCard label="Historical Coupon Redemption" value={BASELINE.redemption} sub="Trailing 90 days" compact />
        <KpiCard label="Steady-State Organic Run Rate" value={BASELINE.runRate} sub="Units per week" compact />
        <KpiCard label="Active Ongoing Promos" value="4 Live Campaigns" sub="Across CRM, POS and Web" compact />
      </div>

      <Panel title="Ongoing Promotions" subtitle="Live campaigns currently in market" bodyClassName="p-0">
        <div className="overflow-auto">
          <table className="w-full min-w-[780px] border-collapse text-[11px]">
            <thead className="bg-surface-muted/70">
              <tr>
                {["Campaign", "Duration", "Distribution Channel", "Category Scope", "Discount Depths", "Status"].map((h) => (
                  <th key={h} className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ONGOING_PROMOS.map((p) => (
                <tr key={p.id} className="border-b border-border/70 hover:bg-info-soft/50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.id}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{p.duration}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{p.channel}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{p.scope}</td>
                  <td className="px-3 py-2 whitespace-nowrap tabular-nums">{p.depth}</td>
                  <td className="px-3 py-2">
                    <StatusPill tone="pass">{p.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Regional Performance Breakdown" subtitle="Colour by region · baseline vs. active promo velocity" bodyClassName="p-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
          {REGIONS.map((r) => (
            <div key={r.region} className="rounded-lg border border-border bg-surface-muted/40 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{r.region}</div>
                  <div className="text-[11px] text-muted-foreground">{r.regime}</div>
                </div>
                <StatusPill tone={RISK_TONE[r.risk]}>{r.risk} cannib.</StatusPill>
              </div>
              <dl className="mt-2.5 space-y-1.5 text-[11px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Baseline run rate</dt>
                  <dd className="font-semibold tabular-nums">{r.baseline}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Active promo velocity</dt>
                  <dd className="font-semibold tabular-nums text-success">{r.velocity}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Avg. discount depth</dt>
                  <dd className="font-semibold tabular-nums">{r.depth}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Cannibalization risk</dt>
                  <dd className="font-semibold">{r.risk}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
