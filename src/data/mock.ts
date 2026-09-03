// Mock data layer for the FarmaTodo Promotion Intelligence Studio prototype.
// No backend: everything here is deterministic, realistic demo data.

export type Country = "Colombia" | "Venezuela";

export const COUNTRIES: Record<Country, { currency: string; symbol: string; regulator: string; regulatoryMax: number }> = {
  Colombia: { currency: "COP", symbol: "$", regulator: "INVIMA", regulatoryMax: 30 },
  Venezuela: { currency: "VES", symbol: "Bs", regulator: "SUNDDE", regulatoryMax: 25 },
};

export const CAMPAIGNS = [
  "All",
  "Summer Boost",
  "Flash Sale Q3",
  "Back to School",
  "Mid-Year",
  "Beauty Week",
  "OTC Reactivation",
];
export const CHANNELS = ["All", "Grocery", "Club", "Convenience", "eCommerce", "Pharmacy"];
export const REGIONS = ["All", "North", "South", "East", "West", "Central"];
export const SKUS = ["All", "SKU-4412", "SKU-7823", "SKU-1034", "SKU-9901"];
export const WEEKS = ["All", "W09", "W10", "W11", "W12"];
export const SCENARIOS = ["Standard", "Optimized", "Planner Override"];
export const CATEGORIES = ["All", "OTC", "Personal Care", "Beauty", "Baby", "Dermocosmetics", "Convenience"];
export const CAMPAIGN_TYPES = ["BigMoment", "Shot", "Leaflet", "Mass", "Personalized", "Reactivation", "RX Replenishment"];
export const SEGMENTS = ["All", "Champion", "Loyalist", "Reactivation", "At Risk", "Replenishment", "Promising", "Low Engagement"];
export const CLUSTERS = ["All", "Deal Seeker", "Habitual Buyer", "Premium Loyal", "Price Sensitive", "Occasional"];
export const SEASONS = ["Mid-Year", "Back to School", "Holiday Peak", "Summer", "Mother's Day"];
export const BRANDS = ["All", "Nivea", "Dove", "Teragrip", "Cetaphil", "Johnson's", "Eucerin", "Advil"];

export const PRODUCTS = [
  { sku: "SKU-4412", name: "Nivea Body Lotion 400ml", brand: "Nivea", category: "Personal Care", price: 40 },
  { sku: "SKU-7823", name: "Teragrip Cold Relief 24s", brand: "Teragrip", category: "OTC", price: 28 },
  { sku: "SKU-1034", name: "Cetaphil Gentle Cleanser", brand: "Cetaphil", category: "Dermocosmetics", price: 62 },
  { sku: "SKU-9901", name: "Johnson's Baby Shampoo 400ml", brand: "Johnson's", category: "Baby", price: 22 },
  { sku: "SKU-3320", name: "Dove Body Lotion 400ml", brand: "Dove", category: "Personal Care", price: 36 },
  { sku: "SKU-5518", name: "Eucerin Sun Fluid SPF50", brand: "Eucerin", category: "Beauty", price: 78 },
];

export type Spot = {
  id: string;
  campaign: string;
  sku: string;
  product: string;
  week: string;
  region: string;
  channel: string;
  country: Country;
  regularPrice: number;
  promoPrice: number;
  baseUnits: number;
  uplift: number;
  incSales: number;
  baseRevenue: number;
  totalRevenue: number;
  incMargin: number;
  totalMargin: number;
  roi: number;
  budgetUtil: number;
  cannibalization: number;
  confidence: number;
  status: "Draft" | "Submitted" | "Approved";
  pullForward: number;
  nim: number;
  der: number;
  ppm: number;
  cate: number;
};

