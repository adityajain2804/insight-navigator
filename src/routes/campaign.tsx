import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { KpiCard, Panel, StatusPill } from "@/components/common/primitives";
import { PredictedVsActual } from "@/components/charts/PredictedVsActual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import {
  CAMPAIGN_PRODUCTS,
  CAMPAIGN_TYPES,
  CHANNELS,
  CONSTRAINTS,
  COUNTRIES,
  OVERRIDE_REASONS,
  POST_CAMPAIGN,
  SEASONS,
  fmtMoney,
} from "@/data/mock";

export const Route = createFileRoute("/campaign")({
  head: () => ({
    meta: [
      { title: "Campaign Planning — FarmaTodo Promotion Intelligence Studio" },
      {
        name: "description",
        content:
          "Plan campaigns at the 15-day milestone: discounts, constraint checks, NIM comparison, planner override, approval and post-campaign measurement.",
      },
      { property: "og:title", content: "Campaign Planning — FarmaTodo Promotion Intelligence Studio" },
      { property: "og:description", content: "Campaign construction, approval and post-campaign incrementality measurement." },
    ],
  }),
  component: CampaignPlanning,
});

type Line = (typeof CAMPAIGN_PRODUCTS)[number];

function CampaignPlanning() {
  const { filters, set } = useGlobalFilters();
  const sym = COUNTRIES[filters.country].symbol;
  const caps = CONSTRAINTS[filters.country];

  const [meta, setMeta] = useState({
    name: "Mid-Year Personal Care Reactivation",
    type: "BigMoment",
    channel: "Pharmacy",
    start: "2026-06-30",
    end: "2026-07-21",
    budget: 180000,
  });
  const [lines, setLines] = useState<Line[]>(CAMPAIGN_PRODUCTS.map((p) => ({ ...p })));
  const [state, setState] = useState<"Draft" | "Submitted" | "Approved">("Draft");
  const [override, setOverride] = useState({ open: false, regular: 20, prime: 25, reason: OVERRIDE_REASONS[0], note: "", applied: false });

  const avgRegular = lines.reduce((a, l) => a + l.regular, 0) / lines.length;

  const econ = useMemo(() => {
    const audience = 128_400;
    const redemption = 0.281 + avgRegular / 400;
    const incUnits = audience * redemption * 0.62;
    const incRevenue = lines.reduce((a, l) => a + l.price * (1 - l.regular / 100), 0) * (incUnits / lines.length) * 0.24;
    const discountCost = lines.reduce((a, l) => a + l.price * (l.regular / 100), 0) * (incUnits / lines.length) * 0.3;
    const nim = incRevenue * 0.42 - discountCost * 0.55 - 18_500;
    return {
      audience,
      redemption,
      incUnits,
      incRevenue,
      discountCost,
      nim,
      der: incRevenue / Math.max(1, discountCost),
      ppm: nim / 18_500,
      roi: (nim / Math.max(1, discountCost)) * 100 + 100,
      util: Math.min(100, Math.round((discountCost / meta.budget) * 100)),
      pullForward: 8.4,
      cannib: 11.2,
      confidence: 84,
    };
  }, [lines, avgRegular, meta.budget]);

  const nimAt = (regular: number) => {
    const scale = 1 - Math.pow((regular - 17) / 26, 2);
    return econ.nim * (0.72 + 0.5 * scale);
  };
  const options = [
    { regular: 15, prime: 20 },
    { regular: 20, prime: 25 },
    { regular: 25, prime: 30 },
  ].map((o) => ({ ...o, nim: nimAt(o.regular) }));
  const bestNim = Math.max(...options.map((o) => o.nim));

  const overrideNim = nimAt(override.regular);

  const updateLine = (sku: string, key: "regular" | "prime", value: number) =>
    setLines((ls) => ls.map((l) => (l.sku === sku ? { ...l, [key]: value } : l)));

  const lineIssue = (l: Line) => {
    if (l.regular > l.maxRegular) return { msg: `Discount exceeds supplier limit: maximum ${l.maxRegular}%`, tone: "fail" as const };
    if (l.prime > l.maxPrime) return { msg: `Prime discount exceeds maximum ${l.maxPrime}%`, tone: "fail" as const };
    if (l.prime < l.regular) return { msg: "Prime discount must be greater than or equal to Regular", tone: "fail" as const };
    if (l.regular > l.maxRegular - 3) return { msg: "Close to supplier cap — negotiate before approval", tone: "warn" as const };
    return null;
  };
  const violations = lines.filter((l) => lineIssue(l)?.tone === "fail").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight">Campaign Planning</h1>
          <p className="text-xs text-muted-foreground">
            Build, price, constrain and approve a campaign — {filters.country} ({COUNTRIES[filters.country].currency})
          </p>
        </div>
        <StatusPill tone={state === "Approved" ? "pass" : state === "Submitted" ? "info" : "neutral"}>Status: {state}</StatusPill>
      </div>

      <Tabs defaultValue="plan">
        <TabsList>
          <TabsTrigger value="plan" className="text-xs">
            Campaign Builder
          </TabsTrigger>
          <TabsTrigger value="post" className="text-xs">
            Post-Campaign Measurement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="space-y-4 pt-4">
          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <Panel title="Campaign Definition">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Campaign Name</Label>
                  <Input value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} className="h-8 text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Type</Label>
                    <Select value={meta.type} onValueChange={(v) => setMeta({ ...meta, type: v })}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CAMPAIGN_TYPES.map((t) => (
                          <SelectItem key={t} value={t} className="text-xs">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Country</Label>
                    <Select value={filters.country} onValueChange={(v) => set("country", v)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(COUNTRIES).map((c) => (
                          <SelectItem key={c} value={c} className="text-xs">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Channel</Label>
                    <Select value={meta.channel} onValueChange={(v) => setMeta({ ...meta, channel: v })}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHANNELS.filter((c) => c !== "All").map((c) => (
                          <SelectItem key={c} value={c} className="text-xs">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Season</Label>
                    <Select value={filters.season} onValueChange={(v) => set("season", v)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEASONS.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Start Date</Label>
                    <Input type="date" value={meta.start} onChange={(e) => setMeta({ ...meta, start: e.target.value })} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">End Date</Label>
                    <Input type="date" value={meta.end} onChange={(e) => setMeta({ ...meta, end: e.target.value })} className="h-8 text-xs" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Budget</Label>
                  <Input
                    type="number"
                    value={meta.budget}
                    onChange={(e) => setMeta({ ...meta, budget: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="rounded-lg border border-primary/20 bg-info-soft p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-primary uppercase">
                    <CalendarClock className="h-3.5 w-3.5" /> 15-Day Planning Milestone
                  </div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Planning cutoff</span>
                      <b>15 Jun</b>
                    </div>
                    <div className="flex items-center justify-center py-0.5 text-muted-foreground">↑ 15 days ↑</div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Campaign start</span>
                      <b>30 Jun</b>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <KpiCard label="Audience" value={econ.audience.toLocaleString()} sub="targeted customers" compact />
                <KpiCard label="Expected Redemption" value={`${(econ.redemption * 100).toFixed(1)}%`} compact />
                <KpiCard label="Expected Inc. Units" value={`${Math.round(econ.incUnits).toLocaleString()}`} compact />
                <KpiCard label="Expected NIM" value={fmtMoney(econ.nim, sym)} compact tip="Net incremental margin after promotion costs and cannibalization effects." />
                <KpiCard label="Confidence" value={`${econ.confidence}%`} compact />
                <KpiCard label="DER" value={`${econ.der.toFixed(2)}x`} compact tip="Incremental revenue generated per unit of discount cost." />
                <KpiCard label="PPM" value={econ.ppm.toFixed(2)} compact tip="Net incremental margin relative to fixed campaign cost." />
                <KpiCard label="Pull-Forward Risk" value={`${econ.pullForward}%`} compact positiveIsGood={false} />
                <KpiCard label="Cannibalization Risk" value={`${econ.cannib}%`} compact positiveIsGood={false} />
                <KpiCard label="Budget Utilization" value={`${econ.util}%`} compact />
              </div>

              <Panel title="Product List & Discount Entry" subtitle="Regular and Prime discounts validated against every binding constraint" bodyClassName="p-0">
                <div className="overflow-auto">
                  <table className="w-full min-w-[1080px] border-collapse text-xs">
                    <thead className="bg-surface-muted">
                      <tr>
                        {["Product", "Category", "Reg. Price", "Regular %", "Prime %", "Max Reg.", "Max Prime", "Constraint", "Expected NIM"].map((h) => (
                          <th key={h} className="border-b border-border px-3 py-2 text-left font-medium text-muted-foreground">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((l) => {
                        const issue = lineIssue(l);
                        return (
                          <tr key={l.sku} className="border-b border-border/70 align-top">
                            <td className="px-3 py-2">
                              <div className="font-medium">{l.name}</div>
                              <div className="text-[10px] text-muted-foreground">{l.sku}</div>
                              {issue && (
                                <div className={"mt-1 flex items-start gap-1 text-[11px] " + (issue.tone === "fail" ? "text-danger" : "text-warning-foreground")}>
                                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                                  <span>
                                    {issue.msg}
                                    <span className="block text-[10px] text-muted-foreground">Source: Supplier Agreement</span>
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">{l.category}</td>
                            <td className="px-3 py-2 tabular-nums">{sym}{l.price.toFixed(2)}</td>
                            <td className="px-3 py-2">
                              <Input
                                type="number"
                                value={l.regular}
                                onChange={(e) => updateLine(l.sku, "regular", Number(e.target.value))}
                                className="h-7 w-20 text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <Input
                                type="number"
                                value={l.prime}
                                onChange={(e) => updateLine(l.sku, "prime", Number(e.target.value))}
                                className="h-7 w-20 text-xs"
                              />
                            </td>
                            <td className="px-3 py-2 tabular-nums text-muted-foreground">{l.maxRegular}%</td>
                            <td className="px-3 py-2 tabular-nums text-muted-foreground">{l.maxPrime}%</td>
                            <td className="px-3 py-2">
                              <StatusPill tone={issue ? issue.tone : "pass"}>{issue ? (issue.tone === "fail" ? "VIOLATION" : "WARNING") : "PASS"}</StatusPill>
                            </td>
                            <td className="px-3 py-2 tabular-nums font-medium text-success">
                              {fmtMoney(l.price * (1 - l.regular / 100) * 620 * 0.18, sym)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Discount Comparison" subtitle="Side-by-side NIM for candidate offer packages">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {options.map((o) => {
                      const best = o.nim === bestNim;
                      return (
                        <div
                          key={o.regular}
                          className={
                            "rounded-lg border px-3 py-3 " + (best ? "border-success/40 bg-success-soft" : "border-border bg-surface-muted")
                          }
                        >
                          <div className="text-[11px] tracking-wide text-muted-foreground uppercase">
                            {o.regular}% Reg / {o.prime}% Prime
                          </div>
                          <div className={"mt-1 text-xl font-semibold " + (best ? "text-success" : "text-foreground")}>{fmtMoney(o.nim, sym)}</div>
                          {best && <StatusPill tone="pass">Best NIM</StatusPill>}
                        </div>
                      );
                    })}
                  </div>
                </Panel>

                <Panel
                  title="Planner Override"
                  subtitle="Deviate from the recommendation with a recorded business reason"
                  right={
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => setOverride({ ...override, open: !override.open })}>
                      {override.open ? "Close" : "Override Recommendation"}
                    </Button>
                  }
                >
                  {!override.open ? (
                    <p className="text-xs text-muted-foreground">
                      Current recommendation: <b className="text-foreground">15% Regular / 20% Prime</b> · Expected NIM {fmtMoney(nimAt(15), sym)}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Override Regular %</Label>
                          <Input
                            type="number"
                            value={override.regular}
                            onChange={(e) => setOverride({ ...override, regular: Number(e.target.value) })}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Override Prime %</Label>
                          <Input
                            type="number"
                            value={override.prime}
                            onChange={(e) => setOverride({ ...override, prime: Number(e.target.value) })}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] tracking-wide text-muted-foreground uppercase">Reason</Label>
                        <Select value={override.reason} onValueChange={(v) => setOverride({ ...override, reason: v })}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OVERRIDE_REASONS.map((r) => (
                              <SelectItem key={r} value={r} className="text-xs">
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        value={override.note}
                        onChange={(e) => setOverride({ ...override, note: e.target.value })}
                        placeholder="Context for the model feedback loop…"
                        className="min-h-16 text-xs"
                      />
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded-md border border-border bg-surface-muted px-2.5 py-2">
                          <div className="text-[10px] tracking-wide text-muted-foreground uppercase">Original NIM</div>
                          <div className="font-semibold tabular-nums">{fmtMoney(nimAt(15), sym)}</div>
                        </div>
                        <div className="rounded-md border border-border bg-surface-muted px-2.5 py-2">
                          <div className="text-[10px] tracking-wide text-muted-foreground uppercase">Override NIM</div>
                          <div className="font-semibold tabular-nums">{fmtMoney(overrideNim, sym)}</div>
                        </div>
                        <div className="rounded-md border border-border bg-surface-muted px-2.5 py-2">
                          <div className="text-[10px] tracking-wide text-muted-foreground uppercase">NIM Delta</div>
                          <div className={"font-semibold tabular-nums " + (overrideNim - nimAt(15) >= 0 ? "text-success" : "text-danger")}>
                            {overrideNim - nimAt(15) >= 0 ? "+" : "-"}
                            {fmtMoney(Math.abs(overrideNim - nimAt(15)), sym)}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setOverride({ ...override, applied: true });
                          toast.success("Override recorded for model feedback.");
                        }}
                      >
                        Apply Override
                      </Button>
                      {override.applied && (
                        <p className="text-[11px] text-muted-foreground">
                          Impact of override captured · reason <b>{override.reason}</b> · recorded for model feedback.
                        </p>
                      )}
                    </div>
                  )}
                </Panel>
              </div>

              <Panel title="Campaign Approval" subtitle="Final economics and constraint posture before commitment">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                  <KpiCard label="Audience Size" value={econ.audience.toLocaleString()} compact />
                  <KpiCard label="Total Discount Cost" value={fmtMoney(econ.discountCost, sym)} compact positiveIsGood={false} />
                  <KpiCard label="Expected Inc. Units" value={Math.round(econ.incUnits).toLocaleString()} compact />
                  <KpiCard label="Expected Inc. Revenue" value={fmtMoney(econ.incRevenue, sym)} compact />
                  <KpiCard label="Expected NIM" value={fmtMoney(econ.nim, sym)} compact />
                  <KpiCard label="ROI" value={`${Math.round(econ.roi)}%`} compact />
                  <KpiCard label="DER" value={`${econ.der.toFixed(2)}x`} compact />
                  <KpiCard label="PPM" value={econ.ppm.toFixed(2)} compact />
                  <KpiCard label="Budget Utilization" value={`${econ.util}%`} compact />
                  <KpiCard label="Confidence" value={`${econ.confidence}%`} compact />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusPill tone={violations ? "fail" : "pass"}>
                    {violations ? `${violations} constraint violation(s)` : "All constraints PASS"}
                  </StatusPill>
                  <StatusPill tone="neutral">Effective cap {Math.min(...caps.map((c) => c.value))}%</StatusPill>
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.success("Draft saved")}>
                      Save Draft
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setState("Submitted");
                        toast.success("Campaign submitted for approval");
                      }}
                    >
                      Submit for Approval
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs"
                      disabled={violations > 0}
                      onClick={() => {
                        setState("Approved");
                        toast.success(`${meta.name} approved`);
                      }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve Campaign
                    </Button>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="post" className="space-y-4 pt-4">
          <Panel title="Incrementality Correction Workflow" subtitle="From raw observed effect to final measured incrementality">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                "Control Assignment",
                "Observed Effect",
                "Baseline Correction",
                "Pull-Forward Correction",
                "Cannibalization Correction",
                "Final Incrementality",
              ].map((s, i, arr) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className="rounded-md border border-primary/20 bg-info-soft px-2.5 py-1.5 text-[11px] font-medium text-primary">{s}</span>
                  {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
                </span>
              ))}
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <KpiCard label="Predicted Inc. Units" value="28.6K" compact />
            <KpiCard label="Actual Inc. Units" value="27.4K" delta={-4.2} compact />
            <KpiCard label="Prediction Error" value="4.2%" compact positiveIsGood={false} />
            <KpiCard label="Predicted NIM" value={fmtMoney(125000, sym)} compact />
            <KpiCard label="Actual NIM" value={fmtMoney(117000, sym)} delta={-6.4} compact />
            <KpiCard label="NIM Variance" value={`-${fmtMoney(8000, sym)}`} compact positiveIsGood={false} />
            <KpiCard label="ROI" value="128%" delta={-5} compact />
            <KpiCard label="DER" value="3.1x" compact />
            <KpiCard label="Pull-Forward" value="9.1%" compact positiveIsGood={false} />
            <KpiCard label="Cannibalization" value="12.4%" compact positiveIsGood={false} />
          </div>

          <Panel title="Predicted vs Actual" subtitle="Weekly incremental units — Mid-Year Personal Care Reactivation">
            <PredictedVsActual data={POST_CAMPAIGN} />
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
