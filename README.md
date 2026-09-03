# FarmaTodo Intelligence Studio

Build a professional enterprise-grade frontend prototype called:

"FarmaTodo Promotion Intelligence Studio"

Subtitle:

"CXO Strategy Planner"

This is a frontend-only prototype for the FarmaTodo Personalized Promotional Optimization Engine covering Phase 0, Phase 1, Phase 2 and the planned Phase 3 ontology/knowledge-graph layer.

IMPORTANT:

- Use the attached screenshots as the primary visual reference for layout, spacing, hierarchy and interaction style.

- Do NOT copy the screenshots pixel-for-pixel.

- Create a polished, modern enterprise analytics application inspired by the screenshots.

- Use a LIGHT THEME.

- The UI should feel like a real retail/promotion optimization product used by Category Managers, Pricing Managers, Marketing Managers and CXO-level planners.

- Make it professional enough for a client demo.

- Use realistic FarmaTodo terminology from the project documentation.

- Use realistic mock data.

- No backend integration is required at this stage.

- All interactions should work with frontend mock state/data.

- Do not invent unrelated business features.

- Keep the terminology aligned with the Farmatodo promotional optimization documentation.

==================================================

1. GLOBAL VISUAL DESIGN

==================================================

Use:

- Light background

- White cards

- Thin subtle borders

- Very soft shadows

- Blue as the primary action/accent color

- Green for positive outcomes

- Red/orange for warnings or negative economics

- Dark navy/charcoal text

- Muted gray secondary text

- Rounded corners but not overly rounded

- Dense but readable enterprise tables

- Consistent 8px spacing system

- Professional typography

- Responsive desktop-first layout

The visual language should resemble:

- Enterprise analytics platform

- Pricing/revenue management software

- Retail planning software

- Modern data/AI platform

Avoid:

- Excessive gradients

- Large decorative illustrations

- Consumer-app styling

- Excessive animations

- Huge typography

- Dark mode

- Cartoonish UI

==================================================

2. GLOBAL APPLICATION SHELL

==================================================

Create a top navigation bar.

Brand:

FarmaTodo Promotion Intelligence Studio

Subtitle:

CXO Strategy Planner

Top navigation:

1. Spot Planning

2. Scenario Engine

3. Causal Layer

4. Campaign Planning

5. Knowledge Graph

Right side:

- Environment indicator: LIVE

- Current country selector: Colombia / Venezuela

- Notification icon

- User/profile menu

The primary navigation should allow switching between the main modules without page reload.

==================================================

3. PAGE 1 — SPOT PLANNING

==================================================

This should be the default landing page.

Use the first attached screenshot as the main visual inspiration.

Purpose:

This page gives the planner an overview of current promotional performance and allows them to inspect promotion "spots" at campaign × SKU × week × region × channel level.

TOP FILTER BAR

Create:

Campaign

Channel

Region

SKU

Week

Scenario

Example values:

Campaign:

- All

- Summer Boost

- Flash Sale Q3

- Back to School

- Mid-Year

- Beauty Week

- OTC Reactivation

Channel:

- All

- Grocery

- Club

- Convenience

- eCommerce

- Pharmacy

Region:

- All

- North

- South

- East

- West

- Central

SKU:

- All

- SKU-4412

- SKU-7823

- SKU-1034

- SKU-9901

Week:

- All

- W09

- W10

- W11

- W12

Scenario:

- Standard

- Optimized

- Planner Override

Add Reset button.

==================================================

4. SPOT PLANNING KPI CARDS

==================================================

Create KPI cards similar to the screenshot.

Important KPIs:

1. Total Revenue

2. Average ROI

3. Promo Spend

4. Incremental Units

5. Average Margin

6. Cannibalization Rate

7. Fill Rate

8. Active Promotions

9. Redemption Rate

10. Lift Index

Example mock values:

Total Revenue:

$1.24M

+8.3%

Average ROI:

2.86x

+12.1%

Promo Spend:

$432K

-3.2%

Incremental Units:

30.7K

+15.4%

Average Margin:

20.6%

+2.1%

Cannibalization:

7.5%

-1.8%

Fill Rate:

94.2%

+0.8%

Active Promos:

48

+6%

Redemption Rate:

34.1%

+4.5%

Lift Index:

1.42

+9.7%

Use trend indicators.

==================================================

5. SPOT PLANNING GRID

==================================================

