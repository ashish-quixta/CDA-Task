# cda-task

A product page for the Linden shelf with an order sheet where shoppers choose fulfillment and extras, see a live total, and confirm the order.

## Requirements

- Node `v24.14.1` (this project needs Node 20.9 or newer)

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

- Start: [fill in]
- End: [fill in]
- Total: [fill in]

## Decisions

- Form state lives in react-hook-form. Derived values use `useWatch` and pure functions.
- The dialog uses the native `<dialog>` element for focus management and Escape handling.
- Pricing is a pure module. The total is derived from line items, so the total and the confirmation always match.
- Assembly is rejected by the zod schema and also cleared in the UI when Pickup is chosen.

## Known gaps

- No end-to-end browser test for Escape (jsdom does not simulate native dialog close on Escape).
- No persistence across reloads.

## Next steps

- A real cart
- End-to-end keyboard tests with Playwright
- A server-side price check
