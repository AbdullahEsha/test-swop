import Stripe from 'stripe';

const SECRETKEY = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const item = req.body;
    const stripe = new Stripe(SECRETKEY, {
      apiVersion: '2020-08-27',
    });
    const myArray = item.data.cartArray.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'us_bank_account'],
        line_items: myArray,
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
