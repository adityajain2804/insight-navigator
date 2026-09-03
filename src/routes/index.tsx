import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Play, Rocket, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Panel, KpiCard, StatusPill, Hint } from "@/components/common/primitives";
import { WaterfallChart, type WaterfallStage } from "@/components/charts/WaterfallChart";
import { ResponseCurve } from "@/components/charts/ResponseCurve";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import { COUNTRIES, fmtMoney, fmtUnits, PROVENANCE } from "@/data/mock";
import {
  BASELINE,
  OVERRIDE_REASON_CODES,
  PRIME_TIERS,
  STUDIO_CAMPAIGNS,
  STUDIO_CAMPAIGN_TYPES,
  STUDIO_CHANNELS,
  STUDIO_CLUSTERS,
  computeRows,
  responseCurveFor,
  type PrimeTier,
} from "@/data/studio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campaign Studio — FarmaTodo Promotion Intelligence Studio" },
      {
        name: "description",
        content:
          "Unified 3-vertical promotion planning workspace: cohort and offer inputs, causal promo engine output, and net incremental margin waterfall with full traceability.",
      },
      { property: "og:title", content: "Campaign Studio — FarmaTodo Promotion Intelligence Studio" },
      { property: "og:description", content: "Plan, score and approve promotions on a single causal decision screen." },
    ],
  }),
  component: CampaignStudio,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
      {children}
    </label>
  );
}

