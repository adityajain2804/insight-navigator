import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Play, Search, Sparkles, X } from "lucide-react";
import { FilterBar, type FilterDef } from "@/components/common/FilterBar";
import { Hint, KpiCard, Panel, StatusPill } from "@/components/common/primitives";
import { GRAPH_LEGEND, LEGEND_DOT, OntologyGraph } from "@/components/graph/OntologyGraph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  CAMPAIGNS,
  CATEGORIES,
  CAUSAL_TRACE_STEPS,
  CHANNELS,
  CLUSTERS,
  GRAPH_KPIS,
  GRAPH_NODES,
  GRAPH_EDGES,
  PROVENANCE,
  QUERY_RESULTS,
  QUERY_TEMPLATES,
  SEGMENTS,
  SEMANTIC_KPIS,
  TOOLTIPS,
} from "@/data/mock";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/graph")({
  head: () => ({
    meta: [
      { title: "Knowledge Graph — FarmaTodo Promotion Intelligence Studio" },
      {
        name: "description",
        content:
          "Phase 3 ontology workspace: explore how customers, products, campaigns, offers, constraints and causal effects connect, and trace every recommendation end to end.",
      },
      { property: "og:title", content: "Knowledge Graph — FarmaTodo Promotion Intelligence Studio" },
      {
        property: "og:description",
        content: "Semantic query, ontology network view and causal traceability for FarmaTodo promotional recommendations.",
      },
    ],
  }),
  component: KnowledgeGraph,
});

const FILTERS: FilterDef[] = [
  { key: "campaign", label: "Campaign", options: CAMPAIGNS },
  { key: "category", label: "Category", options: CATEGORIES },
  { key: "channel", label: "Channel", options: CHANNELS },
  { key: "segment", label: "Customer Segment", options: SEGMENTS },
  { key: "cluster", label: "Behavioral Cluster", options: CLUSTERS },
];

