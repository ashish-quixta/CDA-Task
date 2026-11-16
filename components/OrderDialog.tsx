"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@/lib/product";
import { orderSchema, type OrderInput } from "@/lib/order-schema";
import {
  calcTotalCents,
  formatUsd,
  getLineItems,
  optionLabel,
} from "@/lib/pricing";
import OrderConfirmation from "@/components/OrderConfirmation";

type OrderDialogProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

const emptyDefaults = {
  fulfillment: undefined,
  assembly: false,
  hardwareKit: false,
} as const;

const optionClass =
  "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50";

export default function OrderDialog({
  open,
  onClose,
  product,
}: OrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirmed, setConfirmed] = useState<OrderInput | null>(null);

  const pickup = product.fulfillment.find((o) => o.code === "pickup")!;
  const delivery = product.fulfillment.find((o) => o.code === "delivery")!;
  const assemblyExtra = product.extras.find((o) => o.code === "assembly")!;
  const hardwareExtra = product.extras.find((o) => o.code === "hardware")!;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      fulfillment: undefined,
      assembly: false,
      hardwareKit: false,
    },
  });

  const [fulfillment, assembly, hardwareKit] = useWatch({
    control,
    name: ["fulfillment", "assembly", "hardwareKit"],
  });

  const selection = {
    fulfillment,
    assembly: !!assembly,
    hardwareKit: !!hardwareKit,
  };
  const lineItems = getLineItems(product, selection);
  const total = calcTotalCents(product, selection);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      reset({ ...emptyDefaults });
      setConfirmed(null);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, reset]);

  const fulfillmentRegister = register("fulfillment");

  function onValid(data: OrderInput) {
    setConfirmed(orderSchema.parse(data));
  }

  function handleDone() {
    reset({ ...emptyDefaults });
    setConfirmed(null);
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="order-dialog-title"
      onClose={onClose}
      className="order-dialog"
    >
      {confirmed ? (
        <div className="p-5 sm:p-6">
          <OrderConfirmation
            product={product}
            order={confirmed}
            onDone={handleDone}
          />
        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onValid)}
          className="space-y-5 p-5 sm:p-6"
        >
          <h2 id="order-dialog-title" className="text-xl font-bold">
            Configure your shelf
          </h2>

          <fieldset
            className="space-y-2 border-0 p-0"
            aria-describedby={
              errors.fulfillment ? "fulfillment-error" : undefined
            }
          >
            <legend className="mb-2 text-sm font-semibold">Fulfillment</legend>
            <div className="space-y-2">
              <label className={optionClass}>
                <input
                  type="radio"
                  value="pickup"
                  className="accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  {...fulfillmentRegister}
                  onChange={(e) => {
                    void fulfillmentRegister.onChange(e);
                    if (e.target.value === "pickup") {
                      setValue("assembly", false);
                    }
                  }}
                />
                {optionLabel(pickup.label, pickup.priceCents)}
              </label>
              <label className={optionClass}>
                <input
                  type="radio"
                  value="delivery"
                  className="accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  {...fulfillmentRegister}
                />
                {optionLabel(delivery.label, delivery.priceCents)}
              </label>
            </div>
            {errors.fulfillment?.message ? (
              <p
                id="fulfillment-error"
                role="alert"
                className="text-sm font-medium text-error"
              >
                {errors.fulfillment.message}
              </p>
            ) : null}
          </fieldset>

          <fieldset className="space-y-2 border-0 p-0">
            <legend className="mb-2 text-sm font-semibold">Extras</legend>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className={optionClass}>
                  <input
                    type="checkbox"
                    disabled={fulfillment !== "delivery"}
                    aria-invalid={errors.assembly ? true : undefined}
                    aria-describedby="assembly-hint"
                    className="accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
                    {...register("assembly")}
                  />
                  {optionLabel(assemblyExtra.label, assemblyExtra.priceCents)}
                </label>
                <p id="assembly-hint" className="pl-1 text-xs text-muted">
                  Available with delivery only.
                </p>
                {errors.assembly?.message ? (
                  <p role="alert" className="text-sm font-medium text-error">
                    {errors.assembly.message}
                  </p>
                ) : null}
              </div>

              <label className={optionClass}>
                <input
                  type="checkbox"
                  className="accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  {...register("hardwareKit")}
                />
                {optionLabel(hardwareExtra.label, hardwareExtra.priceCents)}
              </label>
            </div>
          </fieldset>

          <div className="rounded-md bg-surface p-3">
            <ul className="space-y-1 text-sm text-muted">
              {lineItems.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>{item.label}</span>
                  <span>{formatUsd(item.amountCents)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold">Total</span>
              <output
                role="status"
                aria-live="polite"
                className="text-xl font-bold"
              >
                {formatUsd(total)}
              </output>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-none"
            >
              Add to order
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
