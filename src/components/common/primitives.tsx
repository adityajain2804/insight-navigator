import { type ReactNode } from "react";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function Hint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="text-muted-foreground/70 transition-colors hover:text-primary" aria-label="Metric explanation">
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">{text}</TooltipContent>
    </Tooltip>
  );
}

export function Panel({
  title,
  subtitle,
  right,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface shadow-card", className)}>
      {(title || right) && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {title && <h2 className="truncate text-[13px] font-semibold tracking-wide text-foreground uppercase">{title}</h2>}
            {subtitle && <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  sub,
  tip,
  positiveIsGood = true,
  compact,
}: {
  label: string;
  value: string;
  delta?: number;
  sub?: string;
  tip?: string;
  positiveIsGood?: boolean;
  compact?: boolean;
}) {
  const good = delta === undefined ? true : positiveIsGood ? delta >= 0 : delta < 0;
  return (
    <div className="rounded-lg border border-border bg-surface px-3.5 py-3 shadow-card">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
        {tip && <Hint text={tip} />}
      </div>
      <div className={cn("mt-1.5 font-semibold tracking-tight text-foreground", compact ? "text-lg" : "text-xl")}>{value}</div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px]">
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 font-medium", good ? "text-success" : "text-danger")}>
            {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
        )}
        {sub && <span className="truncate text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}

export function DeltaCard({ label, from, to, tip }: { label: string; from: string; to: string; tip?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3.5 py-3 shadow-card">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
        {tip && <Hint text={tip} />}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/40">{from}</span>
        <span className="text-muted-foreground">→</span>
        <span className="text-lg font-semibold tracking-tight text-primary">{to}</span>
      </div>
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "pass" | "warn" | "fail" | "neutral" | "info"; children: ReactNode }) {
  const map = {
    pass: "bg-success-soft text-success border-success/25",
    warn: "bg-warning-soft text-warning-foreground border-warning/35",
    fail: "bg-danger-soft text-danger border-danger/25",
    neutral: "bg-surface-muted text-muted-foreground border-border",
    info: "bg-info-soft text-primary border-primary/20",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium", map[tone])}>
      {children}
    </span>
  );
}

export function FlowChain({ steps, tone = "info" }: { steps: string[]; tone?: "info" | "neutral" }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-md border px-2 py-1 text-[11px] font-medium",
              tone === "info" ? "border-primary/20 bg-info-soft text-primary" : "border-border bg-surface-muted text-foreground",
            )}
          >
            {s}
          </span>
          {i < steps.length - 1 && <span className="text-muted-foreground">→</span>}
        </span>
      ))}
    </div>
  );
}
