import Stripe from "stripe";

const secretKey =
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_mock_key_for_development_and_build_only";

export const stripe = new Stripe(secretKey, {
  typescript: true,
});
