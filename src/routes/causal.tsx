import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, Ban, CheckCircle2, ChevronRight } from "lucide-react";
import { FilterBar } from "@/components/common/FilterBar";
import { FlowChain, Hint, KpiCard, Panel, StatusPill } from "@/components/common/primitives";
import { ResponseCurve } from "@/components/charts/ResponseCurve";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import {
  CAMPAIGNS,
  CANNIBALIZATION_PAIRS,
  CATEGORIES,
  CLUSTERS,
  CONSTRAINTS,
  COUNTRIES,
  PRODUCTS,
  PROVENANCE,
  PULL_FORWARD_TIMELINE,
  RESPONSE_CURVES,
  SEGMENTS,
  TOOLTIPS,
  fmtMoney,
} from "@/data/mock";

export const Route = createFileRoute("/causal")({
  head: () => ({
    meta: [
      { title: "Causal Layer — FarmaTodo Promotion Intelligence Studio" },
      {
        name: "description",
        content:
          "Understand why a promotion works — CATE, discount response, pull-forward, cannibalization, NIM economics and constraint caps.",
      },
      { property: "og:title", content: "Causal Layer — FarmaTodo Promotion Intelligence Studio" },
      { property: "og:description", content: "Causal explanation of promotional recommendations for FarmaTodo planners." },
    ],
  }),
  component: CausalLayer,
});

const TRACE = [
  "Customer has high product affinity (0.78 with Personal Care)",
  "Baseline demand is low/moderate — 0.82 units without promotion",
  "Exposure CATE is positive (+0.06 units from campaign exposure alone)",
  "Dose CATE peaks between 15% and 20% discount depth",
  "Pull-forward risk is low (6.1% of promoted volume)",
  "Cannibalization risk is moderate (Dove Body Lotion, 20%)",
  "NIM is positive at $2.10 per targeted customer",
  "Supplier agreement caps the offer at 20% — deeper depth is not permitted",
  "Optimizer selects the 15% Regular / 20% Prime package",
];

