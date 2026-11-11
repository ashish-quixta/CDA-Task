"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiTool } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { MdHandyman, MdLocalShipping, MdStorefront } from "react-icons/md";
import { orderSchema, type OrderInput } from "@/lib/order-schema";
import { calcTotal, formatUsd, getLineItems } from "@/lib/pricing";
import OrderConfirmation from "@/components/OrderConfirmation";

type OrderDialogProps = {
  open: boolean;
  onClose: () => void;
};

const emptyDefaults = {
  fulfillment: undefined,
  assembly: false,
  hardwareKit: false,
} as const;

const optionClass =
  "flex w-56 items-center gap-2 rounded-md border-[2px] border-border bg-card px-3 py-2 text-sm text-border shadow-[2px_2px_0_0_var(--border)]";

export default function OrderDialog({ open, onClose }: OrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirmed, setConfirmed] = useState<OrderInput | null>(null);

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
  const lineItems = getLineItems(selection);
  const total = calcTotal(selection);

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
      className="m-auto w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-md border-[3px] border-border bg-card p-0 text-border shadow-[6px_6px_0_0_var(--border)] backdrop:bg-black/45 open:flex open:flex-col"
    >
      {confirmed ? (
        <div className="p-6 sm:p-8">
          <OrderConfirmation order={confirmed} onDone={handleDone} />
        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onValid)}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          <div className="space-y-6 border-b-[3px] border-border p-6 md:border-b-0 md:border-r-[3px] sm:p-7">
            <h2
              id="order-dialog-title"
              className="font-[family-name:var(--font-display)] text-2xl font-bold text-border"
            >
              Configure your shelf
            </h2>

            <fieldset
              className="space-y-3 border-0 p-0"
              aria-describedby={
                errors.fulfillment ? "fulfillment-error" : undefined
              }
            >
              <legend className="mb-2 text-xs font-semibold tracking-[0.14em] text-[#7a3b32] uppercase">
                Fulfillment
              </legend>
              <div className="flex flex-col items-center gap-3 lg:items-start">
                <label className={optionClass}>
                  <input
                    type="radio"
                    value="pickup"
                    className="accent-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
                    {...fulfillmentRegister}
                    onChange={(e) => {
                      void fulfillmentRegister.onChange(e);
                      if (e.target.value === "pickup") {
                        setValue("assembly", false);
                      }
                    }}
                  />
                  <MdStorefront
                    aria-hidden="true"
                    className="size-4 text-cta"
                  />
                  Pickup ($0)
                </label>
                <label className={optionClass}>
                  <input
                    type="radio"
                    value="delivery"
                    className="accent-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
                    {...fulfillmentRegister}
                  />
                  <MdLocalShipping
                    aria-hidden="true"
                    className="size-4 text-cta"
                  />
                  Delivery ($25)
                </label>
              </div>
              {errors.fulfillment?.message ? (
                <p
                  id="fulfillment-error"
                  role="alert"
                  className="text-sm font-medium text-cta"
                >
                  {errors.fulfillment.message}
                </p>
              ) : null}
            </fieldset>

            <fieldset className="space-y-3 border-0 p-0">
              <legend className="mb-2 text-xs font-semibold tracking-[0.14em] text-[#7a3b32] uppercase">
                Extras
              </legend>
              <div className="flex flex-col items-center gap-3 lg:items-start">
                <div className="w-56 space-y-1">
                  <label className={optionClass}>
                    <input
                      type="checkbox"
                      disabled={fulfillment !== "delivery"}
                      aria-invalid={errors.assembly ? true : undefined}
                      aria-describedby="assembly-hint"
                      className="accent-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border disabled:opacity-50"
                      {...register("assembly")}
                    />
                    <MdHandyman
                      aria-hidden="true"
                      className="size-4 text-cta"
                    />
                    Assembly ($40)
                  </label>
                  <p id="assembly-hint" className="text-xs text-muted">
                    Available with delivery only.
                  </p>
                  {errors.assembly?.message ? (
                    <p role="alert" className="text-sm font-medium text-cta">
                      {errors.assembly.message}
                    </p>
                  ) : null}
                </div>

                <label className={optionClass}>
                  <input
                    type="checkbox"
                    className="accent-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
                    {...register("hardwareKit")}
                  />
                  <FiTool aria-hidden="true" className="size-4 text-cta" />
                  Hardware kit ($30)
                </label>
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-3 border-t-[2px] border-border pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border-[2px] border-border bg-panel px-4 py-2 text-sm font-semibold text-border shadow-[2px_2px_0_0_var(--border)] transition hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md border-[2px] border-border bg-cta px-4 py-2 text-sm font-bold tracking-wide text-white uppercase shadow-[3px_3px_0_0_var(--border)] transition hover:bg-cta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
              >
                <HiOutlineShoppingCart aria-hidden="true" className="size-4" />
                Add to order
              </button>
            </div>
          </div>

          <aside className="bg-panel p-6 sm:p-7">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-border">
              Order summary
            </h3>
            <ul className="mt-6 space-y-3 rounded-md border-[2px] border-border bg-card p-4 shadow-[2px_2px_0_0_var(--border)]">
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
            <div className="mt-6 flex items-center justify-between border-t-[2px] border-border pt-4">
              <span className="text-sm font-semibold tracking-wide text-border uppercase">
                Total
              </span>
              <output
                aria-live="polite"
                className="font-[family-name:var(--font-display)] text-2xl font-bold text-border"
              >
                {formatUsd(total)}
              </output>
            </div>
          </aside>
        </form>
      )}
    </dialog>
  );
}
