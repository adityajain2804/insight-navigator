import { Link } from "@tanstack/react-router";
import { Bell, CalendarClock, ChevronDown, CircleDot } from "lucide-react";
import logo from "@/assets/ft-logo.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import { COUNTRIES } from "@/data/mock";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Campaign Studio" },
  { to: "/analytics", label: "Analytics" },
  { to: "/causal", label: "Causal Deep-Dive" },

  { to: "/campaign", label: "Post-Campaign Measurement & Audit" },
  { to: "/graph", label: "Knowledge Graph" },
] as const;

const COUNTRY_RULES: Record<string, string> = { Colombia: "INVIMA Rules", Venezuela: "SUNDDE Rules" };

export function AppShell({ children }: { children: ReactNode }) {
  const { filters, set } = useGlobalFilters();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <img src={logo} alt="FarmaTodo Promotion Intelligence Studio logo" className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight">FarmaTodo Promotion Intelligence Studio</div>
              <div className="truncate text-[11px] tracking-wide text-muted-foreground uppercase">
                CXO Strategy &amp; Campaign Planning Workspace
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-success/25 bg-success-soft px-2 py-1 text-[11px] font-semibold text-success">
              <CircleDot className="h-3 w-3" /> LIVE
            </span>
            <span className="hidden rounded-md border border-border bg-surface-muted px-2 py-1 text-[11px] text-muted-foreground xl:inline">
              Engine Mode: <b className="font-semibold text-foreground">Phase 1 Rules + Phase 2 Causal ML</b>
            </span>
            <Select value={filters.country} onValueChange={(v) => set("country", v)}>
              <SelectTrigger className="h-8 w-[220px] bg-surface text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(COUNTRIES).map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c} ({COUNTRIES[c as keyof typeof COUNTRIES].currency} · {COUNTRY_RULES[c]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger className="relative rounded-md border border-border p-1.5 text-muted-foreground hover:bg-surface-muted">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 rounded-full bg-danger px-1 text-[9px] font-semibold text-danger-foreground">3</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="text-xs">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">Beauty Week exceeds supplier cap on SKU-1034</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Mid-Year planning cutoff in 4 days (15 Jun)</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Post-campaign results ready for Flash Sale Q3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs hover:bg-surface-muted">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  MR
                </span>
                <span className="hidden sm:inline">M. Rodríguez</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Category Manager · LATAM</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">Preferences</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Audit log</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto px-5">
          <span className="order-last ml-auto hidden shrink-0 items-center gap-1.5 self-center rounded-md border border-warning/35 bg-warning-soft px-2 py-1 text-[11px] font-semibold text-warning-foreground lg:inline-flex">
            <CalendarClock className="h-3 w-3" /> Planning Cutoff: 15 Jun · Campaign Start: 30 Jun (Locked)
          </span>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="border-b-2 border-transparent px-3 py-2 text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground data-[status=active]:border-primary data-[status=active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 px-5 py-4">{children}</main>

      <footer className="sticky bottom-0 z-30 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border bg-surface px-5 py-1.5 text-[11px] text-muted-foreground">
        <span>
          Data: <b className="font-semibold text-success">Healthy</b>
        </span>
        <span>
          Model: <b className="font-semibold text-foreground">Phase 2 Causal</b>
        </span>
        <span>
          Optimizer: <b className="font-semibold text-success">Ready</b>
        </span>
        <span>
          Last Refresh: <b className="font-semibold text-foreground">2026-06-01</b>
        </span>
        <span>
          Country: <b className="font-semibold text-foreground">{filters.country}</b>
        </span>
        <span className="ml-auto">
          Environment: <b className="font-semibold text-primary">LIVE</b>
        </span>
      </footer>
    </div>
  );
}