Create a detailed enterprise table.

Table grouping:

IDENTITY

- Campaign

- SKU

- Week

- Region

- Channel

PRICING

- Regular Price

- Promo Price

VOLUME

- Base Units

- Uplift

- Total Units

FINANCIALS

- Incremental Sales

- Base Revenue

- Total Revenue

PROFITABILITY

- Incremental Margin

- Total Margin

EFFICIENCY

- ROI

- Budget Utilization

SIGNAL

- Cannibalization

- Confidence

- Submit / Approve

Example row:

Campaign:

Summer Boost

SKU:

SKU-4412

Week:

W09

Region:

North

Channel:

Grocery

Regular Price:

$40

Promo Price:

$34

Base Units:

1,200

Uplift:

+350

Total Units:

1.6K

Incremental Sales:

$11.9K

Base Revenue:

$48.0K

Total Revenue:

$52.7K

Incremental Margin:

$6.9K

Total Margin:

$28.5K

ROI:

142%

Budget Utilization:

35%

Cannibalization:

3.2%

Confidence:

87%

Allow clicking a row to open a detailed right-side drawer.

==================================================

6. ROW DETAIL DRAWER

==================================================

When the user clicks a spot, open a detailed panel.

Display:

Campaign

SKU

Country

Region

Channel

Week

Regular Price

Promo Price

Discount Depth

Base Units

Expected Incremental Units

Expected Total Units

Incremental Revenue

Baseline Revenue

Incremental Margin

NIM

ROI

DER

PPM

Pull-Forward Rate

Cannibalization Rate

Cannibalization Margin Loss

CATE

Confidence

Model Version

Include actions:

- View Causal Explanation

- Open Scenario

- Edit Promo

- Approve

- Override

==================================================

7. PAGE 2 — SCENARIO ENGINE

==================================================

Use the second and third screenshots as visual inspiration.

Purpose:

Allow planners to simulate changes to a promotion and immediately see the economic impact.

TOP FILTERS:

Campaign

Channel

Region

SKU

Week

Scenario

Create a left-side "OFFER CONFIGURATOR".

Controls:

1. Promo Price / Discount Depth

2. Vendor Funding

3. Duration (weeks)

4. Inventory Availability (%)

5. Marketing Spend

6. Promo Fatigue toggle/index

Example:

Promo Depth:

10%

Vendor Funding:

$1,500

Duration:

4 weeks

Inventory Availability:

88%

Marketing Spend:

$5,000

Promo Fatigue:

Current index 0.82

Add:

RESET SCENARIO

RUN SIMULATION

==================================================

8. SCENARIO KPI CARDS

==================================================

Top cards:

SIM. UPLIFT

SIM. INC. SALES

SIM. REVENUE

SIM. INC. MARGIN

SIM. ROI

SIM. BUDGET UTIL.

SIM. CONFIDENCE

Each card should show:

Baseline → Simulated

Example:

Sim. Uplift:

5,254 → 5,796

Sim. Inc. Sales:

$171.1K → $186.4K

Sim. Revenue:

$640.4K → $690.7K

Sim. Inc. Margin:

$97.4K → $106.1K

Sim. ROI:

133% → 143%

Budget Util:

37% → 37%

Confidence:

77% → 77%

==================================================

9. SCENARIO WATERFALL

==================================================

Create a waterfall chart titled:

"Profit Journey Waterfall — Promotional Margin Build"

Stages:

Base Sales

Uplift

Halo

Cannibalization

Markdown

Ops Friction

Incremental Margin

Green for positive impact.

Red/orange for negative impact.

Blue for starting/base and final result.

This should be interactive and update when the scenario sliders change.

==================================================

10. SENSITIVITY ANALYSIS

==================================================

Create a chart:

"Sensitivity — Margin Impact"

Factors:

Offer Depth

Inventory Availability

Vendor Funding

Marketing Spend

Duration

Show positive and negative sensitivity bars.

Example:

Offer Depth:

-18% / +22%

Inventory Availability:

-14% / +11%

Vendor Funding:

-9% / +15%

Marketing Spend:

-7% / +12%

Duration:

-5% / +8%

==================================================

11. SIMULATED SPOT TABLE

==================================================

Below the scenario analysis, show a table similar to Spot Planning.

Title:

"Simulated Spot Table"

Subtitle:

"Mirrors Spot Planning Grid — Updates live with sliders"

