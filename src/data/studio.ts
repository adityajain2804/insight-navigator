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
