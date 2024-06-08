import { z } from "zod";

export const CreateAccountSessionInput = z.object({
  accountId: z.string().min(1),
});

export type TCreateAccountSessionInput = z.infer<
  typeof CreateAccountSessionInput
>;

export const CreateAccountInput = z.object({
  country: z.string(),
});
export type TCreateAccountInput = z.infer<typeof CreateAccountInput>;

export const CreateCheckoutInput = z.object({
  product: z.object({
    price_data: z.object({
      currency: z.string(),
      product_data: z.object({
        name: z.string(),
        images: z.array(z.string()),
      }),
      unit_amount: z.number(),
    }),
    quantity: z.number(),
  }),
  stripeCoachAccountId: z.string(),
});

export type TCreateCheckoutSessionInput = z.infer<typeof CreateCheckoutInput>;