The rows should dynamically update when the user changes:

- Promo depth

- Vendor funding

- Duration

- Inventory availability

- Marketing spend

Display:

Campaign

SKU

Week

Region

Channel

Regular Price

Promo Price

Base Units

Uplift

Total Units

Incremental Sales

Base Revenue

Total Revenue

Incremental Margin

Total Margin

ROI

==================================================

12. PAGE 3 — CAUSAL LAYER

==================================================

This page is critical.

It should visually explain WHY the system recommends a promotion.

Use a professional causal-analysis dashboard.

Header:

"CAUSAL LAYER"

Subtitle:

"Understand why a promotion works — or should not be offered."

Provide filters:

Campaign

Country

Category

Product

Customer Segment

Behavioral Cluster

Discount Depth

==================================================

13. CATE SUMMARY

==================================================

Create KPI cards:

Exposure CATE

Dose CATE

Baseline Units

Expected Promo Units

Incremental Units

Confidence

Example:

Baseline:

0.82 units

Exposure CATE:

+0.06

Dose CATE:

+0.41

Expected Promo Units:

1.29

Incremental Units:

+0.47

Confidence:

89%

Clearly explain visually:

Baseline:

"What the customer would buy without promotion."

CATE:

"What additional demand is caused by the promotion."

==================================================

14. DISCOUNT RESPONSE CURVE

==================================================

Create an interactive line chart:

"Discount Response Curve"

X-axis:

0%

5%

10%

15%

20%

25%

30%

Y-axis:

Expected Incremental Units

Example:

0% → 0.00

5% → 0.05

10% → 0.15

15% → 0.35

20% → 0.70

25% → 0.82

30% → 0.84

Allow selecting:

- Category

- Behavioral Cluster

- Product

Highlight recommended depth.

Show tooltip values.

==================================================

15. PULL-FORWARD ANALYSIS

==================================================

Create a dedicated card/chart:

"Temporal Pull-Forward"

Show:

Promo-period incremental units

Post-promo expected demand

Post-promo actual demand

Pull-forward units

Pull-forward rate

Pull-forward margin loss

Example narrative:

"Some of the observed promotional volume appears to be shifted forward from the customer's expected future purchase cycle."

Include a small timeline:

Normal:

Week 1 → purchase

Week 5 → purchase

Promo:

Week 4 → purchase

Week 5 → no purchase

==================================================

16. CROSS-PRODUCT CANNIBALIZATION

==================================================

Create a section:

"Cross-Product Cannibalization"

Display a table:

Promoted Product

Substitute Product

Incremental Units

Cannibalized Units

Cannibalization Rate

Margin Loss

Example:

Nivea Body Lotion

Dove Body Lotion

+100

-20

20%

$400

Use a visual relationship:

Nivea Body Lotion

       ↓

Substitution

       ↓

Dove Body Lotion

==================================================

17. NIM / ECONOMIC EXPLANATION

==================================================

Create a detailed "Profit Economics" card.

Show:

Incremental Revenue

Incremental Margin

Discount Cost

Baseline Margin Erosion

Pull-Forward Loss

Cannibalization Loss

Campaign Fixed Cost

NIM

ROI

DER

PPM

The user should be able to expand the NIM formula.

Display:

NIM =

Incremental Contribution

- Baseline Margin Erosion

- Pull-Forward Loss

- Cannibalization Loss

- Campaign Fixed Cost

Make NIM visually prominent.

==================================================

18. OFFER RECOMMENDATION

==================================================

Create an "Optimal Offer" section.

Display:

Recommended Regular Discount

Recommended Prime Discount

Expected NIM

Expected Incremental Units

Confidence

Needs Discount Flag

Example:

Recommended Offer:

Regular:

15%

Prime:

20%

Expected Incremental Units:

+0.83

Expected NIM:

$2.10

Confidence:

High

Needs Discount:

YES

Also support:

NO OFFER

When the causal effect is not positive or economics are not profitable.

Show explanation:

"Customer is likely to purchase without the promotion. Discount would primarily erode margin."

==================================================

19. CONSTRAINT EXPLANATION

==================================================

Create a "Constraint Check" panel.

Display:

Regulatory Maximum

Supplier Maximum

Internal Maximum

Effective Maximum

Margin Floor

Budget Status

Example:

Regulatory:

30%

Supplier:

20%

Internal:

25%

Effective:

20%

Status:

PASS

Use:

