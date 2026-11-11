import { z } from "zod";

export const orderSchema = z
  .object({
    fulfillment: z.enum(["pickup", "delivery"], {
      error: "Choose pickup or delivery",
    }),
    assembly: z.boolean(),
    hardwareKit: z.boolean(),
  })
  .refine((v) => !(v.assembly && v.fulfillment === "pickup"), {
    message: "Assembly is only available with delivery",
    path: ["assembly"],
  });

export type OrderInput = z.infer<typeof orderSchema>;
