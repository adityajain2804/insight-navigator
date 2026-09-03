import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Country } from "@/data/mock";

export type GlobalFilters = {
  country: Country;
  campaign: string;
  channel: string;
  region: string;
  sku: string;
  week: string;
  scenario: string;
  category: string;
  brand: string;
  segment: string;
  cluster: string;
  season: string;
};

const DEFAULTS: GlobalFilters = {
  country: "Colombia",
  campaign: "All",
  channel: "All",
  region: "All",
  sku: "All",
  week: "All",
  scenario: "Standard",
  category: "All",
  brand: "All",
  segment: "All",
  cluster: "All",
  season: "Mid-Year",
};

type Ctx = {
  filters: GlobalFilters;
  set: (key: keyof GlobalFilters, value: string) => void;
  reset: () => void;
};

const FiltersContext = createContext<Ctx | null>(null);

export function GlobalFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilters>(DEFAULTS);
  const value = useMemo<Ctx>(
    () => ({
      filters,
      set: (key, val) => setFilters((f) => ({ ...f, [key]: val })),
      reset: () => setFilters(DEFAULTS),
    }),
    [filters],
  );
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useGlobalFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useGlobalFilters must be used inside GlobalFiltersProvider");
  return ctx;
}