Green = valid

Orange = warning

Red = violation

Show the source:

INVIMA

SUNDDE

Supplier Agreement

Internal Rule

The planner should understand exactly WHY an offer is capped.

==================================================

20. CAMPAIGN PLANNING PAGE

==================================================

Create a dedicated "Campaign Planning" workspace.

The user enters:

Campaign Name

Campaign Type

Country

Channel

Start Date

End Date

Budget

Season

Products

Regular Discount

Prime Discount

The page should immediately show:

Audience

Expected Redemption

Expected Incremental Units

Expected NIM

DER

PPM

Pull-Forward Risk

Cannibalization Risk

Confidence

IMPORTANT BUSINESS FLOW:

Campaign planning happens at the 15-day milestone.

Represent this visually:

Campaign Start

        ↑

     15 Days

        ↑

Planning / Recommendation Cutoff

Show:

"Planning cutoff: 15 Jun"

"Campaign start: 30 Jun"

==================================================

21. PRODUCT LIST / DISCOUNT ENTRY

==================================================

Create an editable product list.

Columns:

Product

Category

Regular Price

Regular Discount

Prime Discount

Max Allowed Regular

Max Allowed Prime

Constraint Status

Expected NIM

If user enters an invalid discount:

Display an inline warning:

"Discount exceeds supplier limit: maximum 20%"

Also show source:

"Source: Supplier Agreement"

==================================================

22. SIDE-BY-SIDE DISCOUNT COMPARISON

==================================================

When planner changes discount depth, display:

15% Regular / 20% Prime

Estimated NIM = $X

20% Regular / 25% Prime

Estimated NIM = $Y

25% Regular / 30% Prime

Estimated NIM = $Z

Clearly highlight the best NIM option.

==================================================

23. PLANNER OVERRIDE

==================================================

Add an "Override Recommendation" workflow.

Show:

Original Recommendation

Planner Override

Original NIM

Override NIM

NIM Delta

Require a reason:

Supplier Negotiation

Inventory Risk

Budget Constraint

Strategic Priority

Competitive Pressure

Other

After override:

"Impact of Override"

Example:

Original NIM:

$125K

Override NIM:

$117K

Delta:

-$8K

Also show:

"Override recorded for model feedback."

==================================================

24. CAMPAIGN APPROVAL

==================================================

Create an approval summary.

Display:

Audience Size

Total Discount Cost

Expected Incremental Units

Expected Incremental Revenue

Expected NIM

ROI

DER

PPM

Pull-Forward Risk

Cannibalization Risk

Budget Utilization

Constraint Status

Confidence

Buttons:

Save Draft

Submit for Approval

Approve Campaign

==================================================

25. POST-CAMPAIGN MEASUREMENT

==================================================

Create a page/section:

"Post-Campaign Measurement"

Purpose:

Compare predicted performance against actual campaign results.

Show workflow:

Control Assignment

        ↓

Observed Effect

        ↓

Baseline Correction

        ↓

Pull-Forward Correction

        ↓

Cannibalization Correction

        ↓

Final Incrementality

KPIs:

Predicted Incremental Units

Actual Incremental Units

Prediction Error

Predicted NIM

Actual NIM

NIM Variance

ROI

DER

Pull-Forward

Cannibalization

Create a prediction-vs-actual chart.

==================================================

26. KNOWLEDGE GRAPH / ONTOLOGY PAGE

==================================================

Create a professional Phase 3 "Knowledge Graph" workspace.

Purpose:

Connect business entities semantically and allow users to understand relationships and trace recommendations.

Primary node types:

Customer

Product

Category

Campaign

Offer

Season

Channel

Segment

Constraint

Supplier

Incrementality Result

Causal Effect

Show a graphical network view.

Example:

Customer

   ↓

hasAffinity

   ↓

Product

   ↓

partOf

   ↓

Campaign

   ↓

contains

   ↓

Offer

   ↓

constrainedBy

   ↓

Constraint

Also:

Customer

   ↓

respondsTo

   ↓

Offer

   ↓

hasCATE

   ↓

Causal Effect

Product

   ↓

hasSubstitute

   ↓

Product

Campaign

   ↓

measuredBy

   ↓

Incrementality Result

These relationships follow the Phase 3 ontology design. :contentReference[oaicite:1]{index=1}

==================================================

27. KNOWLEDGE GRAPH SEARCH / SPARQL-STYLE QUERY UI