function Picker({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-full bg-surface text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o} className="text-xs">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CampaignStudio() {
  const { filters } = useGlobalFilters();
  const sym = COUNTRIES[filters.country].symbol;
  const regCap = COUNTRIES[filters.country].regulatoryMax;

  const [campaign, setCampaign] = useState(STUDIO_CAMPAIGNS[0]);
  const [type, setType] = useState(STUDIO_CAMPAIGN_TYPES[0]);
  const [channel, setChannel] = useState(STUDIO_CHANNELS[0]);
  const [cluster, setCluster] = useState("All");
  const [tier, setTier] = useState<PrimeTier>("All");
  const [regular, setRegular] = useState(15);
  const [prime, setPrime] = useState(20);
  const [ran, setRan] = useState(true);
  const [selectedSku, setSelectedSku] = useState("SKU-4412");
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [overrideRow, setOverrideRow] = useState<string | null>(null);
  const [reason, setReason] = useState(OVERRIDE_REASON_CODES[0].code);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const setRegularSafe = (v: number) => {
    setRegular(v);
    if (prime < v) setPrime(v);
  };
  const setPrimeSafe = (v: number) => setPrime(Math.max(v, regular));

  const rows = useMemo(
    () => computeRows({ regular, prime, cluster, tier, channelIndex: STUDIO_CHANNELS.indexOf(channel) }),
    [regular, prime, cluster, tier, channel],
  );

  const selected = rows.find((r) => r.p.sku === selectedSku) ?? rows[0];
  const clamped = rows.some((r) => r.clamped);

  const macro = useMemo(() => {
    const nim = rows.reduce((a, r) => a + r.nim, 0);
    const cost = rows.reduce((a, r) => a + r.baseUnits * r.p.price * ((r.p.prime ? r.prime : r.regular) / 100), 0) || 1;
    const incRevenue = rows.reduce((a, r) => a + r.liftUnits * r.p.price, 0);
    const saved = rows.filter((r) => !r.decision).reduce((a, r) => a + Math.abs(r.pullForward) + Math.abs(r.cannibal), 0);
    return {
      nim: nim * 15,
      der: incRevenue / cost,
      ppm: 1 + (nim * 15) / 60000,
      saved: saved * 12 + 8200,
      lift: 8 + (rows.length ? nim / 900 : 0),
    };
  }, [rows]);

  const stages: WaterfallStage[] = useMemo(() => {
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const k = selected ? clamp(selected.cate / 0.9, 0.45, 1.6) : 1;
    const intent = selected ? clamp(selected.p.organicIntent / 0.4, 0.5, 1.7) : 1;
    const base = 459000;
    const uplift = Math.round(82000 * k);
    const giveaway = -Math.round(24000 * intent * k);
    const pull = -Math.round(12000 * intent);
    const cann = -Math.round(8000 * k);
    const fixed = -5000;
    return [
      { name: "Base", value: base, kind: "base" },
      { name: "Uplift", value: uplift, kind: "pos" },
      { name: "Giveaway", value: giveaway, kind: "neg" },
      { name: "Pull-Fwd", value: pull, kind: "neg" },
      { name: "Cannib.", value: cann, kind: "neg" },
      { name: "Fixed Cost", value: fixed, kind: "neg" },
      { name: "Net", value: base + uplift + giveaway + pull + cann + fixed, kind: "total" },
    ];
  }, [selected]);

  const curve = selected ? responseCurveFor(selected.p) : [];

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(240px,22%)_minmax(0,48%)_minmax(0,1fr)]">
      {/* ---------------- VERTICAL 1 ---------------- */}
      <div className="space-y-3">
        <Panel title="Cohort & Offer Selection" subtitle="Vertical 1 · Inputs" bodyClassName="space-y-3 p-3">
          <Field label="Campaign">
            <Picker value={campaign} onChange={setCampaign} options={STUDIO_CAMPAIGNS} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Campaign Type">
              <Picker value={type} onChange={setType} options={STUDIO_CAMPAIGN_TYPES} />
            </Field>
            <Field label="Channel">
              <Picker value={channel} onChange={setChannel} options={STUDIO_CHANNELS} />
            </Field>
          </div>

          <div className="rounded-md border border-border bg-surface-muted/60 p-2.5">
            <div className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Audience Cohort Builder</div>
            <Field label="Behavioral Segment">
              <Select value={cluster} onValueChange={setCluster}>
                <SelectTrigger className="h-8 w-full bg-surface text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs">
                    All 7 Behavioral Clusters
                  </SelectItem>
                  {STUDIO_CLUSTERS.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="mt-2">
              <span className="mb-1 block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Prime Tier</span>
              <div className="grid grid-cols-3 gap-1">
                {PRIME_TIERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={`rounded-md border px-1.5 py-1 text-[10px] font-medium transition-colors ${
                      tier === t ? "border-primary/30 bg-info-soft text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "Prime Loyalty Only" ? "Prime Only" : t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-md border border-border p-2.5">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Proposed Discount</div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span>Regular Discount</span>
                <span className="font-semibold tabular-nums text-primary">{regular}%</span>
              </div>
              <Slider value={[regular]} max={40} step={1} onValueChange={([v]) => setRegularSafe(v)} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span>Prime Discount</span>
                <span className="font-semibold tabular-nums text-primary">{prime}%</span>
              </div>
              <Slider value={[prime]} max={50} step={1} onValueChange={([v]) => setPrimeSafe(v)} className="mt-2" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Rule enforced: Prime ≥ Regular. Regulatory cap for {filters.country}: {regCap}%.
            </p>
          </div>
        </Panel>

        <Panel title="Pre-Promo Historical Baseline" subtitle="Organic performance, no promotion applied" bodyClassName="space-y-2 p-3">
          {[
            ["Past 90-Day Organic Revenue", BASELINE.organicRevenue],
            ["Organic Repurchase Rate", BASELINE.repurchaseRate],
            ["Baseline Organic Run Rate", BASELINE.runRate],
            ["Historical Coupon Redemption", BASELINE.redemption],
          ].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between rounded-md border border-border bg-surface-muted/50 px-2.5 py-1.5 text-xs">
              <span className="text-muted-foreground">{l}</span>
              <span className="font-semibold tabular-nums">{v}</span>
            </div>
          ))}
          <p className="text-[11px] leading-relaxed text-muted-foreground">{BASELINE.note}</p>
          <Button
            className="w-full"
            onClick={() => {
              setRan(true);
              toast.success(`Promo engine executed · ${campaign} · ${channel}`);
            }}
          >
            <Play className="h-4 w-4" /> Run Promo Engine
          </Button>
        </Panel>
      </div>

      {/* ---------------- VERTICAL 2 ---------------- */}
      <div className="space-y-3">
        <Panel title="Engine Rule & Constraint Validation" subtitle="Vertical 2 · Execution" bodyClassName="space-y-2 p-3">
          <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-info-soft px-2.5 py-1.5 text-[11px] font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            Phase 1 Heuristic Rules Checked → Phase 2 CATE Scored → CATE ≤ 0 Pruned
          </div>
          <div className="flex flex-wrap gap-1.5">
            <StatusPill tone={regular <= regCap ? "pass" : "fail"}>
              <ShieldCheck className="h-3 w-3" /> {COUNTRIES[filters.country].regulator} Cap ({regCap}%) {regular <= regCap ? "PASS" : "BREACH"}
            </StatusPill>
            <StatusPill tone="pass">
              <ShieldCheck className="h-3 w-3" /> Brand Price Floor PASS
            </StatusPill>
            {clamped && (
              <StatusPill tone="warn">
                <TriangleAlert className="h-3 w-3" /> Dermocosmetics supplier cap active: clamped to 20%.
              </StatusPill>
            )}
          </div>
        </Panel>

        <Panel
          title="Final Promo Output"
          subtitle={ran ? `${rows.length} scored SKU decisions — click a row to trace it` : "Run the engine to score the cohort"}
          bodyClassName="p-0"
        >
          <div className="overflow-auto">
            <table className="w-full min-w-[620px] border-collapse text-[10.5px]">
              <thead className="bg-surface-muted/70">
                <tr>
                  {[
                    "Product / SKU",
                    "Cohort",
                    "Base",
                    "Depths",
                    "Lift",
                    "Erosion (PF / Cann.)",
                    "NIM",
                    "Decision",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="border-b border-border px-2 py-2 text-left font-medium whitespace-nowrap text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.p.sku}
                    onClick={() => setSelectedSku(r.p.sku)}
                    className={`cursor-pointer border-b border-border/70 transition-colors hover:bg-info-soft/60 ${
                      selected?.p.sku === r.p.sku ? "bg-info-soft" : ""
                    }`}
                  >
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="font-medium">{r.p.name}</div>
                      <div className="text-[10px] text-muted-foreground">{r.p.sku} · {r.p.category}</div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">
                      {r.p.cluster} | {r.p.prime ? "Prime" : "Non-Prime"}
                    </td>
                    <td className="px-2 py-2 tabular-nums">{r.baseUnits.toLocaleString()}</td>
                    <td className="px-2 py-2 whitespace-nowrap tabular-nums">
                      {r.regular}% / {r.prime}%
                      {r.clamped && <span className="ml-1 text-warning-foreground">▲</span>}
                    </td>
                    <td className="px-2 py-2 font-medium tabular-nums text-success">+{fmtUnits(r.liftUnits)}</td>
                    <td className="px-2 py-2 whitespace-nowrap tabular-nums text-danger">
                      {fmtMoney(r.pullForward, sym)} / {fmtMoney(r.cannibal, sym)}
                    </td>
                    <td className={`px-2 py-2 font-semibold tabular-nums ${r.nim >= 0 ? "text-success" : "text-danger"}`}>
                      {r.nim >= 0 ? "+" : ""}
                      {fmtMoney(r.nim, sym)}
                    </td>
                    <td className="px-2 py-2">
                      {r.decision ? (
                        <StatusPill tone="pass">YES</StatusPill>
                      ) : (
                        <StatusPill tone="neutral">NO OFFER</StatusPill>
                      )}
                    </td>
                    <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="outline" className="h-6 px-1.5 text-[9px]" onClick={() => setOverrideRow(r.p.sku)}>
                          Override
                        </Button>
                        <Checkbox
                          checked={!!approved[r.p.sku]}
                          onCheckedChange={(v) => {
                            setApproved((a) => ({ ...a, [r.p.sku]: !!v }));
                            if (v) toast.success(`${r.p.name} approved for ${campaign}`);
                          }}
                          aria-label={`Approve ${r.p.name}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-10 text-center text-muted-foreground">
                      No SKUs match this cohort selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* ---------------- VERTICAL 3 ---------------- */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <KpiCard label="Net Incremental Margin" value={fmtMoney(macro.nim, sym)} delta={Number(macro.lift.toFixed(1))} tip="Margin gained after giveaway, pull-forward and cannibalization." compact />
          <KpiCard label="Discount Efficiency (DER)" value={`${macro.der.toFixed(2)}x`} sub="Target > 1.5x" tip="Incremental revenue per unit of discount cost." compact />
          <KpiCard label="Promo Profit Multiplier" value={`${macro.ppm.toFixed(2)}x`} tip="Net incremental margin relative to campaign cost." compact />
          <KpiCard label="Giveaway Margin Saved" value={fmtMoney(macro.saved, sym)} sub="Suppressed high-intent buyers" tip="Margin protected by not discounting organic buyers." compact />
        </div>

        <Panel
          title="Promotional Profit Build Waterfall"
          subtitle={selected ? `Scope: ${selected.p.name}` : "Aggregated cohort"}
          bodyClassName="p-2"
        >
          <WaterfallChart stages={stages} symbol={sym} />
        </Panel>

        <Panel title='Causal "WHY?" & Traceability' bodyClassName="space-y-3 p-3">
          <div className="rounded-md border border-border bg-surface-muted/50 px-2.5 py-2 text-xs">
            <div className="mb-1 flex items-center gap-1.5 font-medium">
              CATE Breakdown <Hint text="Exposure lift is caused by campaign contact; dose lift by discount depth." />
            </div>
            <div className="tabular-nums text-muted-foreground">
              Exposure Lift <b className="text-success">+{(selected?.exposureLift ?? 0).toFixed(2)}</b> + Dose Lift{" "}
              <b className="text-success">+{(selected?.doseLift ?? 0).toFixed(2)}</b> = Incremental Units{" "}
              <b className="text-primary">+{(selected?.cate ?? 0).toFixed(2)}</b>
            </div>
          </div>
          {selected && <ResponseCurve data={curve} recommended={selected.p.prime ? selected.prime : selected.regular} />}
          <div className="grid grid-cols-1 gap-1 text-[11px] text-muted-foreground">
            <div>
              MLflow Run ID: <b className="font-semibold text-foreground">run_8f29a</b>
            </div>
            <div>
              Qini Index: <b className="font-semibold text-foreground">0.41</b> · Model: {PROVENANCE["Model Version"]}
            </div>
            <div>
              Unity Catalog Silver table <b className="font-semibold text-success">verified</b> · Snapshot {PROVENANCE["Dataset Snapshot"]}
            </div>
          </div>
        </Panel>

        <Panel title="Planner Override & Submit" bodyClassName="space-y-2 p-3">
          <Button variant="outline" className="w-full" onClick={() => setOverrideRow(selected?.p.sku ?? null)} disabled={!selected}>
            Override Recommendation
          </Button>
          <Button
            className="w-full"
            onClick={() => toast.success(`Campaign "${campaign}" exported to RMS · ${Object.values(approved).filter(Boolean).length} SKUs approved`)}
          >
            <Rocket className="h-4 w-4" /> Export to RMS / Approve Campaign
          </Button>
          {Object.keys(overrides).length > 0 && (
            <div className="space-y-1 pt-1 text-[11px] text-muted-foreground">
              {Object.entries(overrides).map(([sku, code]) => (
                <div key={sku} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-success" /> {sku} overridden · {code}
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Dialog open={!!overrideRow} onOpenChange={(o) => !o && setOverrideRow(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Override recommendation — {overrideRow}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Reason code (required)">
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OVERRIDE_REASON_CODES.map((r) => (
                    <SelectItem key={r.code} value={r.code} className="text-xs">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Planner note">
              <Textarea rows={3} placeholder="Context for the audit log…" className="text-xs" />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideRow(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (overrideRow) setOverrides((o) => ({ ...o, [overrideRow]: reason }));
                toast.success(`Override logged (${reason})`);
                setOverrideRow(null);
              }}
            >
              Confirm override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