const seedRows: Array<[string, string, string, string, string, number, number, number, number]> = [
  ["Summer Boost", "SKU-4412", "W09", "North", "Grocery", 40, 34, 1200, 350],
  ["Summer Boost", "SKU-4412", "W10", "Central", "eCommerce", 40, 33, 1450, 470],
  ["Flash Sale Q3", "SKU-7823", "W09", "South", "Pharmacy", 28, 22.4, 2100, 690],
  ["Flash Sale Q3", "SKU-7823", "W11", "West", "Convenience", 28, 23.8, 1780, 410],
  ["Back to School", "SKU-9901", "W10", "East", "Club", 22, 18.7, 3200, 880],
  ["Back to School", "SKU-9901", "W12", "North", "Grocery", 22, 19.8, 2650, 520],
  ["Mid-Year", "SKU-1034", "W11", "Central", "Pharmacy", 62, 52.7, 780, 260],
  ["Mid-Year", "SKU-1034", "W12", "South", "eCommerce", 62, 49.6, 910, 395],
  ["Beauty Week", "SKU-5518", "W10", "West", "Beauty" as string, 78, 66.3, 540, 205],
  ["Beauty Week", "SKU-5518", "W11", "North", "eCommerce", 78, 62.4, 620, 290],
  ["OTC Reactivation", "SKU-7823", "W12", "Central", "Pharmacy", 28, 24.6, 1340, 240],
  ["OTC Reactivation", "SKU-3320", "W09", "East", "Grocery", 36, 30.6, 1520, 430],
  ["Summer Boost", "SKU-3320", "W11", "South", "Club", 36, 31.7, 1180, 300],
  ["Mid-Year", "SKU-4412", "W12", "West", "Convenience", 40, 35.2, 990, 210],
  ["Flash Sale Q3", "SKU-1034", "W10", "North", "eCommerce", 62, 50.8, 700, 315],
];

export const SPOTS: Spot[] = seedRows.map((r, i) => {
  const [campaign, sku, week, region, channelRaw, regularPrice, promoPrice, baseUnits, uplift] = r;
  const channel = CHANNELS.includes(channelRaw) ? channelRaw : "Pharmacy";
  const product = PRODUCTS.find((p) => p.sku === sku)!;
  const totalUnits = baseUnits + uplift;
  const incSales = uplift * promoPrice;
  const baseRevenue = baseUnits * regularPrice;
  const totalRevenue = baseUnits * promoPrice + incSales;
  const grossMarginRate = 0.42;
  const incMargin = incSales * (grossMarginRate - (regularPrice - promoPrice) / regularPrice);
  const totalMargin = totalRevenue * grossMarginRate * 0.78;
  const spend = incSales / (1 + (i % 4) * 0.15) / 1.4;
  const roi = (incMargin / spend) * 100 + 60;
  const cannibalization = 2.2 + ((i * 7) % 9) * 0.6;
  const pullForward = 4 + ((i * 5) % 11) * 0.7;
  const nim = incMargin - incMargin * (cannibalization / 100) - incMargin * (pullForward / 100) - 850;
  return {
    id: `SP-${1000 + i}`,
    campaign,
    sku,
    product: product.name,
    week,
    region,
    channel,
    country: i % 5 === 4 ? "Venezuela" : "Colombia",
    regularPrice,
    promoPrice,
    baseUnits,
    uplift,
    incSales,
    baseRevenue,
    totalRevenue,
    incMargin,
    totalMargin,
    roi,
    budgetUtil: 28 + ((i * 11) % 40),
    cannibalization,
    confidence: 72 + ((i * 13) % 24),
    status: i % 6 === 0 ? "Approved" : i % 3 === 0 ? "Submitted" : "Draft",
    pullForward,
    nim,
    der: 2.1 + ((i * 3) % 12) * 0.14,
    ppm: 1.1 + ((i * 7) % 9) * 0.11,
    cate: 0.28 + ((i * 5) % 13) * 0.035,
  };
});

