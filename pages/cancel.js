import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { URL } from '../components/Reuses/URL';
import { checkoutSession } from '../utils/check-session';
const ThankYouPage = (props) => {
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

  return (
    <div style={{ backgroundColor: '#fcfcff' }}>
      <Navbar />
      <div className="container-x home-top-margin">
        <div className="my-10">
          <div className="flex justify-center">
            <Image
              src="/payment-failed.gif"
              alt="Cancel Image"
              width={500}
              height={500}
              unoptimized="true"
              className="cancel-sucess"
            />
          </div>
          <div className="flex flex-col items-center gap-y-4">
            <h1 className="text-[#ff5555] text-3xl font-semibold">
              Order Cancelled
            </h1>
            <div>
              <p className="text-gray-800 font-medium">
                Your order is cancelled. You will receive a
              </p>
              <p className="text-gray-800 font-medium text-center">
                cancellation email shortly.
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
  );
};

export default ThankYouPage;
