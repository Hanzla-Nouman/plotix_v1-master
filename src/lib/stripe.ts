import Stripe from "stripe";

class StripeClientSingleton {
  private static instance: Stripe | null = null;
  private constructor() {}

  public static getInstance(): Stripe {
    if (!StripeClientSingleton.instance) {
      StripeClientSingleton.instance = new Stripe(
        process.env.STRIPE_SECRET_KEY || ""
      );
    }
    return StripeClientSingleton.instance;
  }
}

export const stripe = StripeClientSingleton.getInstance();

export function convertToCents(amount: number) {
  return amount * 100;
}
