import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { checkoutSession } from '../utils/check-session';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { URL } from '../components/Reuses/URL';

const SECRETKEY = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

const ThankYouPage = () => {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    async function getSession() {
      if (!session_id) {
        router.push('/');
        return;
      }

      try {
        const session = await checkoutSession(session_id);
        try {
          const res = await axios.put(`${URL}/api/v1/order`, session);
          if (res.status !== 200) {
            console.log('Error:', res.data.error.message);
          }
        } catch (error) {
          console.error(
            'Axios API Error:',
            error.response.data.message
          );
        }
      } catch (error) {
        console.error('Stripe API Error:', error);
      }
    }
    getSession();
  }, [session_id]);

  return session_id ? (
    <div style={{ backgroundColor: '#fcfcff' }}>
      <Navbar />
      <div className="container-x home-top-margin">
        <div className="my-10">
          <div className="flex justify-center">
            <Image
              src="/payment-success.gif"
              alt="Success Image"
              width={500}
              height={500}
              unoptimized="true"
              className="cancel-sucess"
            />
          </div>
          <div className="flex flex-col items-center gap-y-4">
            <h1 className="text-[#55cb77] text-3xl font-semibold">
              Order Confirmed
            </h1>
            <div>
              <p className="text-gray-800 font-medium">
                Your order is confirmed. You will receive an order
              </p>
              <p className="text-gray-800 font-medium text-center">
                confirmation email shortly.
              </p>
            </div>

            <Link href="/shop">
              <button className="text-white continue_shipping">
                CONTINUE SHOPPING
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    ''
  );
};

export default ThankYouPage;