export const KPI_DEFS = [
  { key: "revenue", label: "Total Revenue", value: "$1.24M", delta: 8.3, tip: "Total promoted and non-promoted revenue across the selected spots." },
  { key: "roi", label: "Average ROI", value: "2.86x", delta: 12.1, tip: "Incremental margin generated per unit of promotional investment." },
  { key: "spend", label: "Promo Spend", value: "$432K", delta: -3.2, good: false, tip: "Total discount and marketing investment committed to the selected spots." },
  { key: "incunits", label: "Incremental Units", value: "30.7K", delta: 15.4, tip: "Units sold above the expected no-promotion baseline." },
  { key: "margin", label: "Average Margin", value: "20.6%", delta: 2.1, tip: "Blended net margin rate after discount cost." },
  { key: "cannib", label: "Cannibalization Rate", value: "7.5%", delta: -1.8, tip: "Demand or margin lost from substitute products." },
  { key: "fill", label: "Fill Rate", value: "94.2%", delta: 0.8, tip: "Share of promoted demand servable from available inventory." },
  { key: "active", label: "Active Promotions", value: "48", delta: 6, tip: "Promotional spots currently live in the selected scope." },
  { key: "redeem", label: "Redemption Rate", value: "34.1%", delta: 4.5, tip: "Share of targeted customers who redeemed the personalized offer." },
  { key: "lift", label: "Lift Index", value: "1.42", delta: 9.7, tip: "Observed demand relative to the causal baseline (1.00 = no lift)." },
];

export const RESPONSE_CURVES: Record<string, { depth: number; units: number }[]> = {
  "Personal Care": [
    { depth: 0, units: 0 },
    { depth: 5, units: 0.05 },
    { depth: 10, units: 0.15 },
    { depth: 15, units: 0.35 },
    { depth: 20, units: 0.7 },
    { depth: 25, units: 0.82 },
    { depth: 30, units: 0.84 },
  ],
  OTC: [
    { depth: 0, units: 0 },
    { depth: 5, units: 0.08 },
    { depth: 10, units: 0.22 },
    { depth: 15, units: 0.44 },
    { depth: 20, units: 0.61 },
    { depth: 25, units: 0.66 },
    { depth: 30, units: 0.67 },
  ],
  Dermocosmetics: [
    { depth: 0, units: 0 },
    { depth: 5, units: 0.03 },
    { depth: 10, units: 0.09 },
    { depth: 15, units: 0.24 },
    { depth: 20, units: 0.52 },
    { depth: 25, units: 0.74 },
    { depth: 30, units: 0.88 },
  ],
  Baby: [
    { depth: 0, units: 0 },
    { depth: 5, units: 0.06 },
    { depth: 10, units: 0.18 },
    { depth: 15, units: 0.3 },
    { depth: 20, units: 0.4 },
    { depth: 25, units: 0.45 },
    { depth: 30, units: 0.46 },
  ],
};

export const CANNIBALIZATION_PAIRS = [
  { promoted: "Nivea Body Lotion 400ml", substitute: "Dove Body Lotion 400ml", inc: 100, cannibalized: -20, rate: 20, marginLoss: 400 },
  { promoted: "Teragrip Cold Relief 24s", substitute: "Advil Cold & Sinus 20s", inc: 145, cannibalized: -18, rate: 12.4, marginLoss: 268 },
  { promoted: "Cetaphil Gentle Cleanser", substitute: "Eucerin DermoPurifyer", inc: 62, cannibalized: -15, rate: 24.2, marginLoss: 512 },
  { promoted: "Johnson's Baby Shampoo 400ml", substitute: "Nivea Baby Shampoo 300ml", inc: 210, cannibalized: -22, rate: 10.5, marginLoss: 190 },
];

export const CONSTRAINTS: Record<Country, { label: string; source: string; value: number }[]> = {
  Colombia: [
    { label: "Regulatory Maximum", source: "INVIMA", value: 30 },
    { label: "Supplier Maximum", source: "Supplier Agreement", value: 20 },
    { label: "Internal Maximum", source: "Internal Rule", value: 25 },
  ],
  Venezuela: [
    { label: "Regulatory Maximum", source: "SUNDDE", value: 25 },
    { label: "Supplier Maximum", source: "Supplier Agreement", value: 18 },
    { label: "Internal Maximum", source: "Internal Rule", value: 22 },
  ],
};

