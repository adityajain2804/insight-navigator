// ---------------- Unified Campaign Studio (3-vertical workspace) ----------------

export const STUDIO_CAMPAIGNS = ["Mid-Year", "OTC Boost", "Beauty Week", "Wellness Reset"];
export const STUDIO_CAMPAIGN_TYPES = ["Shot", "BigMoment", "RX Replenishment"];
export const STUDIO_CHANNELS = ["Digital CRM", "In-Store POS", "App / Web"];

export const STUDIO_CLUSTERS = [
  { id: "A", label: "Cluster A — High Frequency", tilt: 0.92 },
  { id: "B", label: "Cluster B — Category Explorer", tilt: 1.14 },
  { id: "C", label: "Cluster C — Reactivation", tilt: 1.32 },
  { id: "D", label: "Cluster D — Price Sensitive", tilt: 1.21 },
  { id: "E", label: "Cluster E — Replenishment", tilt: 0.78 },
  { id: "F", label: "Cluster F — Premium Loyal", tilt: 0.68 },
  { id: "G", label: "Cluster G — Occasional Basket", tilt: 1.05 },
] as const;

export const PRIME_TIERS = ["All", "Prime Loyalty Only", "Non-Prime"] as const;
export type PrimeTier = (typeof PRIME_TIERS)[number];

export const BASELINE = {
  organicRevenue: "$248.5K",
  repurchaseRate: "64.2%",
  runRate: "1,200 units/week",
  redemption: "28.4%",
  note: "Baseline organic demand established. Ready to evaluate causal lift.",
};

export const OVERRIDE_REASON_CODES = [
  { code: "clearance", label: "clearance — inventory clearance" },
  { code: "competitive_response", label: "competitive_response — competitor move" },
  { code: "supplier_agreement", label: "supplier_agreement — funded by supplier" },
  { code: "commercial_judgment", label: "commercial_judgment — planner discretion" },
];

export type StudioProduct = {
  sku: string;
  name: string;
  category: string;
  cluster: string;
  prime: boolean;
  baseUnits: number;
  price: number;
  marginRate: number;
  categoryCap: number;
  elasticity: number;
  organicIntent: number; // share of buyers who would buy anyway
  plateau: number;
};

export const STUDIO_PRODUCTS: StudioProduct[] = [
  { sku: "SKU-4412", name: "Nivea Soft 200ml", category: "Personal Care", cluster: "B", prime: true, baseUnits: 1200, price: 34, marginRate: 0.34, categoryCap: 30, elasticity: 1.35, organicIntent: 0.28, plateau: 22 },
  { sku: "SKU-7823", name: "Dove Beauty Bar", category: "Personal Care", cluster: "A", prime: false, baseUnits: 1850, price: 12, marginRate: 0.29, categoryCap: 30, elasticity: 1.12, organicIntent: 0.41, plateau: 18 },
  { sku: "SKU-1034", name: "Teragrip RX", category: "RX", cluster: "E", prime: true, baseUnits: 640, price: 46, marginRate: 0.41, categoryCap: 25, elasticity: 0.72, organicIntent: 0.66, plateau: 14 },
  { sku: "SKU-9901", name: "Advil Max 20s", category: "OTC", cluster: "C", prime: false, baseUnits: 980, price: 26, marginRate: 0.37, categoryCap: 30, elasticity: 1.24, organicIntent: 0.33, plateau: 20 },
  { sku: "SKU-6620", name: "La Roche-Posay Anthelios", category: "Dermocosmetics", cluster: "F", prime: true, baseUnits: 420, price: 88, marginRate: 0.46, categoryCap: 20, elasticity: 0.94, organicIntent: 0.52, plateau: 16 },
];

export type StudioRow = {
  p: StudioProduct;
  regular: number;
  prime: number;
  clamped: boolean;
  baseUnits: number;
  liftUnits: number;
  pullForward: number;
  cannibal: number;
  nim: number;
  decision: boolean;
  exposureLift: number;
  doseLift: number;
  cate: number;
  confidence: number;
};

