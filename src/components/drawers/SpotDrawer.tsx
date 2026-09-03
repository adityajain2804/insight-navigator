import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Hint, StatusPill } from "@/components/common/primitives";
import { COUNTRIES, PROVENANCE, TOOLTIPS, fmtMoney, type Spot } from "@/data/mock";
import { useGlobalFilters } from "@/hooks/use-global-filters";

function Row({ label, value, tip, tone }: { label: string; value: string; tip?: string; tone?: "good" | "bad" }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 py-1.5 last:border-0">
      <span className="flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground">
        {label}
        {tip && <Hint text={tip} />}
      </span>
      <span
        className={
          "text-xs font-semibold tabular-nums " +
          (tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-foreground")
        }
      >
        {value}
      </span>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{title}</div>
      {children}
    </div>
  );
}

export function SpotDrawer({ spot, onClose }: { spot: Spot | null; onClose: () => void }) {
  const navigate = useNavigate();
  const { filters } = useGlobalFilters();
  const sym = COUNTRIES[filters.country].symbol;
  if (!spot) return null;

  const depth = ((spot.regularPrice - spot.promoPrice) / spot.regularPrice) * 100;

  return (
    <Sheet open={!!spot} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[520px]">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-base">
            {spot.campaign} · {spot.sku}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {spot.product} — {spot.week} · {spot.region} · {spot.channel} · {filters.country}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-4 pb-6">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone={spot.nim > 0 ? "pass" : "fail"}>NIM {fmtMoney(spot.nim, sym)}</StatusPill>
            <StatusPill tone="info">Confidence {spot.confidence}%</StatusPill>
            <StatusPill tone={spot.cannibalization > 6 ? "warn" : "neutral"}>Cannib. {spot.cannibalization.toFixed(1)}%</StatusPill>
          </div>

          <Group title="Pricing">
            <Row label="Regular Price" value={`${sym}${spot.regularPrice.toFixed(2)}`} />
            <Row label="Promo Price" value={`${sym}${spot.promoPrice.toFixed(2)}`} />
            <Row label="Discount Depth" value={`${depth.toFixed(1)}%`} />
          </Group>

          <Group title="Volume">
            <Row label="Base Units" value={spot.baseUnits.toLocaleString()} tip={TOOLTIPS["Baseline Units"]} />
            <Row label="Expected Incremental Units" value={`+${spot.uplift.toLocaleString()}`} tone="good" tip={TOOLTIPS.CATE} />
            <Row label="Expected Total Units" value={(spot.baseUnits + spot.uplift).toLocaleString()} />
          </Group>

          <Group title="Economics">
            <Row label="Incremental Revenue" value={fmtMoney(spot.incSales, sym)} />
            <Row label="Baseline Revenue" value={fmtMoney(spot.baseRevenue, sym)} />
            <Row label="Incremental Margin" value={fmtMoney(spot.incMargin, sym)} tone="good" />
            <Row label="NIM" value={fmtMoney(spot.nim, sym)} tip={TOOLTIPS.NIM} tone={spot.nim > 0 ? "good" : "bad"} />
            <Row label="ROI" value={`${Math.round(spot.roi)}%`} tip={TOOLTIPS.ROI} />
            <Row label="DER" value={`${spot.der.toFixed(2)}x`} tip={TOOLTIPS.DER} />
            <Row label="PPM" value={spot.ppm.toFixed(2)} tip={TOOLTIPS.PPM} />
          </Group>

          <Group title="Causal Signals">
            <Row label="CATE" value={`+${spot.cate.toFixed(2)} units`} tip={TOOLTIPS.CATE} tone="good" />
            <Row label="Pull-Forward Rate" value={`${spot.pullForward.toFixed(1)}%`} tip={TOOLTIPS["Pull-Forward"]} tone="bad" />
            <Row label="Cannibalization Rate" value={`${spot.cannibalization.toFixed(1)}%`} tip={TOOLTIPS.Cannibalization} tone="bad" />
            <Row label="Cannibalization Margin Loss" value={fmtMoney(spot.incMargin * (spot.cannibalization / 100), sym)} tone="bad" />
            <Row label="Confidence" value={`${spot.confidence}%`} tip={TOOLTIPS.Confidence} />
            <Row label="Model Version" value={PROVENANCE["Model Version"]} />
          </Group>

          <Group title="Provenance">
            {Object.entries(PROVENANCE).map(([k, v]) => (
              <Row key={k} label={k} value={v} />
            ))}
          </Group>

          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" className="text-xs" onClick={() => navigate({ to: "/causal" })}>
              View Causal Explanation
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate({ to: "/scenario" })}>
              Open Scenario
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate({ to: "/campaign" })}>
              Edit Promo
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => toast.success(`${spot.id} approved by planner`)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="col-span-2 text-xs"
              onClick={() => toast.message("Override recorded for model feedback.")}
            >
              Override Recommendation
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
