import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { FilterBar } from "@/components/common/FilterBar";
import { DeltaCard, Panel, StatusPill } from "@/components/common/primitives";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { SensitivityChart } from "@/components/charts/SensitivityChart";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import {
  CAMPAIGNS,
  CHANNELS,
  COUNTRIES,
  REGIONS,
  SCENARIOS,
  SKUS,
  SPOTS,
  TOOLTIPS,
  WEEKS,
  fmtMoney,
  fmtUnits,
} from "@/data/mock";

export const Route = createFileRoute("/scenario")({
  head: () => ({
    meta: [
      { title: "Scenario Engine — FarmaTodo Promotion Intelligence Studio" },
      {
        name: "description",
        content: "Simulate promo depth, vendor funding, duration, inventory and marketing spend and see NIM, ROI and margin impact instantly.",
      },
      { property: "og:title", content: "Scenario Engine — FarmaTodo Promotion Intelligence Studio" },
      { property: "og:description", content: "What-if simulation for promotional economics with waterfall and sensitivity analysis." },
    ],
  }),
  component: ScenarioEngine,
});

const DEFAULTS = { depth: 10, funding: 1500, duration: 4, inventory: 88, marketing: 5000, fatigue: true };

function ScenarioEngine() {
  const { filters } = useGlobalFilters();
  const sym = COUNTRIES[filters.country].symbol;
  const [cfg, setCfg] = useState(DEFAULTS);
  const [applied, setApplied] = useState(DEFAULTS);

  const rows = useMemo(
    () =>
      SPOTS.filter(
        (s) =>
          (filters.campaign === "All" || s.campaign === filters.campaign) &&
          (filters.channel === "All" || s.channel === filters.channel) &&
          (filters.region === "All" || s.region === filters.region) &&
          (filters.sku === "All" || s.sku === filters.sku) &&
          (filters.week === "All" || s.week === filters.week),
      ),
    [filters],
  );

  // Live model: everything below responds immediately to the configurator.
  const model = (c: typeof DEFAULTS) => {
    const depthFactor = 1 + (c.depth - 10) * 0.055;
    const invFactor = 0.72 + (c.inventory / 100) * 0.32;
    const mktFactor = 1 + (c.marketing - 5000) / 42000;
    const durFactor = 1 + (c.duration - 4) * 0.045;
    const fatigue = c.fatigue ? 0.94 : 1;
    return depthFactor * invFactor * mktFactor * durFactor * fatigue;
  };

  const base = useMemo(() => {
    const uplift = rows.reduce((a, r) => a + r.uplift, 0);
    const incSales = rows.reduce((a, r) => a + r.incSales, 0);
    const revenue = rows.reduce((a, r) => a + r.totalRevenue, 0);
    const incMargin = rows.reduce((a, r) => a + r.incMargin, 0);
    return { uplift, incSales, revenue, incMargin, roi: 133, util: 37, conf: 77 };
  }, [rows]);

  const f = model(cfg);
  const sim = {
    uplift: base.uplift * f,
    incSales: base.incSales * f * (1 - (cfg.depth - 10) * 0.004),
    revenue: base.revenue * (1 + (f - 1) * 0.42),
    incMargin: base.incMargin * f * (1 - (cfg.depth - 10) * 0.012),
    roi: base.roi * (f - (cfg.funding ? 0 : 0.03)) * (1 + (cfg.funding - 1500) / 60000),
    util: Math.min(100, Math.round(37 * (1 + (cfg.marketing - 5000) / 30000))),
    conf: Math.max(52, Math.min(95, Math.round(77 - Math.abs(cfg.depth - 15) * 0.9 + (cfg.inventory - 88) * 0.2))),
  };

  const stages = useMemo(() => {
    const baseSales = base.revenue * 0.55;
    const uplift = sim.incMargin * 1.42;
    const halo = sim.incMargin * 0.18;
    const cannib = -sim.incMargin * 0.16;
    const markdown = -sim.incSales * (cfg.depth / 100) * 0.9;
    const ops = -(cfg.marketing * 0.22 + cfg.duration * 480) + cfg.funding * 0.35;
    const total = uplift + halo + cannib + markdown + ops;
    return [
      { name: "Base Sales", value: baseSales, kind: "base" as const },
      { name: "Uplift", value: uplift, kind: "pos" as const },
      { name: "Halo", value: halo, kind: "pos" as const },
      { name: "Cannibalization", value: cannib, kind: "neg" as const },
      { name: "Markdown", value: markdown, kind: "neg" as const },
      { name: "Ops Friction", value: ops, kind: ops >= 0 ? ("pos" as const) : ("neg" as const) },
      { name: "Inc. Margin", value: total, kind: "total" as const },
    ];
  }, [base.revenue, sim.incMargin, sim.incSales, cfg]);

  const sensitivity = useMemo(
    () => [
      { factor: "Offer Depth", low: -Math.round(18 * (cfg.depth / 10)), high: Math.round(22 * (cfg.depth / 10)) },
      { factor: "Inventory Availability", low: -Math.round(14 * (100 / Math.max(50, cfg.inventory))), high: Math.round(11 * (cfg.inventory / 88)) },
      { factor: "Vendor Funding", low: -9, high: Math.round(15 * (cfg.funding / 1500) * 0.8) },
      { factor: "Marketing Spend", low: -7, high: Math.round(12 * (cfg.marketing / 5000) * 0.7) },
      { factor: "Duration", low: -5, high: Math.round(8 * (cfg.duration / 4) * 0.8) },
    ],
    [cfg],
  );

  const run = () => {
    setApplied(cfg);
    toast.success("Simulation executed — spot economics refreshed", {
      description: `Depth ${cfg.depth}% · Funding ${sym}${cfg.funding} · ${cfg.duration}w · Inventory ${cfg.inventory}%`,
    });
  };

  const Ctl = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    fmt,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    fmt: (v: number) => string;
  }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
        <span className="text-xs font-semibold tabular-nums text-primary">{fmt(value)}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight">Scenario Engine</h1>
          <p className="text-xs text-muted-foreground">Simulate offer changes and read the economic impact before committing budget.</p>
        </div>
        <StatusPill tone="info">Applied depth: {applied.depth}%</StatusPill>
      </div>

      <FilterBar
        defs={[
          { key: "campaign", label: "Campaign", options: CAMPAIGNS },
          { key: "channel", label: "Channel", options: CHANNELS },
          { key: "region", label: "Region", options: REGIONS },
          { key: "sku", label: "SKU", options: SKUS },
          { key: "week", label: "Week", options: WEEKS },
          { key: "scenario", label: "Scenario", options: SCENARIOS },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Panel title="Offer Configurator" subtitle="Every control updates the model live">
          <div className="space-y-4">
            <Ctl label="Promo Depth" value={cfg.depth} min={0} max={30} step={1} onChange={(v) => setCfg({ ...cfg, depth: v })} fmt={(v) => `${v}%`} />
            <Ctl
              label="Vendor Funding"
              value={cfg.funding}
              min={0}
              max={8000}
              step={100}
              onChange={(v) => setCfg({ ...cfg, funding: v })}
              fmt={(v) => `${sym}${v.toLocaleString()}`}
            />
            <Ctl label="Duration" value={cfg.duration} min={1} max={12} step={1} onChange={(v) => setCfg({ ...cfg, duration: v })} fmt={(v) => `${v} weeks`} />
            <Ctl
              label="Inventory Availability"
              value={cfg.inventory}
              min={50}
              max={100}
              step={1}
              onChange={(v) => setCfg({ ...cfg, inventory: v })}
              fmt={(v) => `${v}%`}
            />
            <Ctl
              label="Marketing Spend"
              value={cfg.marketing}
              min={0}
              max={25000}
              step={500}
              onChange={(v) => setCfg({ ...cfg, marketing: v })}
              fmt={(v) => `${sym}${v.toLocaleString()}`}
            />
            <div className="flex items-center justify-between rounded-md border border-border bg-surface-muted px-3 py-2">
              <div>
                <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Promo Fatigue</div>
                <div className="text-xs text-foreground">Current index {cfg.fatigue ? "0.82" : "1.00"}</div>
              </div>
              <Switch checked={cfg.fatigue} onCheckedChange={(v) => setCfg({ ...cfg, fatigue: v })} />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => { setCfg(DEFAULTS); setApplied(DEFAULTS); }}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
              <Button size="sm" className="text-xs" onClick={run}>
                <Play className="h-3.5 w-3.5" /> Run Simulation
              </Button>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
            <DeltaCard label="Sim. Uplift" from={fmtUnits(base.uplift)} to={fmtUnits(sim.uplift)} tip={TOOLTIPS.CATE} />
            <DeltaCard label="Sim. Inc. Sales" from={fmtMoney(base.incSales, sym)} to={fmtMoney(sim.incSales, sym)} />
            <DeltaCard label="Sim. Revenue" from={fmtMoney(base.revenue, sym)} to={fmtMoney(sim.revenue, sym)} />
            <DeltaCard label="Sim. Inc. Margin" from={fmtMoney(base.incMargin, sym)} to={fmtMoney(sim.incMargin, sym)} tip={TOOLTIPS.NIM} />
            <DeltaCard label="Sim. ROI" from={`${base.roi}%`} to={`${Math.round(sim.roi)}%`} tip={TOOLTIPS.ROI} />
            <DeltaCard label="Budget Util." from={`${base.util}%`} to={`${sim.util}%`} />
            <DeltaCard label="Confidence" from={`${base.conf}%`} to={`${sim.conf}%`} tip={TOOLTIPS.Confidence} />
          </div>

          <div className="grid gap-4 2xl:grid-cols-2">
            <Panel title="Profit Journey Waterfall" subtitle="Promotional margin build for the simulated offer">
              <WaterfallChart stages={stages} symbol={sym} />
            </Panel>
            <Panel title="Sensitivity — Margin Impact" subtitle="Downside / upside margin swing by driver">
              <SensitivityChart rows={sensitivity} />
            </Panel>
          </div>
        </div>
      </div>

      <Panel title="Simulated Spot Table" subtitle="Mirrors Spot Planning Grid — updates live with the configurator" bodyClassName="p-0">
        <div className="max-h-[440px] overflow-auto">
          <table className="w-full min-w-[1280px] border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr>
                {[
                  "Campaign",
                  "SKU",
                  "Week",
                  "Region",
                  "Channel",
                  "Reg. Price",
                  "Promo Price",
                  "Base Units",
                  "Uplift",
                  "Total Units",
                  "Inc. Sales",
                  "Base Revenue",
                  "Total Revenue",
                  "Inc. Margin",
                  "Total Margin",
                  "ROI",
                ].map((h) => (
                  <th key={h} className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const promoPrice = r.regularPrice * (1 - cfg.depth / 100);
                const uplift = r.uplift * f;
                const incSales = uplift * promoPrice;
                const totalRevenue = r.baseUnits * promoPrice + incSales;
                const incMargin = r.incMargin * f * (1 - (cfg.depth - 10) * 0.012);
                const totalMargin = totalRevenue * 0.33;
                const roi = (incMargin / Math.max(1, incSales * 0.28 + cfg.marketing / rows.length - cfg.funding / rows.length)) * 100;
                return (
                  <tr key={r.id} className="border-b border-border/70 hover:bg-info-soft/60">
                    <td className="px-3 py-2 font-medium whitespace-nowrap">{r.campaign}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.sku}</td>
                    <td className="px-3 py-2">{r.week}</td>
                    <td className="px-3 py-2">{r.region}</td>
                    <td className="px-3 py-2">{r.channel}</td>
                    <td className="px-3 py-2 tabular-nums">{sym}{r.regularPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 font-medium tabular-nums text-primary">{sym}{promoPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 tabular-nums">{r.baseUnits.toLocaleString()}</td>
                    <td className="px-3 py-2 font-medium tabular-nums text-success">+{Math.round(uplift)}</td>
                    <td className="px-3 py-2 tabular-nums">{fmtUnits(r.baseUnits + uplift)}</td>
                    <td className="px-3 py-2 tabular-nums">{fmtMoney(incSales, sym)}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">{fmtMoney(r.baseRevenue, sym)}</td>
                    <td className="px-3 py-2 font-medium tabular-nums">{fmtMoney(totalRevenue, sym)}</td>
                    <td className="px-3 py-2 tabular-nums text-success">{fmtMoney(incMargin, sym)}</td>
                    <td className="px-3 py-2 tabular-nums">{fmtMoney(totalMargin, sym)}</td>
                    <td className="px-3 py-2">
                      <StatusPill tone={roi >= 120 ? "pass" : roi >= 90 ? "warn" : "fail"}>{Math.round(roi)}%</StatusPill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
