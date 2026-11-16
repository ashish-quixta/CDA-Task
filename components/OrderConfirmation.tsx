"use client";

import type { Product } from "@/lib/product";
import type { OrderInput } from "@/lib/order-schema";
import {
  calcTotalCents,
  formatUsd,
  getConfirmationItems,
} from "@/lib/pricing";

type OrderConfirmationProps = {
  product: Product;
  order: OrderInput;
  onDone: () => void;
};

export default function OrderConfirmation({
  product,
  order,
  onDone,
}: OrderConfirmationProps) {
  const items = getConfirmationItems(product, order);
  const total = calcTotalCents(product, order);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Added to your order</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm text-muted"
          >
            <span>{item.label}</span>
            <span className="font-semibold text-foreground">
              {formatUsd(item.amountCents)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-border pt-4 text-base font-semibold">
        <span>Total</span>
        <span className="text-2xl font-bold">{formatUsd(total)}</span>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Back to product
      </button>
    </div>
  );
}