export function computeRows(opts: {
  regular: number;
  prime: number;
  cluster: string;
  tier: PrimeTier;
  channelIndex: number;
}): StudioRow[] {
  const { regular, prime, cluster, tier, channelIndex } = opts;
  const channelFactor = [1, 0.93, 1.07][channelIndex] ?? 1;

  return STUDIO_PRODUCTS.filter((p) => (cluster === "All" ? true : p.cluster === cluster))
    .filter((p) => (tier === "All" ? true : tier === "Prime Loyalty Only" ? p.prime : !p.prime))
    .map((p) => {
      const cap = p.categoryCap;
      const reg = Math.min(regular, cap);
      const pri = Math.min(Math.max(prime, reg), cap + 5);
      const clamped = regular > cap;

      const effective = p.prime ? pri : reg;
      const tilt = STUDIO_CLUSTERS.find((c) => c.id === p.cluster)?.tilt ?? 1;
      const saturation = 1 - Math.exp(-effective / p.plateau);
      const exposureLift = 0.06 * tilt;
      const doseLift = p.elasticity * tilt * saturation * 0.9;
      const cate = exposureLift + doseLift;

      const baseUnits = Math.round(p.baseUnits * channelFactor);
      const liftUnits = Math.round(baseUnits * cate * 0.4);
      const discountCost = baseUnits * (1 + cate * 0.4) * p.price * (effective / 100);
      const grossMargin = (baseUnits * cate * 0.4) * p.price * p.marginRate;
      const pullForward = -(baseUnits * p.organicIntent * p.price * p.marginRate * (effective / 100) * 0.55);
      const cannibal = -(baseUnits * p.price * p.marginRate * saturation * 0.05);
      const giveaway = -(baseUnits * p.organicIntent * p.price * (effective / 100) * 0.4);
      const nim = grossMargin + pullForward + cannibal + giveaway * 0.35;
      const decision = nim > 0 && effective > 0 && cate > 0;

      return {
        p,
        regular: reg,
        prime: pri,
        clamped,
        baseUnits,
        liftUnits,
        pullForward,
        cannibal,
        nim,
        decision,
        exposureLift,
        doseLift,
        cate,
        confidence: Math.round(72 + saturation * 20),
        discountCost,
      } as StudioRow & { discountCost: number };
    });
}

export function responseCurveFor(p: StudioProduct) {
  return Array.from({ length: 11 }, (_, i) => {
    const depth = i * 5;
    const saturation = 1 - Math.exp(-depth / p.plateau);
    return { depth, units: Number((p.elasticity * saturation).toFixed(3)) };
  });
}

// ---------------- Governed audience selection (Blueprint 4.2) ----------------

export const AUDIENCE_TYPES = [
  { id: "mass_general", label: "Mass / General", desc: "All identifiable store & digital shoppers" },
  { id: "personalized_segment", label: "Personalized Segment", desc: "Targeted by affinity rank & Prime tier" },
  { id: "reactivation", label: "Reactivation", desc: "Lapsed buyers outside repurchase cycle" },
  { id: "cyclical_rx", label: "Cyclical Replenishment (RX)", desc: "Contacted via replenishment cadence" },
] as const;
export type AudienceTypeId = (typeof AUDIENCE_TYPES)[number]["id"];

export const CLUSTER_CATALOG = [
  { id: "A", n: 1, short: "Cluster 1", label: "Cluster 1 (A) — Champions / High Frequency", table: "Cluster 1 — Champions" },
  { id: "B", n: 2, short: "Cluster 2", label: "Cluster 2 (B) — Loyalists / Category Explorers", table: "Cluster 2 — Category Explorer" },
  { id: "C", n: 3, short: "Cluster 3", label: "Cluster 3 (C) — Promising / Growth", table: "Cluster 3 — Promising / Growth" },
  { id: "D", n: 4, short: "Cluster 4", label: "Cluster 4 (D) — At Risk / Price Sensitive", table: "Cluster 4 — Price Sensitive" },
  { id: "E", n: 5, short: "Cluster 5", label: "Cluster 5 (E) — Reactivation / Lapsed", table: "Cluster 5 — Reactivation" },
  { id: "F", n: 6, short: "Cluster 6", label: "Cluster 6 (F) — Replenishment / High Habit", table: "Cluster 6 — Replenishment" },
  { id: "G", n: 7, short: "Cluster 7", label: "Cluster 7 (G) — Low Engagement / Occasional Basket", table: "Cluster 7 — Occasional Basket" },
] as const;

export const CAMPAIGN_IDS: Record<string, string> = {
  "Mid-Year": "AWARE-2025-VIT",
  "OTC Boost": "OTC-2025-ANLG",
  "Beauty Week": "BTY-2025-DERM",
  "Wellness Reset": "WEL-2025-RSET",
};