export const PROVENANCE = {
  "Dataset Snapshot": "ft_promo_snap_2026_05_28",
  "Feature Version": "feat-v3.4.1",
  "Model Version": "causal-dml-v2.7",
  "Code Version": "pipeline@8f21c0d",
  "Training Window": "2024-06-01 → 2026-05-15",
  "Scoring Date": "2026-06-01",
};

export const CAMPAIGN_PRODUCTS = [
  { sku: "SKU-4412", name: "Nivea Body Lotion 400ml", category: "Personal Care", price: 40, regular: 15, prime: 20, maxRegular: 20, maxPrime: 25 },
  { sku: "SKU-7823", name: "Teragrip Cold Relief 24s", category: "OTC", price: 28, regular: 10, prime: 15, maxRegular: 25, maxPrime: 30 },
  { sku: "SKU-1034", name: "Cetaphil Gentle Cleanser", category: "Dermocosmetics", price: 62, regular: 20, prime: 25, maxRegular: 20, maxPrime: 28 },
  { sku: "SKU-9901", name: "Johnson's Baby Shampoo 400ml", category: "Baby", price: 22, regular: 12, prime: 18, maxRegular: 18, maxPrime: 22 },
];

export const OVERRIDE_REASONS = [
  "Supplier Negotiation",
  "Inventory Risk",
  "Budget Constraint",
  "Strategic Priority",
  "Competitive Pressure",
  "Other",
];

export const POST_CAMPAIGN = [
  { week: "W05", predicted: 3.1, actual: 2.9 },
  { week: "W06", predicted: 4.4, actual: 4.1 },
  { week: "W07", predicted: 5.8, actual: 6.2 },
  { week: "W08", predicted: 6.3, actual: 5.6 },
  { week: "W09", predicted: 5.1, actual: 5.4 },
  { week: "W10", predicted: 3.9, actual: 3.2 },
];

export const PULL_FORWARD_TIMELINE = [
  { label: "Normal cycle", events: [{ week: "W1", buy: true }, { week: "W2", buy: false }, { week: "W3", buy: false }, { week: "W4", buy: false }, { week: "W5", buy: true }] },
  { label: "Promo cycle", events: [{ week: "W1", buy: true }, { week: "W2", buy: false }, { week: "W3", buy: false }, { week: "W4", buy: true }, { week: "W5", buy: false }] },
];

export const QUERY_TEMPLATES = [
  "Find VIP customers exposed to deep discount campaigns with high cannibalization.",
  "Which campaigns exceeded supplier discount limits?",
  "Which products have high substitution risk?",
  "Why was this customer given a 20% discount?",
  "Show campaigns with positive CATE but negative NIM.",
  "Find customers who would have purchased without promotion.",
  "Show all products associated with Personal Care campaigns.",
  "Show products with competitor-price gaps.",
];

export const GRAPH_KPIS = [
  { label: "Triple Density", value: "18.4", sub: "triples / entity", tip: "Average number of asserted relationships per ontology entity." },
  { label: "Schema Compliance", value: "97.8%", sub: "validated triples", tip: "Share of triples conforming to the Phase 3 ontology schema." },
  { label: "Constraint Breaches", value: "12", sub: "active", tip: "Offers currently violating a regulatory, supplier or internal cap." },
  { label: "Competitor Mapping", value: "84.1%", sub: "SKUs mapped", tip: "Share of SKUs linked to at least one competitor price reference." },
  { label: "Path Connectivity", value: "0.91", sub: "traceable paths", tip: "Share of recommendations with a complete customer→recommendation trace." },
];