==================================================

Create a query interface.

Header:

"Semantic Query"

Allow a user to type natural-language questions or select predefined query templates.

Examples:

1.

"Find VIP customers exposed to deep discount campaigns with high cannibalization."

2.

"Which campaigns exceeded supplier discount limits?"

3.

"Which products have high substitution risk?"

4.

"Why was this customer given a 20% discount?"

5.

"Show campaigns with positive CATE but negative NIM."

6.

"Find customers who would have purchased without promotion."

7.

"Show all products associated with Personal Care campaigns."

8.

"Show products with competitor-price gaps."

Provide a visual result panel containing:

Query

Entities Found

Relationships Traversed

KPI Results

Source Table

Model Version

Confidence

The goal is to make the graph explainable, not just visually decorative.

==================================================

28. KNOWLEDGE GRAPH KPI PANEL

==================================================

Show ontology/graph-health KPIs:

Triple Density

Schema Compliance Rate

Active Constraint Breach Volume

Competitor Mapping Completeness

Path Connectivity

These are the graph-health KPIs defined in the Phase 3 ontology design. :contentReference[oaicite:2]{index=2}

Also show business/causal KPIs available through the graph:

NIM

DER

PPM

CATE Exposure

CATE Dose

Pull-Forward Rate

Cannibalization Margin Loss

These should be shown as semantic/business KPIs rather than graph-health metrics. :contentReference[oaicite:3]{index=3}

==================================================

29. CAUSAL TRACE / "WHY?"

==================================================

This should be one of the most impressive parts of the UI.

For any recommendation, provide a "WHY?" button.

Example:

Customer C001

Product Nivea

Campaign Mid-Year

Recommended Offer: 15% Regular / 20% Prime

Click "WHY?"

Show:

1. Customer has high product affinity

2. Baseline demand is low/moderate

3. Exposure CATE is positive

4. Dose CATE is highest around 15–20%

5. Pull-forward risk is low

6. Cannibalization risk is moderate

7. NIM is positive

8. Supplier limit prevents deeper discount

9. Optimizer selected 15% / 20%

Visualize as:

Customer

 ↓

Affinity

 ↓

Baseline

 ↓

CATE

 ↓

Response Curve

 ↓

Cannibalization

 ↓

NIM

 ↓

Constraint

 ↓

Optimizer

 ↓

Recommendation

This traceability is a key purpose of Phase 3. :contentReference[oaicite:4]{index=4}

==================================================

30. DATA / MODEL PROVENANCE PANEL

==================================================

Every recommendation should have a small provenance section.

Show:

Dataset Snapshot

Feature Version

Model Version

Code Version

Country

Category

Training Window

Scoring Date

Confidence

Mock values are fine.

This is only a UI representation for the prototype.

==================================================

31. SEARCH / FILTERING

==================================================

Across the application support global filters for:

Country:

Colombia

Venezuela

Category

Product

Brand

Campaign

Channel

Customer Segment

Behavioral Cluster

Week

Season

Keep filter state persistent while navigating pages.

==================================================

32. TOOLTIP / BUSINESS EXPLANATION

==================================================

Every technical metric should have a tooltip explaining it in simple business language.

Examples:

CATE:

"Estimated incremental demand caused by the promotion."

Baseline Units:

"Expected units the customer would purchase without the promotion."

Pull-Forward:

"Demand moved earlier from a future purchase period."

Cannibalization:

"Demand or margin lost from substitute products."

NIM:

"Net incremental margin after promotion costs and cannibalization effects."

DER:

"Incremental revenue generated per unit of discount cost."

PPM:

"Net incremental margin relative to fixed campaign cost."

Affinity:

"Strength of the customer's relationship with a product or category."

==================================================

33. MOCK DATA

==================================================

Create realistic mock data inspired by the project.

Countries:

Colombia

Venezuela

Currencies:

COP

VES

USD

Categories:

OTC

Personal Care

Beauty

Baby

Dermocosmetics

Convenience

Campaign types:

BigMoment

Shot

Leaflet

Mass

Personalized

Reactivation

RX Replenishment

Customer segments:

Champion

Loyalist

Reactivation

At Risk

Replenishment

Promising

Low Engagement

Use realistic values.

Do not use obviously fake placeholder text like:

"Product 1"

"Customer 123"

Use:

Nivea

Dove

Teragrip

etc.

==================================================

