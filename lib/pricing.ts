import type { Product } from "@/lib/product";

export type Fulfillment = "pickup" | "delivery";

export type Selection = {
  fulfillment?: Fulfillment;
  assembly: boolean;
  hardwareKit: boolean;
};

export type LineItem = {
  id: string;
  label: string;
  amountCents: number;
};

export function getLineItems(
  product: Product,
  sel: Selection,
): LineItem[] {
  const items: LineItem[] = [
    { id: "shelf", label: product.name, amountCents: product.priceCents },
  ];

  const fulfillment = product.fulfillment.find(
    (option) => option.code === sel.fulfillment,
  );
  if (fulfillment) {
    items.push({
      id: "fulfillment",
      label: fulfillment.label,
      amountCents: fulfillment.priceCents,
    });
  }

  const assembly = product.extras.find((extra) => extra.code === "assembly");
  if (sel.fulfillment === "delivery" && sel.assembly && assembly) {
    items.push({
      id: "assembly",
      label: assembly.label,
      amountCents: assembly.priceCents,
    });
  }

  const hardware = product.extras.find((extra) => extra.code === "hardware");
  if (sel.hardwareKit && hardware) {
    items.push({
      id: "hardware",
      label: hardware.label,
      amountCents: hardware.priceCents,
    });
  }

  return items;
}

/** Confirmation lists fulfillment + selected extras only (not the shelf). */
export function getConfirmationItems(
  product: Product,
  sel: Selection,
): LineItem[] {
  return getLineItems(product, sel).filter((item) => item.id !== "shelf");
}

export function calcTotalCents(product: Product, sel: Selection): number {
  return getLineItems(product, sel).reduce(
    (sum, item) => sum + item.amountCents,
    0,
  );
}

/** Format cents as USD with no fractional cents, e.g. 27500 → "$275". */
export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function optionLabel(label: string, priceCents: number): string {
  return `${label} (${formatUsd(priceCents)})`;
}
