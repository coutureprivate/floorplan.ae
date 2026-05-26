# Couture Private Estates — Brokerage Portal

A brokerage-facing surface for the **Floor Plan Atlas v1.1** pipeline.
Built with Next.js (App Router), Tailwind, and a small mock-data layer that
mirrors the production v1.1 schema (`projects`, `unit_types`, `floor_plates`,
`unit_instances`).

## Run

```powershell
cd "C:\Users\Lenovo\Downloads\Work\CPE\couture-brokerage-portal"
npm install
npm run dev
```

Then open http://localhost:3000.

## Surfaces

- `/` — dashboard
- `/projects` — filterable gallery (area / bedrooms / view)
- `/projects/[slug]` — project detail with **clickable floor plate**, availability overlay, floor picker, unit-type roster
- `/units/[id]` — shareable unit page with plan, room breakdown, position-on-floor, PDF export
- `/compare?a=&b=` — comparison engine with **true-scale ↔ fit-to-frame** toggle and diff table

## API (mock)

- `GET /api/projects`
- `GET /api/projects/[slug]`
- `GET /api/floor-plates/[id]?floor=N`
- `GET /api/unit-types/[id]`
- `GET /api/units/[id]`
- `GET /api/compare?a=&b=`
- `GET /api/pdf/unit/[id]` — branded unit summary PDF
- `GET /api/pdf/compare?a=&b=` — branded comparison sheet PDF

## Brand

- Headers: **Noto Serif Display**
- Body: **Inter**
- Palette: `#F4F4F4` canvas (60%) · `#333333` ink (30%) · `#252504` deep (5%) · `#8E5734` copper (5%)

## Swap mock data for real

The mock dataset lives in `lib/mockData.ts`. Replace the `PROJECTS`,
unit-type seeds, and floor-plate layouts with scraped data from the developer
groups. The shape matches the v1.1 schema 1:1, so nothing in the UI needs to
change.