export const SEMANTIC_KPIS = [
  { label: "NIM", value: "$2.10", tip: "Net incremental margin after promotion costs and cannibalization effects." },
  { label: "DER", value: "3.4x", tip: "Incremental revenue generated per unit of discount cost." },
  { label: "PPM", value: "1.28", tip: "Net incremental margin relative to fixed campaign cost." },
  { label: "CATE Exposure", value: "+0.06", tip: "Incremental demand caused purely by being exposed to the campaign." },
  { label: "CATE Dose", value: "+0.41", tip: "Additional incremental demand caused by the discount depth itself." },
  { label: "Pull-Forward Rate", value: "9.4%", tip: "Demand moved earlier from a future purchase period." },
  { label: "Cannib. Margin Loss", value: "$412", tip: "Margin lost on substitute products because of this promotion." },
];

export const TOOLTIPS: Record<string, string> = {
  CATE: "Estimated incremental demand caused by the promotion.",
  "Baseline Units": "Expected units the customer would purchase without the promotion.",
  "Pull-Forward": "Demand moved earlier from a future purchase period.",
  Cannibalization: "Demand or margin lost from substitute products.",
  NIM: "Net incremental margin after promotion costs and cannibalization effects.",
  DER: "Incremental revenue generated per unit of discount cost.",
  PPM: "Net incremental margin relative to fixed campaign cost.",
  Affinity: "Strength of the customer's relationship with a product or category.",
  ROI: "Incremental margin generated per unit of promotional investment.",
  Confidence: "Model certainty in the estimated causal effect for this scope.",
};

export const fmtMoney = (n: number, symbol = "$") => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1000) return `${symbol}${(n / 1000).toFixed(1)}K`;
  return `${symbol}${n.toFixed(0)}`;
};

export const fmtUnits = (n: number) => (Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toFixed(0));

// ---------------- Phase 3 ontology / knowledge graph ----------------

export type GraphNodeType =
  | "Customer" | "Product" | "Category" | "Campaign" | "Offer" | "Season"
  | "Channel" | "Segment" | "Constraint" | "Supplier" | "Incrementality Result" | "Causal Effect";

export type GraphNode = {
  id: string;
  type: GraphNodeType;
  label: string;
  x: number;
  y: number;
  props: Record<string, string>;
};

export type GraphEdge = { from: string; to: string; label: string };

export const GRAPH_NODES: GraphNode[] = [
  { id: "cust", type: "Customer", label: "C001 · Champion", x: 90, y: 250, props: { Segment: "Champion", "Behavioral Cluster": "Premium Loyal", Country: "Colombia", "Lifetime Orders": "48", Affinity: "0.81 (Personal Care)" } },
  { id: "seg", type: "Segment", label: "Champion", x: 90, y: 90, props: { Members: "148,320", "Avg. Baseline Units": "0.82", "Redemption Rate": "41.2%" } },
  { id: "prod", type: "Product", label: "Nivea Body Lotion 400ml", x: 330, y: 250, props: { SKU: "SKU-4412", Brand: "Nivea", "Regular Price": "$40.00", "Competitor Gap": "-4.2%" } },
  { id: "sub", type: "Product", label: "Dove Body Lotion 400ml", x: 330, y: 410, props: { SKU: "SKU-3320", Brand: "Dove", "Substitution Strength": "0.62", "Margin Loss": "$400" } },
  { id: "cat", type: "Category", label: "Personal Care", x: 330, y: 90, props: { SKUs: "1,284", "Avg. Dose CATE": "+0.38", "Recommended Depth": "15%" } },
  { id: "camp", type: "Campaign", label: "Mid-Year Reactivation", x: 570, y: 170, props: { Type: "Personalized", Country: "Colombia", Window: "30 Jun → 21 Jul", Budget: "$180K" } },
  { id: "season", type: "Season", label: "Mid-Year", x: 570, y: 40, props: { Window: "Jun → Jul", "Seasonality Index": "1.14" } },
  { id: "chan", type: "Channel", label: "eCommerce", x: 570, y: 410, props: { "Share of Promo Revenue": "31.4%", "Fill Rate": "96.1%" } },
  { id: "offer", type: "Offer", label: "15% Regular / 20% Prime", x: 810, y: 250, props: { "Regular Discount": "15%", "Prime Discount": "20%", "Expected NIM": "$2.10", Confidence: "High" } },
  { id: "constraint", type: "Constraint", label: "Supplier Cap 20%", x: 1050, y: 150, props: { Source: "Supplier Agreement", Cap: "20%", Status: "Binding" } },
  { id: "supplier", type: "Supplier", label: "Beiersdorf LATAM", x: 1050, y: 30, props: { Agreement: "FT-BD-2026-04", "Funding Committed": "$1,500 / week" } },
  { id: "cate", type: "Causal Effect", label: "CATE · Dose +0.41", x: 810, y: 410, props: { "Exposure CATE": "+0.06", "Dose CATE": "+0.41", "Model Version": "causal-dml-v2.7", Confidence: "89%" } },
  { id: "incr", type: "Incrementality Result", label: "Measured Incrementality", x: 1050, y: 330, props: { "Actual Inc. Units": "+0.44", "Predicted": "+0.47", "NIM Variance": "-6.4%", "Pull-Forward": "9.4%" } },
];