34. RESPONSIVE BEHAVIOR

==================================================

Desktop-first.

Primary target:

1440px+

Also make the UI usable at 1280px.

Tables should horizontally scroll when necessary rather than breaking the layout.

Charts should resize.

Side drawers should work smoothly.

==================================================

35. INTERACTION REQUIREMENTS

==================================================

All major controls should actually work using mock frontend state.

Examples:

Changing discount depth:

→ updates simulated price

→ updates uplift

→ updates NIM

→ updates ROI

→ updates waterfall

→ updates sensitivity

→ updates simulated table

Changing country:

→ updates currency and constraints

Selecting a product:

→ updates response curve and CATE

Selecting a customer:

→ updates causal explanation

Clicking "WHY?":

→ opens causal trace

Clicking "Override":

→ opens override form

Clicking "Approve":

→ changes campaign state to Approved

Clicking "Run Simulation":

→ updates all scenario metrics

Clicking "NO OFFER":

→ displays zero discount and zero expected promotional economics

==================================================

36. IMPORTANT BUSINESS LOGIC TO REPRESENT

==================================================

The frontend should visually respect these business concepts:

1. Baseline is the expected purchase without promotion.

2. CATE/uplift is incremental effect caused by promotion.

3. Exposure effect and discount-depth effect are separate.

4. Discount response varies by customer/category/segment.

5. Pull-forward and cross-product cannibalization are separate effects.

6. NIM is the central profitability objective.

7. The optimizer chooses Regular + Prime as a package.

8. NO OFFER is a valid decision.

9. Prime discount must be greater than or equal to Regular discount.

10. Regulatory, supplier and internal constraints must be visible.

11. Budget must be visible.

12. Recommendations are made at the 15-day planning milestone.

13. Post-campaign measurement compares predicted vs actual impact.

14. Phase 3 ontology connects Customer, Product, Campaign, Offer, Category, Season, Channel, Segment and Constraint.

15. Causal traceability should explain why an offer was recommended.

These concepts are all grounded in the Farmatodo promotional optimization documentation. :contentReference[oaicite:5]{index=5}

==================================================

37. DESIGN OF LEFT / RIGHT DRAWERS

==================================================

Use drawers instead of navigating to a completely new page for detailed analysis where possible.

LEFT:

filters/configuration

CENTER:

charts/tables/main analysis

RIGHT:

details / causal explanation / constraints / recommendation

This should create a "control center" feeling.

==================================================

38. FOOTER / STATUS BAR

==================================================

Show small system status:

Data:

Healthy

Model:

Phase 2 Causal

Optimizer:

Ready

Last Refresh:

2026-06-01

Country:

Colombia

Environment:

LIVE

==================================================

39. TECHNOLOGY

==================================================

Use:

React

TypeScript

Tailwind CSS

shadcn/ui

For charts:

Recharts or equivalent.

For graph visualization:

React Flow / Cytoscape / another suitable graph library.

Use reusable components.

Create a clean component architecture:

src/

  components/

  pages/

  layouts/

  charts/

  tables/

  drawers/

  graph/

  data/

  hooks/

  types/

  utils/

Use mock data in a dedicated mock-data layer.

Do not hard-code large amounts of data directly inside components.

==================================================

40. FINAL UX GOAL

==================================================

The user should feel that they are using a real enterprise "Promotion Intelligence Studio".

The product should answer four major questions:

1. WHAT is happening?

   → Spot Planning

2. WHAT IF we change the promotion?

   → Scenario Engine

3. WHY does the model recommend this?

   → Causal Layer

4. HOW are all business entities and metrics connected?

   → Knowledge Graph / Ontology

The overall experience should tell this story:

DATA

  ↓

CUSTOMER UNDERSTANDING

  ↓

BASELINE

  ↓

CAUSAL EFFECT

  ↓

DISCOUNT RESPONSE

  ↓

CANNIBALIZATION

  ↓

NIM

  ↓

OPTIMIZATION

  ↓

RECOMMENDATION

  ↓

CAMPAIGN

  ↓

POST-CAMPAIGN MEASUREMENT

  ↓

KNOWLEDGE GRAPH / TRACEABILITY

Make the final result polished, visually consistent, highly interactive, and presentation-ready for a FarmaTodo client demonstration.

i have also attached the logo , you have to use this logo also

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/34ffb483-8767-4f10-8a9b-37f4fc231ceb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
