"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/product";
import { formatUsd } from "@/lib/pricing";
import OrderDialog from "@/components/OrderDialog";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; product: Product };

async function fetchProduct(): Promise<Product> {
  const response = await fetch("/api/product");
  if (!response.ok) {
    throw new Error("unavailable");
  }
  return (await response.json()) as Product;
}

export default function ProductPage() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [open, setOpen] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;

    fetchProduct()
      .then((product) => {
        if (!cancelled) {
          setState({ status: "ready", product });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  function handleRetry() {
    setState({ status: "loading" });
    setRetryKey((key) => key + 1);
  }

  function handleClose() {
    setOpen(false);
    queueMicrotask(() => {
      addButtonRef.current?.focus();
    });
  }

  if (state.status === "loading") {
    return (
      <main className="mx-auto w-full max-w-[960px] px-4 py-10">
        <p role="status">Loading product…</p>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="mx-auto w-full max-w-[960px] px-4 py-10">
        <p role="alert" className="text-error">
          Could not load the product
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try again
        </button>
      </main>
    );
  }

  const { product } = state;

  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-10 lg:py-14">
      <article className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">
        <div
          role="img"
          aria-label={product.name}
          className="aspect-[4/3] w-full bg-placeholder"
        />

        <div>
          <h1 className="text-2xl font-bold leading-tight lg:text-[32px]">
            {product.name}
          </h1>
          <p className="mt-3 text-base leading-7 text-muted">
            {product.description}
          </p>
          <p className="mt-4 text-xl font-semibold lg:text-2xl">
            {formatUsd(product.priceCents)}
          </p>
          <button
            ref={addButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:inline-flex lg:w-auto"
          >
            Add to order
          </button>
        </div>
      </article>

      <OrderDialog open={open} onClose={handleClose} product={product} />
    </main>
  );
}
