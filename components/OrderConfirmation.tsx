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
          className="size-7 shrink-0 text-cta"
        />
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-border">
          Added to your order
        </h2>
      </div>
      <ul className="space-y-2 rounded-md border-[2px] border-border bg-panel p-4 shadow-[2px_2px_0_0_var(--border)]">
        {lineItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm text-muted"
          >
            <span>{item.label}</span>
            <span className="font-semibold text-border">
              {formatUsd(item.amount)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t-[2px] border-border pt-4 text-base font-semibold text-border">
        <span className="tracking-wide uppercase">Total</span>
        <span className="font-[family-name:var(--font-display)] text-2xl font-bold">
          {formatUsd(total)}
        </span>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="w-full rounded-md border-[2px] border-border bg-cta px-4 py-2.5 text-sm font-bold tracking-wide text-white uppercase shadow-[3px_3px_0_0_var(--border)] transition hover:bg-cta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
      >
        Back to product
      </button>
    </div>
  );
}
