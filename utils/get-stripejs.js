// ./utils/get-stripejs.js
import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise;
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export default getStripe;
