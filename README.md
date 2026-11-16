
## Live demo

https://cda-task.vercel.app/

## Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- react-hook-form
- zod
- @hookform/resolvers
- Vitest + React Testing Library (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`)
- react-icons

**Package manager:** npm

## Requirements

- Node version used: `v24.14.1`
- Needs Node 20.9 or newer

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Test

```bash
npm test
```

`pnpm test` and `yarn test` run the same script.

## Time spent

- Total: ~3 hours

## What’s new (Task 2)

Updates for the revised product-order-sheet brief:

- **Product API** — `GET /api/product` returns name, description, `priceCents`, fulfillment, and extras from a single module (`lib/product.ts`)
- **`PRODUCT_API_MODE`** — `error` → HTTP 500 `{ "error": "unavailable" }`; `slow` → 2s delay then normal; unset/other → normal
- **Client fetch** — page loads the product in the browser, with `Loading product…`, `Could not load the product`, and **Try again**
- **Cents pricing** — amounts live only in the product module; UI formats USD with no cents (`$275`)
- **Order sheet behaviour** — fulfillment required, Assembly only with Delivery, Hardware sticky, live total, zod field errors, confirmation without Assembly on Pickup + Hardware
- **Layout** — image placeholder (`role="img"`), responsive product layout, bottom-sheet dialog on small screens and centred modal (max 480px) from 1024px up; primary `#1F4D3A`, errors `#B42318`
- **Tests** — the two required RTL cases (`$275` total; Pickup clears Assembly), plus missing-fulfillment and API-error/retry tests (mock `fetch`, no running server)

Optional local API modes:

```bash
PRODUCT_API_MODE=error npm run dev
PRODUCT_API_MODE=slow npm run dev
```

## Extra work

- Added a third test for the missing-fulfillment validation error
- Added a fourth test for the product API error state and Try again (mock `fetch`)
- Documented `PRODUCT_API_MODE=error` / `slow` for local checking

