import { useMemo } from "react";
import { GRAPH_EDGES, GRAPH_NODES, GRAPH_NODE_TONE, type GraphNode } from "@/data/mock";
import { cn } from "@/lib/utils";

const NODE_W = 176;
const NODE_H = 48;

const TONE_CLASS: Record<string, { fill: string; stroke: string; text: string }> = {
  primary: { fill: "fill-info-soft", stroke: "stroke-primary/45", text: "fill-primary" },
  success: { fill: "fill-success-soft", stroke: "stroke-success/45", text: "fill-success" },
  warning: { fill: "fill-warning-soft", stroke: "stroke-warning/55", text: "fill-warning-foreground" },
  danger: { fill: "fill-danger-soft", stroke: "stroke-danger/45", text: "fill-danger" },
  violet: { fill: "fill-violet-soft", stroke: "stroke-violet/45", text: "fill-violet" },
};

function center(n: GraphNode) {
  return { cx: n.x + NODE_W / 2, cy: n.y + NODE_H / 2 };
}

export function OntologyGraph({
  selectedId,
  onSelect,
  highlight,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  highlight: string[];
}) {
  const byId = useMemo(() => Object.fromEntries(GRAPH_NODES.map((n) => [n.id, n])), []);
  const hasHighlight = highlight.length > 0;

  const neighbours = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const s = new Set<string>([selectedId]);
    GRAPH_EDGES.forEach((e) => {
      if (e.from === selectedId) s.add(e.to);
      if (e.to === selectedId) s.add(e.from);
    });
    return s;
  }, [selectedId]);

  const isDim = (id: string) => {
    if (hasHighlight) return !highlight.includes(id);
    if (selectedId) return !neighbours.has(id);
    return false;
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 1260 500" className="h-[500px] w-full min-w-[1000px]" role="img" aria-label="Phase 3 ontology knowledge graph">
        <defs>
          <marker id="kg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-border" />
          </marker>
        </defs>

        {GRAPH_EDGES.map((e) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          const p1 = center(a);
          const p2 = center(b);
          const dim = isDim(e.from) || isDim(e.to);
          const mx = (p1.cx + p2.cx) / 2;
          const my = (p1.cy + p2.cy) / 2;
          return (
            <g key={`${e.from}-${e.to}`} className={cn("transition-opacity", dim ? "opacity-15" : "opacity-100")}>
              <line
                x1={p1.cx}
                y1={p1.cy}
                x2={p2.cx}
                y2={p2.cy}
                className="stroke-border"
                strokeWidth={1.5}
                markerEnd="url(#kg-arrow)"
              />
              <rect x={mx - e.label.length * 3.4 - 5} y={my - 9} width={e.label.length * 6.8 + 10} height={16} rx={4} className="fill-background stroke-border" strokeWidth={1} />
              <text x={mx} y={my + 2.5} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                {e.label}
              </text>
            </g>
          );
        })}

        {GRAPH_NODES.map((n) => {
          const tone = TONE_CLASS[GRAPH_NODE_TONE[n.type]] ?? TONE_CLASS.primary;
          const dim = isDim(n.id);
          const active = selectedId === n.id;
          return (
            <g
              key={n.id}
              onClick={() => onSelect(n.id)}
              className={cn("cursor-pointer transition-opacity", dim ? "opacity-20" : "opacity-100")}
            >
              <rect
                x={n.x}
                y={n.y}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                className={cn(tone.fill, tone.stroke)}
                strokeWidth={active ? 2.5 : 1.25}
              />
              <text x={n.x + 12} y={n.y + 19} className={cn(tone.text, "text-[9px] font-semibold tracking-wider uppercase")}>
                {n.type}
              </text>
              <text x={n.x + 12} y={n.y + 35} className="fill-foreground text-[11px] font-medium">
                {n.label.length > 26 ? `${n.label.slice(0, 25)}…` : n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export const GRAPH_LEGEND = [
  { tone: "primary", label: "Customer / Segment / Offer" },
  { tone: "success", label: "Product / Category" },
  { tone: "warning", label: "Campaign / Season / Channel" },
  { tone: "danger", label: "Constraint / Supplier" },
  { tone: "violet", label: "Causal Effect / Incrementality" },
];

export const LEGEND_DOT: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  violet: "bg-violet",
};