export type CustomerRow = {
  key: string;
  customerId: string;
  audience: AudienceTypeId;
  clusterId: string;
  clusterLabel: string;
  prime: boolean;
  sku: string;
  productName: string;
  regular: number;
  prime_pct: number;
  mechanic: "pct_discount" | "coupon" | "multibuy";
  incUnits: number;
  discountCost: number;
  flags: string[];
  decision: boolean;
};

const MECHANICS = ["pct_discount", "coupon", "multibuy"] as const;

export function buildCustomerRows(opts: {
  clusters: string[];
  audience: AudienceTypeId;
  tier: PrimeTier;
  regular: number;
  prime: number;
  regCap: number;
}): CustomerRow[] {
  const { clusters, audience, tier, regular, prime, regCap } = opts;
  const rows: CustomerRow[] = [];
  let seed = 884210;

  CLUSTER_CATALOG.filter((c) => clusters.includes(c.id)).forEach((c, ci) => {
    const products = STUDIO_PRODUCTS.filter((_, i) => (i + ci) % 2 === 0 || STUDIO_PRODUCTS.length < 3);
    products.forEach((p, pi) => {
      const isPrime = tier === "Prime Loyalty Only" ? true : tier === "Non-Prime" ? false : (ci + pi) % 2 === 0;
      const cap = Math.min(p.categoryCap, regCap);
      const reg = Math.min(regular, cap);
      const pri = Math.min(Math.max(prime, reg), cap + 5);
      const eff = isPrime ? pri : reg;
      const tilt = STUDIO_CLUSTERS.find((s) => s.id === c.id)?.tilt ?? 1;
      const saturation = 1 - Math.exp(-eff / p.plateau);
      const incUnits = p.baseUnits * (0.06 * tilt + p.elasticity * tilt * saturation * 0.9) * 0.35;
      const discountCost = p.baseUnits * p.price * (eff / 100) * 1.15;
      const flags: string[] = [];
      if (regular > p.categoryCap) flags.push("brand_price_floor");
      if (pri >= regCap) flags.push(`invima_cap_${regCap}%`);
      if (p.category === "Dermocosmetics") flags.push("supplier_cap_20%");
      const decision = incUnits > 60 && eff > 0 && p.organicIntent < 0.6;
      seed += 137;
      rows.push({
        key: `${c.id}-${p.sku}`,
        customerId: `CUST-${seed}`,
        audience,
        clusterId: c.id,
        clusterLabel: c.table,
        prime: isPrime,
        sku: p.sku.replace("SKU-", "SKU-00"),
        productName: p.name,
        regular: reg,
        prime_pct: pri,
        mechanic: MECHANICS[(ci + pi) % 3],
        incUnits,
        discountCost,
        flags,
        decision,
      });
    });
  });
  return rows;
}

// ---------------- Analytics (historical + live telemetry) ----------------

export const ONGOING_PROMOS = [
  { name: "Mid-Year Vitamins", id: "AWARE-2025-VIT", duration: "01 Jun → 30 Jun", channel: "Digital CRM", scope: "Vitamins & Supplements", depth: "15% / 20%", status: "Live" },
  { name: "OTC Analgesics Boost", id: "OTC-2025-ANLG", duration: "10 Jun → 08 Jul", channel: "In-Store POS", scope: "OTC · Analgesics", depth: "12% / 18%", status: "Live" },
  { name: "Beauty Week Derm", id: "BTY-2025-DERM", duration: "05 Jun → 19 Jun", channel: "App / Web", scope: "Dermocosmetics", depth: "20% / 20%", status: "Live" },
  { name: "RX Replenishment Cycle", id: "RX-2025-CYCL", duration: "Rolling · 28-day cadence", channel: "Digital CRM", scope: "RX Chronic Therapies", depth: "8% / 12%", status: "Live" },
];

export const REGIONS = [
  { region: "Bogotá", regime: "INVIMA · 30% cap", baseline: "1,240 u/wk", velocity: "1,690 u/wk", depth: "16.4%", risk: "Low" },
  { region: "Medellín", regime: "INVIMA · 30% cap", baseline: "880 u/wk", velocity: "1,205 u/wk", depth: "18.1%", risk: "Moderate" },
  { region: "Cali", regime: "INVIMA · 30% cap", baseline: "640 u/wk", velocity: "742 u/wk", depth: "21.7%", risk: "High" },
  { region: "Caracas / Maracaibo", regime: "SUNDDE · 25% cap", baseline: "510 u/wk", velocity: "664 u/wk", depth: "13.2%", risk: "Moderate" },
] as const;
