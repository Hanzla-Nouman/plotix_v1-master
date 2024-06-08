import { buildStripeWebhookHandler } from "../webhookBuilder";

const endpointSecret = process.env.STRIPE_ACCOUNT_WEBHOOK_SECRET || "";

export const POST = buildStripeWebhookHandler(endpointSecret);
