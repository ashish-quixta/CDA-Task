"use client";

import { HiOutlineCheckCircle } from "react-icons/hi2";
import { calcTotal, formatUsd, getLineItems } from "@/lib/pricing";
import type { OrderInput } from "@/lib/order-schema";

type OrderConfirmationProps = {
  order: OrderInput;
  onDone: () => void;
};

export default function OrderConfirmation({
  order,
  onDone,
}: OrderConfirmationProps) {
  const lineItems = getLineItems(order);
  const total = calcTotal(order);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HiOutlineCheckCircle
          aria-hidden="true"
          className="size-6 text-zinc-900"
        />
        <h2 className="text-xl font-semibold text-zinc-900">
          Added to your order
        </h2>
      </div>
      <ul className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        {lineItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm text-zinc-700"
          >
            <span>{item.label}</span>
            <span>{formatUsd(item.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-zinc-200 pt-4 text-base font-semibold text-zinc-900">
        <span>Total</span>
        <span>{formatUsd(total)}</span>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Back to product
      </button>
    </div>
  );
}
