# cda-task

A product page for the Linden shelf with an order sheet where shoppers choose fulfillment and extras, see a live total, and confirm the order.

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

## Extra work

- Added a third test for the missing-fulfillment validation error
- Used `react-icons` for cart and option icons
- Fully responsive layout with a small custom visual design for the product page and order dialog
