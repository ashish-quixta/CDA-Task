"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiTool } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
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
      className="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-lg bg-white p-0 text-zinc-900 shadow-xl backdrop:bg-black/40 open:flex open:flex-col"
    >
      {confirmed ? (
        <div className="p-6">
          <OrderConfirmation order={confirmed} onDone={handleDone} />
        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onValid)}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          <div className="space-y-6 border-b border-zinc-200 p-6 md:border-b-0 md:border-r">
            <h2 id="order-dialog-title" className="text-xl font-semibold">
              Configure your shelf
            </h2>

            <fieldset
              className="space-y-3 border-0 p-0"
              aria-describedby={
                errors.fulfillment ? "fulfillment-error" : undefined
              }
            >
              <legend className="mb-2 text-sm font-medium text-zinc-900">
                Fulfillment
              </legend>
              <div className="flex flex-col items-center gap-3 lg:items-start">
                <label className="flex w-56 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800">
                  <input
                    type="radio"
                    value="pickup"
                    className="accent-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
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
                    className="size-4 text-zinc-600"
                  />
                  Pickup ($0)
                </label>
                <label className="flex w-56 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800">
                  <input
                    type="radio"
                    value="delivery"
                    className="accent-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    {...fulfillmentRegister}
                  />
                  <MdLocalShipping
                    aria-hidden="true"
                    className="size-4 text-zinc-600"
                  />
                  Delivery ($25)
                </label>
              </div>
              {errors.fulfillment?.message ? (
                <p
                  id="fulfillment-error"
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {errors.fulfillment.message}
                </p>
              ) : null}
            </fieldset>

            <fieldset className="space-y-3 border-0 p-0">
              <legend className="mb-2 text-sm font-medium text-zinc-900">
                Extras
              </legend>
              <div className="flex flex-col items-center gap-3 lg:items-start">
                <div className="w-56 space-y-1">
                  <label className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800">
                    <input
                      type="checkbox"
                      disabled={fulfillment !== "delivery"}
                      aria-invalid={errors.assembly ? true : undefined}
                      aria-describedby="assembly-hint"
                      className="accent-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:opacity-50"
                      {...register("assembly")}
                    />
                    <MdHandyman
                      aria-hidden="true"
                      className="size-4 text-zinc-600"
                    />
                    Assembly ($40)
                  </label>
                  <p id="assembly-hint" className="text-xs text-zinc-500">
                    Available with delivery only.
                  </p>
                  {errors.assembly?.message ? (
                    <p role="alert" className="text-sm text-red-600">
                      {errors.assembly.message}
                    </p>
                  ) : null}
                </div>

                <label className="flex w-56 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800">
                  <input
                    type="checkbox"
                    className="accent-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    {...register("hardwareKit")}
                  />
                  <FiTool aria-hidden="true" className="size-4 text-zinc-600" />
                  Hardware kit ($30)
                </label>
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-2 border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                <HiOutlineShoppingBag aria-hidden="true" className="size-4" />
                Add to order
              </button>
            </div>
          </div>

          <aside className="bg-zinc-50 p-6">
            <h3 className="text-lg font-semibold text-zinc-900">
              Order summary
            </h3>
            <ul className="mt-6 space-y-3">
              {lineItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm text-zinc-700"
                >
                  <span>{item.label}</span>
                  <span className="font-medium text-zinc-900">
                    {formatUsd(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4">
              <span className="text-sm font-medium text-zinc-900">Total</span>
              <output
                aria-live="polite"
                className="text-xl font-semibold text-zinc-900"
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
