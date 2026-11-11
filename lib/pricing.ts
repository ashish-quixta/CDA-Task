export type Fulfillment = "pickup" | "delivery";

export type Selection = {
  fulfillment?: Fulfillment;
  assembly: boolean;
  hardwareKit: boolean;
};

export const SHELF = {
  name: "Linden shelf",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  price: 180,
} as const;

export function getLineItems(
  sel: Selection,
): { id: string; label: string; amount: number }[] {
  const items: { id: string; label: string; amount: number }[] = [
    { id: "shelf", label: SHELF.name, amount: SHELF.price },
  ];

  if (sel.fulfillment === "pickup") {
    items.push({ id: "fulfillment", label: "Pickup", amount: 0 });
  } else if (sel.fulfillment === "delivery") {
    items.push({ id: "fulfillment", label: "Delivery", amount: 25 });
  }

  if (sel.fulfillment === "delivery" && sel.assembly) {
    items.push({ id: "assembly", label: "Assembly", amount: 40 });
  }

  if (sel.hardwareKit) {
    items.push({ id: "hardware-kit", label: "Hardware kit", amount: 30 });
  }

  return items;
}

export function calcTotal(sel: Selection): number {
  return getLineItems(sel).reduce((sum, item) => sum + item.amount, 0);
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
