"use client";

import { useRef, useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { SHELF, formatUsd } from "@/lib/pricing";
import OrderDialog from "@/components/OrderDialog";

export default function ProductPage() {
  const [open, setOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  function handleClose() {
    setOpen(false);
    queueMicrotask(() => {
      addButtonRef.current?.focus();
    });
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-4 py-12 sm:px-6">
      <article className="rounded-md border-[3px] border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)] sm:p-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-border sm:text-4xl">
          {SHELF.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          {SHELF.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-2xl font-semibold text-border">
            {formatUsd(SHELF.price)}
          </p>
          <button
            ref={addButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border-[2px] border-border bg-cta px-5 py-2.5 text-sm font-bold tracking-wide text-white uppercase shadow-[3px_3px_0_0_var(--border)] transition hover:bg-cta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
          >
            <HiOutlineShoppingCart aria-hidden="true" className="size-4" />
            Add to order
          </button>
        </div>
      </article>

      <OrderDialog open={open} onClose={handleClose} />
    </main>
  );
}