export const GRAPH_EDGES: GraphEdge[] = [
  { from: "cust", to: "seg", label: "belongsTo" },
  { from: "cust", to: "prod", label: "hasAffinity" },
  { from: "prod", to: "cat", label: "partOf" },
  { from: "prod", to: "sub", label: "hasSubstitute" },
  { from: "cat", to: "camp", label: "targetedBy" },
  { from: "camp", to: "season", label: "runsIn" },
  { from: "camp", to: "chan", label: "deliveredVia" },
  { from: "camp", to: "offer", label: "contains" },
  { from: "cust", to: "offer", label: "respondsTo" },
  { from: "offer", to: "constraint", label: "constrainedBy" },
  { from: "constraint", to: "supplier", label: "issuedBy" },
  { from: "offer", to: "cate", label: "hasCATE" },
  { from: "camp", to: "incr", label: "measuredBy" },
];

export const GRAPH_NODE_TONE: Record<GraphNodeType, string> = {
  Customer: "primary",
  Segment: "primary",
  Product: "success",
  Category: "success",
  Campaign: "warning",
  Season: "warning",
  Channel: "warning",
  Offer: "primary",
  Constraint: "danger",
  Supplier: "danger",
  "Causal Effect": "violet",
  "Incrementality Result": "violet",
};

export type QueryResult = {
  query: string;
  entities: { type: string; label: string }[];
  relationships: string[];
  kpis: { label: string; value: string }[];
  sourceTable: string;
  modelVersion: string;
  confidence: string;
  highlight: string[];
};

