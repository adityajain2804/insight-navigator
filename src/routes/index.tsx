import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Play, Rocket, ShieldCheck, Sparkles, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
import { Panel, KpiCard, StatusPill } from "@/components/common/primitives";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import { COUNTRIES, PROVENANCE } from "@/data/mock";
import {
  AUDIENCE_TYPES,
  BASELINE,
  CAMPAIGN_IDS,
  CLUSTER_CATALOG,
  OVERRIDE_REASON_CODES,
  PRIME_TIERS,
  STUDIO_CAMPAIGNS,
  STUDIO_CHANNELS,
  buildCustomerRows,
  type AudienceTypeId,
  type PrimeTier,
} from "@/data/studio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campaign Studio — FarmaTodo Promotion Intelligence Studio" },
      {
        name: "description",
        content:
          "Governed promotion planning workspace: audience and cluster selection, Phase 1 customer-level promo output, and executive governance hub.",
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

const RIBBON = [
  { label: "Incremental Overall Revenue", value: "$1.24M", delta: 17.3 },
  { label: "Incremental Units", value: "30.7K units", delta: 15.4 },
  { label: "Customer Targeted Count", value: "67.5K", delta: 8.2 },
  { label: "True Promo ROI", value: "186% / 2.86x", delta: 12.1 },
  { label: "Promo Spend (Discount Cost)", value: "$432K", delta: -3.2 },
  { label: "Discount Efficiency Ratio (DER)", value: "1.41x", sub: "Target > 1.5x" },
  { label: "Giveaway Margin Saved", value: "$8.2K", sub: "Suppressed high-intent buyers" },
] as const;

function ClusterMultiSelect({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const all = CLUSTER_CATALOG.map((c) => c.id);
  const allSelected = value.length === all.length;
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div className="rounded-md border border-border bg-surface p-2">
      <div className="flex flex-wrap items-center gap-1">
        {value.length === 0 && <span className="px-1 text-[11px] text-muted-foreground">No cluster selected</span>}
        {CLUSTER_CATALOG.filter((c) => value.includes(c.id)).map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-info-soft px-1.5 py-0.5 text-[10px] font-medium text-primary"
          >
            {c.short}
            <button type="button" onClick={() => toggle(c.id)} aria-label={`Remove ${c.short}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 flex-1 justify-between px-2 text-[11px]">
              Select clusters ({value.length}/7) <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-2">
            {CLUSTER_CATALOG.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-start gap-2 rounded-md px-1.5 py-1.5 text-[11px] hover:bg-surface-muted">
                <Checkbox checked={value.includes(c.id)} onCheckedChange={() => toggle(c.id)} className="mt-0.5" />
                <span>{c.label}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => onChange(allSelected ? [] : all)}>
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
    </div>
  );
}

function CampaignStudio() {
  const { filters } = useGlobalFilters();
  const regCap = COUNTRIES[filters.country].regulatoryMax;

  const [campaignType, setCampaignType] = useState(STUDIO_CAMPAIGNS[0]);
  const [channel, setChannel] = useState(STUDIO_CHANNELS[0]);
  const [audience, setAudience] = useState<AudienceTypeId>("personalized_segment");
  const [clusters, setClusters] = useState<string[]>(CLUSTER_CATALOG.map((c) => c.id));
  const [tier, setTier] = useState<PrimeTier>("All");
  const [regular, setRegular] = useState(15);
  const [prime, setPrime] = useState(20);
  const [ran, setRan] = useState(true);
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
    () => buildCustomerRows({ clusters, audience, tier, regular, prime, regCap }),
    [clusters, audience, tier, regular, prime, regCap],
  );

  const clamped = rows.some((r) => r.flags.includes("supplier_cap_20%"));
  const campaignId = CAMPAIGN_IDS[campaignType] ?? "AWARE-2025-VIT";

  return (
    <div className="space-y-3">
      {/* ---------------- EXECUTIVE KPI RIBBON ---------------- */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {RIBBON.map((k) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={"delta" in k ? k.delta : undefined}
            sub={"sub" in k ? k.sub : undefined}
            positiveIsGood={k.label !== "Promo Spend (Discount Cost)"}
            compact
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(240px,22%)_minmax(0,1fr)_minmax(260px,22%)]">
        {/* ---------------- VERTICAL 1 ---------------- */}
        <div className="space-y-3">
          <Panel title="Cohort & Offer Selection" subtitle="Vertical 1 · Inputs" bodyClassName="space-y-3 p-3">
            <Field label="Campaign Type">
              <Picker value={campaignType} onChange={setCampaignType} options={STUDIO_CAMPAIGNS} />
            </Field>
            <Field label="Channel">
              <Picker value={channel} onChange={setChannel} options={STUDIO_CHANNELS} />
            </Field>

            <div className="rounded-md border border-border bg-surface-muted/60 p-2.5">
              <div className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Audience Cohort Builder</div>
              <Field label="Audience Type">
                <Select value={audience} onValueChange={(v) => setAudience(v as AudienceTypeId)}>
                  <SelectTrigger className="h-8 w-full bg-surface text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCE_TYPES.map((a) => (
                      <SelectItem key={a.id} value={a.id} className="text-xs">
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">
                {AUDIENCE_TYPES.find((a) => a.id === audience)?.desc}
              </p>

              <div className="mt-2.5">
                <span className="mb-1 block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Behavioral Segment</span>
                <ClusterMultiSelect value={clusters} onChange={setClusters} />
              </div>

              <div className="mt-2.5">
                <span className="mb-1 block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Prime Tier</span>
                <div className="grid grid-cols-3 gap-1">
                  {PRIME_TIERS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTier(t)}
                      className={`rounded-md border px-1.5 py-1 text-[10px] font-medium transition-colors ${
                        tier === t
                          ? "border-primary/30 bg-info-soft text-primary"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
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
                toast.success(`Promo engine executed · ${campaignType} · ${channel}`);
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
                <ShieldCheck className="h-3 w-3" /> {COUNTRIES[filters.country].regulator} Cap ({regCap}%){" "}
                {regular <= regCap ? "PASS" : "BREACH"}
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
            title="Phase 1 Customer Output"
            subtitle={ran ? `${rows.length} customer-level promo decisions` : "Run the engine to score the cohort"}
            bodyClassName="p-0"
          >
            <div className="overflow-auto">
              <table className="w-full min-w-[1180px] border-collapse text-[10.5px]">
                <thead className="bg-surface-muted/70">
                  <tr>
                    {[
                      "Campaign Name & ID",
                      "Customer ID",
                      "Audience Segment",
                      "Behavioral Cluster",
                      "Prime Status",
                      "Product Code",
                      "Rec. Regular %",
                      "Rec. Prime %",
                      "Rec. Mechanic",
                      "Est. Incr. Units",
                      "Est. Discount Cost",
                      "Constraint Flags",
                      "Decision & Action",
                    ].map((h) => (
                      <th key={h} className="border-b border-border px-2 py-2 text-left font-medium whitespace-nowrap text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.key} className="border-b border-border/70 transition-colors hover:bg-info-soft/60">
                      <td className="px-2 py-2 whitespace-nowrap">
                        <div className="font-medium">{campaignType}</div>
                        <div className="text-[10px] text-muted-foreground">{campaignId}</div>
                      </td>
                      <td className="px-2 py-2 font-medium whitespace-nowrap tabular-nums">{r.customerId}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">{r.audience}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{r.clusterLabel}</td>
                      <td className="px-2 py-2">
                        <StatusPill tone={r.prime ? "info" : "neutral"}>{r.prime ? "Prime" : "Non-Prime"}</StatusPill>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {r.sku} · {r.productName}
                      </td>
                      <td className="px-2 py-2 tabular-nums">{r.regular}%</td>
                      <td className="px-2 py-2 tabular-nums">{r.prime_pct}%</td>
                      <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">{r.mechanic}</td>
                      <td className="px-2 py-2 font-medium tabular-nums text-success">+{r.incUnits.toFixed(1)}</td>
                      <td className="px-2 py-2 tabular-nums">${Math.round(r.discountCost).toLocaleString()}</td>
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap gap-1">
                          {r.flags.length === 0 && <span className="text-muted-foreground">—</span>}
                          {r.flags.map((f) => (
                            <StatusPill key={f} tone="warn">
                              {f}
                            </StatusPill>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1.5">
                          {r.decision ? <StatusPill tone="pass">YES</StatusPill> : <StatusPill tone="neutral">NO OFFER</StatusPill>}
                          <Button size="sm" variant="outline" className="h-6 px-1.5 text-[9px]" onClick={() => setOverrideRow(r.customerId)}>
                            Override
                          </Button>
                          <Checkbox
                            checked={!!approved[r.key]}
                            onCheckedChange={(v) => {
                              setApproved((a) => ({ ...a, [r.key]: !!v }));
                              if (v) toast.success(`${r.customerId} approved for ${campaignType}`);
                            }}
                            aria-label={`Approve ${r.customerId}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={13} className="px-3 py-10 text-center text-muted-foreground">
                        No customers match this audience and cluster selection.
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
          <Panel title="Executive Summary & Governance" subtitle="Vertical 3 · Approval" bodyClassName="space-y-2.5 p-3">
            <div className="space-y-1.5 rounded-md border border-border bg-surface-muted/50 p-2.5 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Active Campaign</span>
                <span className="font-semibold">{campaignType}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Campaign ID</span>
                <span className="font-semibold tabular-nums">{campaignId}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Audience Type</span>
                <span className="font-semibold">{AUDIENCE_TYPES.find((a) => a.id === audience)?.label}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Clusters in scope</span>
                <span className="font-semibold tabular-nums">{clusters.length} of 7</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Channel · Tier</span>
                <span className="font-semibold">
                  {channel} · {tier}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Customers scored</span>
                <span className="font-semibold tabular-nums">{rows.length}</span>
              </div>
            </div>

            <div className="space-y-1 rounded-md border border-border px-2.5 py-2 text-[11px] text-muted-foreground">
              <div className="flex flex-wrap gap-1.5">
                <StatusPill tone="info">MLflow run_8f29a</StatusPill>
                <StatusPill tone="info">causal-dml-v2.7</StatusPill>
              </div>
              <div className="pt-1">
                Unity Catalog Silver table <b className="font-semibold text-success">verified</b> · Snapshot {PROVENANCE["Dataset Snapshot"]}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setOverrideRow(rows[0]?.customerId ?? null)} disabled={rows.length === 0}>
              Override Recommendation
            </Button>
            <Button
              className="w-full"
              onClick={() =>
                toast.success(
                  `Campaign "${campaignType}" exported to RMS · ${Object.values(approved).filter(Boolean).length} decisions approved`,
                )
              }
            >
              <Rocket className="h-4 w-4" /> Export to RMS / Approve Campaign
            </Button>
            {Object.keys(overrides).length > 0 && (
              <div className="space-y-1 pt-1 text-[11px] text-muted-foreground">
                {Object.entries(overrides).map(([id, code]) => (
                  <div key={id} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-success" /> {id} overridden · {code}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
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
