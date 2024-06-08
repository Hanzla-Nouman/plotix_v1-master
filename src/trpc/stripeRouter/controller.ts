import { stripe, convertToCents } from "@/lib/stripe";
import {
  TCreateAccountSessionInput,
  TCreateCheckoutSessionInput,
  TCreateAccountInput,
} from "./schema";
import { TRPCError } from "@trpc/server";

export const createAccount = async ({
  input,
}: {
  input: TCreateAccountInput;
}) => {
  try {
    const account = await stripe.accounts.create({
      country: input.country || "GB",
      type: "custom",
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });

    return { accountId: account.id };
  } catch (error: any) {
    console.error(
      "An error occurred when calling the Stripe API to create an account:",
      error
    );

    return { error: error?.message as string };
  }
};

export const createAccountSession = async ({
  input,
}: {
  input: TCreateAccountSessionInput;
}) => {
  try {
    const accountSession = await stripe.accountSessions.create({
      account: input.accountId,
      components: {
        account_onboarding: {
          enabled: true,
          features: { external_account_collection: true },
        },
        notification_banner: {
          enabled: true,
          features: { external_account_collection: true },
        },
        balances: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
            edit_payout_schedule: true,
          },
        },
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
            destination_on_behalf_of_charge_management: true,
          },
        },
        payouts_list: {
          enabled: true,
        },
        payouts: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
            edit_payout_schedule: true,
          },
        },
        account_management: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
      },
    });

    return {
      client_secret: accountSession.client_secret,
    };
  } catch (error: any) {
    console.error(
      "An error occurred when calling the Stripe API to create an account session",
      error
    );
    return { error: error?.message as string };
  }
};

export const createCheckoutSession = async ({
  input,
}: {
  input: TCreateCheckoutSessionInput;
}) => {
  try {
    const session = await stripe.checkout.sessions.create(
      {
        line_items: [
          {
            ...input.product,
            price_data: {
              ...input.product.price_data,
              unit_amount: convertToCents(input.product.price_data.unit_amount),
            },
          },
        ],
        payment_intent_data: {
          // TO DO: uncomment to add application fee
          // application_fee_amount: ,
        },
        mode: "payment",
        ui_mode: "embedded",
        return_url: `${process.env.NEXT_PUBLIC_URL}/checkout/thank-you`,
      },
      {
        stripeAccount: input.stripeCoachAccountId,
      }
    );

    return session;
  } catch (error: any) {
    console.error(
      "An error occurred when calling the Stripe API to create a checkout session",
      error
    );
    throw new TRPCError({
      message: error?.message as string,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
