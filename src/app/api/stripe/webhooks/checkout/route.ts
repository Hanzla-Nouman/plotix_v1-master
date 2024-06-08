import { buildStripeWebhookHandler } from "../webhookBuilder";

const endpointSecret = process.env.STRIPE_CHECKOUT_WEBHOOK_SECRET || "";

export const POST = buildStripeWebhookHandler(endpointSecret);
