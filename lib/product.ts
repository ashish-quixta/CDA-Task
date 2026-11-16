export type FulfillmentOption = {
  code: "pickup" | "delivery";
  label: string;
  priceCents: number;
};

export type ExtraOption = {
  code: string;
  label: string;
  priceCents: number;
  requires: "pickup" | "delivery" | null;
};

export type Product = {
  name: string;
  description: string;
  priceCents: number;
  fulfillment: FulfillmentOption[];
  extras: ExtraOption[];
};

/** Single source of product prices and copy. Used by the API route only. */
export const PRODUCT: Product = {
  name: "Linden shelf",
  description: "A solid linden wall shelf with hidden brackets.",
  priceCents: 18000,
  fulfillment: [
    { code: "pickup", label: "Pickup", priceCents: 0 },
    { code: "delivery", label: "Delivery", priceCents: 2500 },
  ],
  extras: [
    {
      code: "assembly",
      label: "Assembly",
      priceCents: 4000,
      requires: "delivery",
    },
    {
      code: "hardware",
      label: "Hardware kit",
      priceCents: 3000,
      requires: null,
    },
  ],
};
