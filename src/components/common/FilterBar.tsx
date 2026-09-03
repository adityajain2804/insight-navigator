import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalFilters, type GlobalFilters } from "@/hooks/use-global-filters";

export type FilterDef = { key: keyof GlobalFilters; label: string; options: string[] };

export function FilterField({ def }: { def: FilterDef }) {
  const { filters, set } = useGlobalFilters();
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{def.label}</span>
      <Select value={String(filters[def.key])} onValueChange={(v) => set(def.key, v)}>
        <SelectTrigger className="h-8 w-full min-w-[130px] bg-surface text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {def.options.map((o) => (
            <SelectItem key={o} value={o} className="text-xs">
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function FilterBar({ defs }: { defs: FilterDef[] }) {
  const { reset } = useGlobalFilters();
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-card">
      {defs.map((d) => (
        <FilterField key={d.key} def={d} />
      ))}
      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={reset}>
        <RotateCcw className="h-3.5 w-3.5" /> Reset
      </Button>
    </div>
  );
}