function CausalLayer() {
  const { filters, set } = useGlobalFilters();
  const sym = COUNTRIES[filters.country].symbol;
  const [product, setProduct] = useState(PRODUCTS[0].sku);
  const [depth, setDepth] = useState(15);
  const [noOffer, setNoOffer] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const prod = PRODUCTS.find((p) => p.sku === product)!;
  const curve = RESPONSE_CURVES[prod.category] ?? RESPONSE_CURVES["Personal Care"];

  const clusterShift = filters.cluster === "Deal Seeker" ? 1.25 : filters.cluster === "Premium Loyal" ? 0.75 : 1;
  const curveData = useMemo(() => curve.map((c) => ({ ...c, units: +(c.units * clusterShift).toFixed(2) })), [curve, clusterShift]);

  const baseline = 0.82;
  const exposureCate = noOffer ? 0 : +(0.06 * clusterShift).toFixed(2);
  const doseCate = noOffer ? 0 : +((curveData.find((c) => c.depth === depth)?.units ?? 0.41) * 0.58).toFixed(2);
  const incUnits = +(exposureCate + doseCate).toFixed(2);
  const promoUnits = +(baseline + incUnits).toFixed(2);
  const confidence = noOffer ? 92 : 89;

  const caps = CONSTRAINTS[filters.country];
  const effective = Math.min(...caps.map((c) => c.value));
  const status = depth <= effective ? "PASS" : depth <= effective + 5 ? "WARNING" : "VIOLATION";

  const econ = useMemo(() => {
    const incRevenue = noOffer ? 0 : incUnits * prod.price;
    const incMargin = incRevenue * 0.42;
    const discountCost = noOffer ? 0 : promoUnits * prod.price * (depth / 100);
    const erosion = noOffer ? 0 : baseline * prod.price * (depth / 100) * 0.42;
    const pullForward = noOffer ? 0 : incMargin * 0.061;
    const cannib = noOffer ? 0 : incMargin * 0.2;
    const fixed = noOffer ? 0 : 0.32;
    const nim = incMargin - erosion - pullForward - cannib - fixed;
    return { incRevenue, incMargin, discountCost, erosion, pullForward, cannib, fixed, nim };
  }, [incUnits, promoUnits, depth, prod.price, noOffer]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight">Causal Layer</h1>
          <p className="text-xs text-muted-foreground">Understand why a promotion works — or should not be offered.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={noOffer ? "default" : "outline"} className="text-xs" onClick={() => setNoOffer((v) => !v)}>
            <Ban className="h-3.5 w-3.5" /> NO OFFER
          </Button>
          <Button size="sm" className="text-xs" onClick={() => setWhyOpen(true)}>
            WHY? <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <FilterBar
        defs={[
          { key: "campaign", label: "Campaign", options: CAMPAIGNS },
          { key: "category", label: "Category", options: CATEGORIES },
          { key: "segment", label: "Customer Segment", options: SEGMENTS },
          { key: "cluster", label: "Behavioral Cluster", options: CLUSTERS },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <KpiCard label="Baseline Units" value={`${baseline.toFixed(2)}`} sub="without promotion" tip={TOOLTIPS["Baseline Units"]} compact />
        <KpiCard label="Exposure CATE" value={`+${exposureCate.toFixed(2)}`} sub="campaign exposure" tip="Incremental demand caused purely by exposure to the campaign." compact />
        <KpiCard label="Dose CATE" value={`+${doseCate.toFixed(2)}`} sub={`at ${depth}% depth`} tip="Additional incremental demand caused by the discount depth itself." compact />
        <KpiCard label="Expected Promo Units" value={promoUnits.toFixed(2)} sub="with promotion" compact />
        <KpiCard label="Incremental Units" value={`+${incUnits.toFixed(2)}`} sub="caused by promotion" tip={TOOLTIPS.CATE} compact />
        <KpiCard label="Confidence" value={`${confidence}%`} tip={TOOLTIPS.Confidence} compact />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-info-soft px-4 py-3 text-xs text-foreground">
          <b>Baseline</b> — what the customer would buy without any promotion. It is estimated causally, not from raw historical sales.
        </div>
        <div className="rounded-lg border border-success/25 bg-success-soft px-4 py-3 text-xs text-foreground">
          <b>CATE</b> — the additional demand <i>caused</i> by the promotion, split into exposure effect and discount-depth (dose) effect.
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Panel
          title="Discount Response Curve"
          subtitle={`${prod.name} · ${prod.category} · cluster ${filters.cluster}`}
          right={
            <div className="flex gap-2">
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger className="h-8 w-[210px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p.sku} value={p.sku} className="text-xs">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.cluster} onValueChange={(v) => set("cluster", v)}>
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLUSTERS.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        >
          <ResponseCurve data={curveData} recommended={depth} />
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] tracking-wide text-muted-foreground uppercase">Depth</span>
            {[0, 5, 10, 15, 20, 25, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                className={
                  "rounded-md border px-2 py-1 text-[11px] font-medium transition-colors " +
                  (d === depth ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:bg-surface-muted")
                }
              >
                {d}%
              </button>
            ))}
            <StatusPill tone="pass">Recommended {effective >= 15 ? 15 : effective}%</StatusPill>
          </div>
        </Panel>

        <Panel title="Temporal Pull-Forward" subtitle="Demand shifted earlier from a future purchase cycle">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Some of the observed promotional volume appears to be shifted forward from the customer&apos;s expected future purchase cycle.
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {[
              ["Promo-period incremental units", "+0.47"],
              ["Post-promo expected demand", "0.82"],
              ["Post-promo actual demand", "0.77"],
              ["Pull-forward units", "-0.05"],
              ["Pull-forward rate", "6.1%"],
              ["Pull-forward margin loss", `${sym}0.21`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md border border-border bg-surface-muted px-2.5 py-2">
                <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">{k}</dt>
                <dd className="mt-0.5 font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 space-y-2">
            {PULL_FORWARD_TIMELINE.map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-[11px] text-muted-foreground">{t.label}</span>
                <div className="flex flex-1 gap-1.5">
                  {t.events.map((e) => (
                    <div
                      key={e.week}
                      className={
                        "flex-1 rounded-md border px-1 py-1.5 text-center text-[10px] font-medium " +
                        (e.buy ? "border-primary/25 bg-info-soft text-primary" : "border-border bg-surface-muted text-muted-foreground")
                      }
                    >
                      {e.week}
                      <div className="text-[9px]">{e.buy ? "purchase" : "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Cross-Product Cannibalization" subtitle="Substitution effects on non-promoted products" bodyClassName="p-0">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] border-collapse text-xs">
              <thead>
                <tr className="bg-surface-muted">
                  {["Promoted Product", "Substitute Product", "Incremental Units", "Cannibalized Units", "Cannib. Rate", "Margin Loss"].map((h) => (
                    <th key={h} className="border-b border-border px-3 py-2 text-left font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CANNIBALIZATION_PAIRS.map((p) => (
                  <tr key={p.promoted} className="border-b border-border/70">
                    <td className="px-3 py-2 font-medium">{p.promoted}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.substitute}</td>
                    <td className="px-3 py-2 tabular-nums text-success">+{p.inc}</td>
                    <td className="px-3 py-2 tabular-nums text-danger">{p.cannibalized}</td>
                    <td className="px-3 py-2">
                      <StatusPill tone={p.rate > 20 ? "fail" : p.rate > 12 ? "warn" : "pass"}>{p.rate}%</StatusPill>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-danger">{fmtMoney(p.marginLoss, sym)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 border-l border-border p-4 text-center">
            <span className="rounded-md border border-primary/20 bg-info-soft px-3 py-1.5 text-xs font-medium text-primary">Nivea Body Lotion</span>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-[11px] tracking-wide text-muted-foreground uppercase">Substitution</span>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
            <span className="rounded-md border border-warning/35 bg-warning-soft px-3 py-1.5 text-xs font-medium text-warning-foreground">
              Dove Body Lotion
            </span>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Profit Economics" subtitle="Net incremental margin build per targeted customer">
          <div className="space-y-1">
            {[
              ["Incremental Revenue", econ.incRevenue, "good"],
              ["Incremental Margin", econ.incMargin, "good"],
              ["Discount Cost", -econ.discountCost, "bad"],
              ["Baseline Margin Erosion", -econ.erosion, "bad"],
              ["Pull-Forward Loss", -econ.pullForward, "bad"],
              ["Cannibalization Loss", -econ.cannib, "bad"],
              ["Campaign Fixed Cost", -econ.fixed, "bad"],
            ].map(([label, value, tone]) => (
              <div key={label as string} className="flex items-center justify-between border-b border-border/70 py-1.5 text-xs last:border-0">
                <span className="text-muted-foreground">{label as string}</span>
                <span className={"font-semibold tabular-nums " + (tone === "good" ? "text-success" : "text-danger")}>
                  {sym}
                  {(value as number).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-primary/20 bg-info-soft px-4 py-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-primary uppercase">
              NIM <Hint text={TOOLTIPS.NIM} />
            </div>
            <div className={"mt-1 text-3xl font-semibold tracking-tight " + (econ.nim >= 0 ? "text-success" : "text-danger")}>
              {sym}
              {econ.nim.toFixed(2)}
            </div>
            <div className="mt-1 flex gap-3 text-[11px] text-muted-foreground">
              <span>ROI {Math.round((econ.nim / Math.max(0.01, econ.discountCost)) * 100 + 100)}%</span>
              <span>DER {(econ.incRevenue / Math.max(0.01, econ.discountCost)).toFixed(2)}x</span>
              <span>PPM {(econ.nim / 0.32).toFixed(2)}</span>
            </div>
          </div>
          <Collapsible>
            <CollapsibleTrigger className="mt-2 text-[11px] font-medium text-primary hover:underline">Expand NIM formula</CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="mt-2 rounded-md border border-border bg-surface-muted p-3 text-[11px] leading-relaxed whitespace-pre-wrap">
{`NIM = Incremental Contribution
    - Baseline Margin Erosion
    - Pull-Forward Loss
    - Cannibalization Loss
    - Campaign Fixed Cost`}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </Panel>

        <Panel title="Optimal Offer" subtitle="Optimizer output for the selected scope">
          {noOffer ? (
            <div className="space-y-3">
              <StatusPill tone="fail">
                <Ban className="h-3 w-3" /> NO OFFER
              </StatusPill>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Customer is likely to purchase without the promotion. Discount would primarily erode margin.
              </p>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Recommended Regular", "0%"],
                  ["Recommended Prime", "0%"],
                  ["Expected Incremental Units", "+0.00"],
                  ["Expected NIM", `${sym}0.00`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-md border border-border bg-surface-muted px-2.5 py-2">
                    <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">{k}</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="text-xs">
                Needs Discount: <b className="text-danger">NO</b>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-primary/20 bg-info-soft px-3 py-2.5">
                  <div className="text-[10px] tracking-wide text-primary uppercase">Recommended Regular</div>
                  <div className="text-2xl font-semibold text-primary">15%</div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-info-soft px-3 py-2.5">
                  <div className="text-[10px] tracking-wide text-primary uppercase">Recommended Prime</div>
                  <div className="text-2xl font-semibold text-primary">20%</div>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Expected Incremental Units", "+0.83"],
                  ["Expected NIM", `${sym}2.10`],
                  ["Confidence", "High"],
                  ["Prime ≥ Regular", "Satisfied"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-md border border-border bg-surface-muted px-2.5 py-2">
                    <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">{k}</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center gap-2 text-xs">
                Needs Discount:{" "}
                <StatusPill tone="pass">
                  <CheckCircle2 className="h-3 w-3" /> YES
                </StatusPill>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Constraint Check" subtitle={`${filters.country} · offer capped at the tightest binding rule`}>
          <div className="space-y-1.5">
            {caps.map((c) => (
              <div key={c.label} className="flex items-center justify-between rounded-md border border-border bg-surface-muted px-3 py-2 text-xs">
                <div>
                  <div className="font-medium">{c.label}</div>
                  <div className="text-[10px] text-muted-foreground">Source: {c.source}</div>
                </div>
                <span className="font-semibold tabular-nums">{c.value}%</span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-md border border-primary/20 bg-info-soft px-3 py-2 text-xs">
              <span className="font-semibold text-primary">Effective Maximum</span>
              <span className="font-semibold tabular-nums text-primary">{effective}%</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs">
              <span className="text-muted-foreground">Margin Floor</span>
              <span className="font-semibold tabular-nums">12.0%</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs">
              <span className="text-muted-foreground">Budget Status</span>
              <StatusPill tone="pass">63% utilized</StatusPill>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs">
              <span className="text-muted-foreground">Status at {depth}%</span>
              <StatusPill tone={status === "PASS" ? "pass" : status === "WARNING" ? "warn" : "fail"}>{status}</StatusPill>
            </div>
          </div>
          <div className="mt-3 rounded-md border border-border bg-surface-muted p-3">
            <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Provenance</div>
            <dl className="mt-1.5 space-y-1 text-[11px]">
              {Object.entries({ ...PROVENANCE, Country: filters.country, Category: prod.category, Confidence: `${confidence}%` }).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="truncate font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Panel>
      </div>

      <Sheet open={whyOpen} onOpenChange={setWhyOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[520px]">
          <SheetHeader>
            <SheetTitle className="text-base">Causal Trace — why this offer?</SheetTitle>
            <SheetDescription className="text-xs">
              Customer C001 · {prod.name} · Campaign {filters.campaign === "All" ? "Mid-Year" : filters.campaign} · Recommended 15% Regular / 20% Prime
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-6">
            <ol className="space-y-1.5">
              {TRACE.map((t, i) => (
                <li key={t} className="flex gap-2.5 rounded-md border border-border bg-surface px-3 py-2 text-xs">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ol>
            <div className="rounded-md border border-border bg-surface-muted p-3">
              <div className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Trace path</div>
              <FlowChain
                steps={[
                  "Customer",
                  "Affinity",
                  "Baseline",
                  "CATE",
                  "Response Curve",
                  "Cannibalization",
                  "NIM",
                  "Constraint",
                  "Optimizer",
                  "Recommendation",
                ]}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
