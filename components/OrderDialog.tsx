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
  "flex w-full max-w-56 items-center gap-2 rounded-md border-[2px] border-border bg-card px-2.5 py-1.5 text-xs text-border shadow-[2px_2px_0_0_var(--border)] md:px-3 md:py-2 md:text-sm";

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
      className="m-auto w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-md border-[3px] border-border bg-card p-0 text-border shadow-[6px_6px_0_0_var(--border)] backdrop:bg-black/40 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      {confirmed ? (
        <div className="p-4 sm:p-8">
          <OrderConfirmation order={confirmed} onDone={handleDone} />
        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onValid)}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          <div className="space-y-3 border-b-[3px] border-border p-3 md:space-y-6 md:border-b-0 md:border-r-[3px] md:p-7">
            <h2
              id="order-dialog-title"
              className="font-[family-name:var(--font-display)] text-lg font-bold text-border md:text-2xl"
            >
              Configure your shelf
            </h2>

            <fieldset
              className="space-y-2 border-0 p-0 md:space-y-3"
              aria-describedby={
                errors.fulfillment ? "fulfillment-error" : undefined
              }
            >
              <legend className="mb-1 text-[10px] font-semibold tracking-[0.14em] text-[#7a3b32] uppercase md:mb-2 md:text-xs">
                Fulfillment
              </legend>
              <div className="flex flex-col items-center gap-2 md:gap-3 lg:items-start">
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
                    className="size-3.5 text-cta md:size-4"
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
                    className="size-3.5 text-cta md:size-4"
                  />
                  Delivery ($25)
                </label>
              </div>
              {errors.fulfillment?.message ? (
                <p
                  id="fulfillment-error"
                  role="alert"
                  className="text-xs font-medium text-cta md:text-sm"
                >
                  {errors.fulfillment.message}
                </p>
              ) : null}
            </fieldset>

            <fieldset className="space-y-2 border-0 p-0 md:space-y-3">
              <legend className="mb-1 text-[10px] font-semibold tracking-[0.14em] text-[#7a3b32] uppercase md:mb-2 md:text-xs">
                Extras
              </legend>
              <div className="flex flex-col items-center gap-2 md:gap-3 lg:items-start">
                <div className="w-full max-w-56 space-y-0.5">
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
                      className="size-3.5 text-cta md:size-4"
                    />
                    Assembly ($40)
                  </label>
                  <p id="assembly-hint" className="text-[10px] text-muted md:text-xs">
                    Available with delivery only.
                  </p>
                  {errors.assembly?.message ? (
                    <p role="alert" className="text-xs font-medium text-cta md:text-sm">
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
                  <FiTool aria-hidden="true" className="size-3.5 text-cta md:size-4" />
                  Hardware kit ($30)
                </label>
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-2 border-t-[2px] border-border pt-2 md:gap-3 md:pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border-[2px] border-border bg-panel px-3 py-1.5 text-xs font-semibold text-border shadow-[2px_2px_0_0_var(--border)] transition hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border md:px-4 md:py-2 md:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md border-[2px] border-border bg-cta px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-[3px_3px_0_0_var(--border)] transition hover:bg-cta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border md:gap-2 md:px-4 md:py-2 md:text-sm"
              >
                <HiOutlineShoppingCart aria-hidden="true" className="size-3.5 md:size-4" />
                Add to order
              </button>
            </div>
          </div>

          <aside className="bg-panel p-3 md:p-7">
            <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-border md:text-xl">
              Order summary
            </h3>
            <ul className="mt-2 space-y-1 rounded-md border-[2px] border-border bg-card p-2.5 shadow-[2px_2px_0_0_var(--border)] md:mt-6 md:space-y-3 md:p-4">
              {lineItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-xs text-muted md:text-sm"
                >
                  <span>{item.label}</span>
                  <span className="font-semibold text-border">
                    {formatUsd(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between border-t-[2px] border-border pt-2 md:mt-6 md:pt-4">
              <span className="text-xs font-semibold tracking-wide text-border uppercase md:text-sm">
                Total
              </span>
              <output
                aria-live="polite"
                className="font-[family-name:var(--font-display)] text-lg font-bold text-border md:text-2xl"
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