export const QUERY_RESULTS: Record<string, QueryResult> = {
  [QUERY_TEMPLATES[0]]: {
    query: QUERY_TEMPLATES[0],
    entities: [
      { type: "Segment", label: "Champion" },
      { type: "Customer", label: "18,402 customers" },
      { type: "Campaign", label: "Beauty Week, Flash Sale Q3" },
      { type: "Product", label: "Cetaphil Gentle Cleanser" },
    ],
    relationships: ["Customer belongsTo Segment", "Customer respondsTo Offer", "Product hasSubstitute Product"],
    kpis: [
      { label: "Customers matched", value: "18,402" },
      { label: "Avg. discount depth", value: "24.6%" },
      { label: "Avg. cannibalization", value: "22.8%" },
      { label: "Cannib. margin loss", value: "$186K" },
    ],
    sourceTable: "ft_causal.customer_offer_response_v3",
    modelVersion: "causal-dml-v2.7",
    confidence: "88%",
    highlight: ["cust", "seg", "prod", "sub"],
  },
  [QUERY_TEMPLATES[1]]: {
    query: QUERY_TEMPLATES[1],
    entities: [
      { type: "Campaign", label: "Beauty Week" },
      { type: "Constraint", label: "Supplier Cap 20%" },
      { type: "Supplier", label: "Beiersdorf LATAM, Galderma" },
    ],
    relationships: ["Campaign contains Offer", "Offer constrainedBy Constraint", "Constraint issuedBy Supplier"],
    kpis: [
      { label: "Breaching campaigns", value: "3" },
      { label: "Offers above cap", value: "12" },
      { label: "Max overshoot", value: "+5 pp" },
      { label: "Exposed margin", value: "$74K" },
    ],
    sourceTable: "ft_governance.constraint_breach_log",
    modelVersion: "constraint-engine-v1.9",
    confidence: "100%",
    highlight: ["camp", "offer", "constraint", "supplier"],
  },
  [QUERY_TEMPLATES[2]]: {
    query: QUERY_TEMPLATES[2],
    entities: [
      { type: "Product", label: "Nivea Body Lotion 400ml" },
      { type: "Product", label: "Dove Body Lotion 400ml" },
      { type: "Category", label: "Personal Care" },
    ],
    relationships: ["Product hasSubstitute Product", "Product partOf Category"],
    kpis: [
      { label: "High-risk pairs", value: "27" },
      { label: "Avg. substitution", value: "0.58" },
      { label: "Cannibalized units", value: "-3.1K" },
      { label: "Margin loss", value: "$41.2K" },
    ],
    sourceTable: "ft_causal.substitution_matrix",
    modelVersion: "substitution-emb-v1.4",
    confidence: "82%",
    highlight: ["prod", "sub", "cat"],
  },
  [QUERY_TEMPLATES[3]]: {
    query: QUERY_TEMPLATES[3],
    entities: [
      { type: "Customer", label: "C001 · Champion" },
      { type: "Offer", label: "15% Regular / 20% Prime" },
      { type: "Causal Effect", label: "Dose CATE +0.41" },
      { type: "Constraint", label: "Supplier Cap 20%" },
    ],
    relationships: ["Customer respondsTo Offer", "Offer hasCATE Causal Effect", "Offer constrainedBy Constraint"],
    kpis: [
      { label: "Dose CATE", value: "+0.41" },
      { label: "Expected NIM", value: "$2.10" },
      { label: "Effective cap", value: "20%" },
      { label: "Optimizer choice", value: "15% / 20%" },
    ],
    sourceTable: "ft_optimizer.offer_decision_log",
    modelVersion: "optimizer-milp-v3.1",
    confidence: "89%",
    highlight: ["cust", "offer", "cate", "constraint"],
  },
  [QUERY_TEMPLATES[4]]: {
    query: QUERY_TEMPLATES[4],
    entities: [
      { type: "Campaign", label: "Flash Sale Q3, OTC Reactivation" },
      { type: "Causal Effect", label: "Positive exposure CATE" },
      { type: "Incrementality Result", label: "Negative NIM" },
    ],
    relationships: ["Campaign measuredBy Incrementality Result", "Offer hasCATE Causal Effect"],
    kpis: [
      { label: "Campaigns matched", value: "2" },
      { label: "Avg. CATE", value: "+0.22" },
      { label: "Avg. NIM", value: "-$0.34" },
      { label: "Root cause", value: "Pull-forward 18%" },
    ],
    sourceTable: "ft_measurement.campaign_incrementality",
    modelVersion: "causal-dml-v2.7",
    confidence: "84%",
    highlight: ["camp", "cate", "incr"],
  },
  [QUERY_TEMPLATES[5]]: {
    query: QUERY_TEMPLATES[5],
    entities: [
      { type: "Customer", label: "42,118 customers" },
      { type: "Segment", label: "Loyalist, Replenishment" },
      { type: "Causal Effect", label: "CATE ≈ 0" },
    ],
    relationships: ["Customer belongsTo Segment", "Customer respondsTo Offer", "Offer hasCATE Causal Effect"],
    kpis: [
      { label: "Customers matched", value: "42,118" },
      { label: "Avg. baseline units", value: "1.14" },
      { label: "Avg. CATE", value: "+0.02" },
      { label: "Margin at risk", value: "$212K" },
    ],
    sourceTable: "ft_causal.baseline_propensity_v3",
    modelVersion: "baseline-gbm-v4.2",
    confidence: "91%",
    highlight: ["cust", "seg", "cate"],
  },
  [QUERY_TEMPLATES[6]]: {
    query: QUERY_TEMPLATES[6],
    entities: [
      { type: "Category", label: "Personal Care" },
      { type: "Product", label: "312 SKUs" },
      { type: "Campaign", label: "Mid-Year Reactivation, Summer Boost" },
    ],
    relationships: ["Product partOf Category", "Category targetedBy Campaign", "Campaign contains Offer"],
    kpis: [
      { label: "SKUs linked", value: "312" },
      { label: "Active offers", value: "86" },
      { label: "Avg. depth", value: "14.8%" },
      { label: "Expected NIM", value: "$318K" },
    ],
    sourceTable: "ft_master.product_category_map",
    modelVersion: "ontology-v3.0",
    confidence: "97%",
    highlight: ["cat", "prod", "camp", "offer"],
  },
  [QUERY_TEMPLATES[7]]: {
    query: QUERY_TEMPLATES[7],
    entities: [
      { type: "Product", label: "Nivea Body Lotion 400ml" },
      { type: "Product", label: "Eucerin Sun Fluid SPF50" },
      { type: "Channel", label: "eCommerce" },
    ],
    relationships: ["Product hasCompetitorPrice Reference", "Product soldVia Channel"],
    kpis: [
      { label: "SKUs with gap", value: "148" },
      { label: "Avg. price gap", value: "-4.6%" },
      { label: "Mapping coverage", value: "84.1%" },
      { label: "Revenue exposed", value: "$1.1M" },
    ],
    sourceTable: "ft_market.competitor_price_daily",
    modelVersion: "price-match-v2.2",
    confidence: "79%",
    highlight: ["prod", "chan"],
  },
};