function KnowledgeGraph() {
  const { filters } = useGlobalFilters();
  const [selected, setSelected] = useState<string | null>("offer");
  const [draft, setDraft] = useState("");
  const [activeQuery, setActiveQuery] = useState<string>(QUERY_TEMPLATES[3]);
  const [traceOpen, setTraceOpen] = useState(false);

  const result = QUERY_RESULTS[activeQuery] ?? QUERY_RESULTS[QUERY_TEMPLATES[3]];
  const node = useMemo(() => GRAPH_NODES.find((n) => n.id === selected) ?? null, [selected]);
  const nodeEdges = useMemo(
    () => GRAPH_EDGES.filter((e) => e.from === selected || e.to === selected),
    [selected],
  );

  const run = (q: string) => {
    setActiveQuery(q);
    setDraft(q);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Knowledge Graph</h1>
            <p className="text-xs text-muted-foreground">
              Phase 3 ontology — how every business entity, constraint and causal effect connects, and why an offer was recommended.
            </p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setTraceOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" /> WHY? — Causal Trace
          </Button>
        </div>

        <FilterBar defs={FILTERS} />

        <div>
          <div className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Graph Health KPIs</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {GRAPH_KPIS.map((k) => (
              <KpiCard key={k.label} label={k.label} value={k.value} sub={k.sub} tip={k.tip} compact />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Semantic / Business KPIs available through the graph
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {SEMANTIC_KPIS.map((k) => (
              <KpiCard key={k.label} label={k.label} value={k.value} tip={k.tip} compact />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Panel
            title="Ontology Network"
            subtitle={`${GRAPH_NODES.length} entities · ${GRAPH_EDGES.length} relationships · ${filters.country}`}
            right={
              <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
                {GRAPH_LEGEND.map((l) => (
                  <span key={l.tone} className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className={cn("h-2 w-2 rounded-full", LEGEND_DOT[l.tone])} />
                    {l.label}
                  </span>
                ))}
              </div>
            }
            bodyClassName="p-2"
          >
            <OntologyGraph selectedId={selected} onSelect={setSelected} highlight={result.highlight} />
            <p className="px-2 pb-1 text-[11px] text-muted-foreground">
              Nodes highlighted by the active semantic query. Click any entity to inspect its properties and traversals.
            </p>
          </Panel>

          <div className="space-y-4">
            <Panel title="Entity Inspector" subtitle={node ? node.type : "Select a node"}>
              {node ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold">{node.label}</div>
                    <StatusPill tone="info">{node.type}</StatusPill>
                  </div>
                  <dl className="divide-y divide-border rounded-md border border-border">
                    {Object.entries(node.props).map(([k, v]) => (
                      <div key={k} className="grid grid-cols-2 gap-2 px-2.5 py-1.5 text-xs">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-right font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div>
                    <div className="mb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Relationships</div>
                    <ul className="space-y-1">
                      {nodeEdges.map((e) => {
                        const other = GRAPH_NODES.find((n) => n.id === (e.from === node.id ? e.to : e.from));
                        return (
                          <li key={`${e.from}-${e.to}`} className="flex items-center gap-1.5 text-[11px]">
                            <span className="rounded border border-primary/20 bg-info-soft px-1.5 py-0.5 font-medium text-primary">{e.label}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <button className="truncate text-left hover:underline" onClick={() => setSelected(other?.id ?? null)}>
                              {other?.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Pick an entity in the network to inspect it.</p>
              )}
            </Panel>

            <Panel title="Provenance" subtitle="Data, feature and model lineage for this scope">
              <dl className="divide-y divide-border rounded-md border border-border">
                {Object.entries(PROVENANCE).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 gap-2 px-2.5 py-1.5 text-xs">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="truncate text-right font-medium">{v}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2 px-2.5 py-1.5 text-xs">
                  <dt className="text-muted-foreground">Country</dt>
                  <dd className="text-right font-medium">{filters.country}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2 px-2.5 py-1.5 text-xs">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="text-right font-medium">{filters.category}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2 px-2.5 py-1.5 text-xs">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    Confidence <Hint text={TOOLTIPS.Confidence} />
                  </dt>
                  <dd className="text-right font-medium text-success">{result.confidence}</dd>
                </div>
              </dl>
            </Panel>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
          <Panel title="Semantic Query" subtitle="Ask in natural language or pick a template">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (draft.trim()) run(draft.trim());
              }}
            >
              <div className="relative flex-1">
                <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="e.g. Why was this customer given a 20% discount?"
                  className="h-9 pl-8 text-xs"
                />
              </div>
              <Button type="submit" size="sm" className="h-9 gap-1.5 text-xs">
                <Play className="h-3.5 w-3.5" /> Run
              </Button>
            </form>
            <div className="mt-3 space-y-1.5">
              <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Query templates</div>
              {QUERY_TEMPLATES.map((q) => (
                <button
                  key={q}
                  onClick={() => run(q)}
                  className={cn(
                    "w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] leading-snug transition-colors",
                    activeQuery === q
                      ? "border-primary/35 bg-info-soft text-primary"
                      : "border-border bg-surface text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Query Result" subtitle="Entities, traversals and KPIs resolved from the ontology">
            <div className="rounded-md border border-border bg-surface-muted px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground">
              {result.query}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {result.kpis.map((k) => (
                <div key={k.label} className="rounded-md border border-border px-3 py-2">
                  <div className="text-[10px] tracking-wide text-muted-foreground uppercase">{k.label}</div>
                  <div className="mt-0.5 text-base font-semibold tracking-tight">{k.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Entities found</div>
                <ul className="space-y-1">
                  {result.entities.map((e) => (
                    <li key={`${e.type}-${e.label}`} className="flex items-center gap-2 text-[11px]">
                      <StatusPill tone="neutral">{e.type}</StatusPill>
                      <span className="truncate">{e.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Relationships traversed</div>
                <ul className="space-y-1">
                  {result.relationships.map((r) => (
                    <li key={r} className="rounded-md border border-border bg-surface-muted px-2 py-1 font-mono text-[11px]">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-2 text-[11px] text-muted-foreground">
              <span>
                Source table: <b className="font-medium text-foreground">{result.sourceTable}</b>
              </span>
              <span>
                Model: <b className="font-medium text-foreground">{result.modelVersion}</b>
              </span>
              <span>
                Confidence: <b className="font-medium text-success">{result.confidence}</b>
              </span>
              <Button variant="outline" size="sm" className="ml-auto h-7 gap-1.5 text-[11px]" onClick={() => setTraceOpen(true)}>
                <Sparkles className="h-3 w-3" /> WHY?
              </Button>
            </div>
          </Panel>
        </div>
      </div>

      <Sheet open={traceOpen} onOpenChange={setTraceOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-base">Causal Trace — why this recommendation?</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-6">
            <div className="rounded-md border border-border bg-surface-muted px-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-y-1">
                <span className="text-muted-foreground">Customer</span>
                <span className="text-right font-medium">C001 · Champion</span>
                <span className="text-muted-foreground">Product</span>
                <span className="text-right font-medium">Nivea Body Lotion 400ml</span>
                <span className="text-muted-foreground">Campaign</span>
                <span className="text-right font-medium">Mid-Year Reactivation</span>
                <span className="text-muted-foreground">Recommended Offer</span>
                <span className="text-right font-semibold text-primary">15% Regular / 20% Prime</span>
              </div>
            </div>

            <ol className="relative space-y-2 border-l border-border pl-4">
              {CAUSAL_TRACE_STEPS.map((s, i) => (
                <li key={s.step} className="relative">
                  <span className="absolute top-2 -left-[21px] grid h-3.5 w-3.5 place-items-center rounded-full border border-primary/40 bg-info-soft text-[8px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="rounded-md border border-border bg-surface px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">{s.step}</span>
                      <span className="truncate text-[11px] text-muted-foreground">{s.detail}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{s.finding}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-md border border-success/25 bg-success-soft px-3 py-2 text-xs text-success">
              Needs Discount: <b>YES</b> — optimizer selected 15% Regular / 20% Prime with expected NIM $2.10 per targeted customer.
            </div>

            <Button variant="outline" size="sm" className="h-8 w-full gap-1.5 text-xs" onClick={() => setTraceOpen(false)}>
              <X className="h-3.5 w-3.5" /> Close trace
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
