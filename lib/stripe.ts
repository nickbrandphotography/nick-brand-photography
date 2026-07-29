/**
 * Stripe client for Nick Brand Photography.
 *
 * Required env var (set in Vercel — Nick adds this himself, never pasted
 * into code or into chat with an AI assistant):
 *   STRIPE_SECRET_KEY        (starts with sk_live_... or sk_test_...)
 *
 * Also required for the webhook route (see app/api/stripe/webhook/route.ts):
 *   STRIPE_WEBHOOK_SECRET     (starts with whsec_...)
 *
 * This module is server-only — never imported from client components.
 */

import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Lazily-constructed singleton Stripe client. Throws a clear error if the
 * secret key hasn't been configured yet, so failures are obvious instead of
 * a cryptic "Invalid API Key" deep inside the Stripe SDK. */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY in env. Add it in Vercel → Project Settings → Environment Variables, using the Secret key from the Stripe Dashboard (Developers → API keys).",
    );
  }
  _stripe = new Stripe(key);
  return _stripe;
}

/** True once STRIPE_SECRET_KEY is configured. Lets API routes fail fast
 * with a friendly message instead of a raw Stripe SDK error. */
export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
