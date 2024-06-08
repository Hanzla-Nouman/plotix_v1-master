import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { getTrpcCaller } from "@/trpc";
import { NextRequest, NextResponse } from "next/server";

export const buildStripeWebhookHandler =
  (endpointSecret: string) => async (req: NextRequest) => {
    let event: any = await req.text();
    const headersList = headers();
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = headersList.get("stripe-signature") || "";
      try {
        event = stripe.webhooks.constructEvent(
          event,
          signature,
          endpointSecret
        );
      } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return NextResponse.json({ message: err.message }, { status: 403 });
      }
    }

    // Handle the event
    const trpcCaller = await getTrpcCaller();

    switch (event.type) {
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;

        await trpcCaller.purchase.update({
          where: {
            checkoutSessionId: session.id,
          },
          data: {
            paymentStatus: "failed",
          },
        });
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object;
        const purchase = await trpcCaller.purchase.get({
          where: {
            checkoutSessionId: session.id,
            paymentStatus: "notStarted",
          },
        });
        if (purchase) {
          await trpcCaller.purchase.delete({
            where: {
              checkoutSessionId: session.id,
            },
          });
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        await trpcCaller.purchase.update({
          where: {
            checkoutSessionId: session.id,
          },
          data: {
            paymentStatus: "success",
          },
        });
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object;
        await trpcCaller.purchase.update({
          where: {
            checkoutSessionId: session.id,
          },
          data: {
            paymentStatus: "success",
          },
        });
        break;
      }
      case "account.updated": {
        const account = event.data.object;
        await trpcCaller.coach.update({
          where: {
            stripeAccountId: account.id,
          },
          data: {
            stripeDetailsSubmitted: account.details_submitted,
          },
        });
        break;
      }
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({});
  };
