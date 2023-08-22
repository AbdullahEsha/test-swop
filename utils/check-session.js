import stripe from 'stripe';

const stripeClient = stripe(
  process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
);

export function checkoutSession(sessionId) {
  return stripeClient.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });
}