export const CAUSAL_TRACE_STEPS = [
  { step: "Customer", detail: "C001 · Champion segment, Premium Loyal cluster", finding: "High product affinity (0.81) with Personal Care." },
  { step: "Affinity", detail: "Nivea Body Lotion 400ml", finding: "Repeat purchaser — 6 buys in the last 12 months." },
  { step: "Baseline", detail: "0.82 units without promotion", finding: "Baseline demand is low/moderate — headroom exists." },
  { step: "CATE", detail: "Exposure +0.06 · Dose +0.41", finding: "Exposure CATE is positive; dose effect dominates." },
  { step: "Response Curve", detail: "Personal Care · Premium Loyal", finding: "Dose CATE peaks between 15% and 20% depth." },
  { step: "Cannibalization", detail: "Dove Body Lotion 400ml", finding: "Moderate substitution risk — 20% rate, $400 margin loss." },
  { step: "Pull-Forward", detail: "9.4% of promo volume", finding: "Pull-forward risk is low for this purchase cycle." },
  { step: "NIM", detail: "$2.10 per targeted customer", finding: "Net incremental margin is positive after all corrections." },
  { step: "Constraint", detail: "Supplier Agreement cap 20%", finding: "Supplier limit prevents a deeper discount than 20%." },
  { step: "Optimizer", detail: "MILP under budget + constraint set", finding: "Selected 15% Regular / 20% Prime as the optimal package." },
  { step: "Recommendation", detail: "15% Regular / 20% Prime", finding: "Needs Discount: YES · Confidence High." },
];
