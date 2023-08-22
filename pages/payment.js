import React, { useEffect, useState, useMemo } from 'react';
import ShippingAddress from '../components/ShippingAddress';
import PaymentForm from '../components/PaymentForm';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { URL } from '../components/Reuses/URL';
import getStripe from '../utils/get-stripejs';
const payment = (props) => {
  const [refCode, setRefCode] = useState('');

  const [shipping, setShipping] = useState('');
  const [isDetails, setIsDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (shipping !== '') {
      setIsDetails(true);
    }
  }, [shipping]);

  const cartProduct = useSelector((state) => state.cart) || {};
  const totalAmount = cartProduct.cart.reduce(
    (accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.quantity;
    },
    0
  );

  const processToOrder = async () => {
    const key = await axios.get(`${URL}/api/v1/credentials`, {});

    const address = {
      street1: shipping.address,
      street2: shipping.address2,
      city: shipping.city,
      state: shipping.state,
      country: shipping.country,
      zip: shipping.zip,
      phoneNumber: shipping.phoneNumber,
    };

    const PUBLISHABLEKEY = key.data.publishKey;
    setLoading(true);
    // const stripePromise = await loadStripe(PUBLISHABLEKEY);
    // const stripe = await stripePromise;
    const stripe = await getStripe();

    const cartArray = await cartProduct.cart.map((item) => {
      return {
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
      };
    });

    const data = {
      cartArray,
      key: key.data.secretKey,
    };

    const checkoutSession = await axios.post('/api/checkout', {
      data,
    });

    const order = {
      paymentId: '',
      sessionId: checkoutSession.data.id,
      paymentStatus: 'pending',
      deliveryStatus: false,
      currency: 'USD',
      customerName: shipping.firstName + ' ' + shipping.lastName,
      email: shipping.email,
      totalCost: `${
        cartProduct.refAmount ? cartProduct.refAmount : totalAmount
      }`,
      items: cartProduct.cart,
      address,
      couponCode: refCode,
    };

    try {
      const res = await axios.post(`${URL}/api/v1/order`, order, {
        withCredentials: true,
      });
      console.log('response data', res);
      if (res.status === 200) {
        const result = await stripe.redirectToCheckout({
          sessionId: checkoutSession.data.id,
        });
        if (result.error) {
          alert(result.error.message);
        }
        setLoading(false);
      } else {
        alert('Something went wrong');
      }
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <>
      {!isDetails ? (
        <>
          <Navbar />
          <ShippingAddress
            shipping={shipping}
            setShipping={setShipping}
            refCode={refCode}
            setRefCode={setRefCode}
          />
          <Footer />
        </>
      ) : (
        <>
          <Navbar />
          <div className="container-x home-top-margin">
            <h1 className="text-2xl text-center my-6">
              Your Products
            </h1>

            <section className="border">
              <div className="order-summary__section--product-list">
                {cartProduct.cart.length > 0 &&
                  cartProduct.cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center py-4 rounded-md m-2"
                    >
                      <div className="product-thumbnail">
                        <div className="product-thumbnail__wrapper">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="product-thumbnail__image"
                          />
                        </div>
                        <span
                          className="product-thumbnail__quantity"
                          aria-hidden="true"
                        >
                          {item.quantity}
                        </span>
                      </div>
                      <div className="text-center sm:text-left">
                        <span className="product__description__name order-summary__emphasis">
                          {item.name}
                        </span>
                      </div>
                      <div className="product__description__price order-summary__emphasis skeleton-while-loading ml-auto">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>
              <hr className=" text-gray-400" />
              <div className="total_summary__section m-2">
                {cartProduct.refAmount && (
                  <div className="total_summary_price mb-2 ">
                    <span>Cut off</span>
                    <span className="line-through">
                      $
                      {`${(
                        totalAmount - cartProduct.refAmount
                      ).toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="total_summary_price mb-1">
                  <span>Subtotal</span>
                  <span>
                    $
                    {`${
                      cartProduct.refAmount
                        ? cartProduct.refAmount.toFixed(2)
                        : totalAmount.toFixed(2)
                    }`}
                  </span>
                </div>
                <div className="total_summary_price">
                  <span>Shipping</span>
                  <span style={{ textDecoration: 'line-through' }}>
                    $5.99
                  </span>
                </div>
              </div>
              <hr className=" text-gray-400" />
              <div className="total_summary_price m-2">
                <span className="payment-due-label__total">
                  Total
                </span>
                <span className="payment-due__price">
                  $
                  {`${
                    cartProduct.refAmount
                      ? cartProduct.refAmount.toFixed(2)
                      : totalAmount.toFixed(2)
                  }`}
                </span>
              </div>
            </section>

            <h1 className="text-2xl text-center my-6">
              Shipping Details
            </h1>

            {/* details section  */}
            <section className="border rounded-lg p-4 mb-6 flex flex-col gap-y-2">
              <div className="flex">
                <p className="font-semibold text-gray-400 w-20">
                  Name:
                </p>
                <span className="text-gray-600 font-semibold">
                  {`${shipping?.firstName} ${shipping?.lastName}`}
                </span>
                {/* <button onClick={() => setIsDetails(false)}>Change</button> */}
              </div>

              <div className="flex">
                <p className="font-semibold text-gray-400 w-20">
                  Email:
                </p>
                <span className="text-gray-600 font-semibold">
                  {shipping?.email}
                </span>
                {/* <button onClick={() => setIsDetails(false)}>Change</button> */}
              </div>

              <div className="flex">
                <p className="font-semibold text-gray-400 w-20">
                  Phone:
                </p>
                <span className="text-gray-600 font-semibold">
                  {shipping?.phoneNumber}
                </span>
                {/* <button onClick={() => setIsDetails(false)}>Change</button> */}
              </div>

              <div className="flex">
                <p className="font-semibold text-gray-400 w-20">
                  Address:
                </p>
                <span className="text-gray-600 font-semibold">
                  {`${shipping?.country}, ${shipping?.city}, ${shipping?.address}, ${shipping?.address2}`}
                </span>
                {/* <button onClick={() => setIsDetails(false)}>Change</button> */}
              </div>

              <div className="flex">
                <p className="font-semibold text-gray-400 w-20">
                  State:
                </p>
                <span className="text-gray-600 font-semibold">
                  {shipping?.state}
                </span>
                {/* <button onClick={() => setIsDetails(false)}>Change</button> */}
              </div>

              <div className="flex">
                <p className="font-semibold text-gray-400 w-20">
                  Zip:
                </p>
                <span className="text-gray-600 font-semibold">
                  {shipping?.zip}
                </span>
                {/* <button onClick={() => setIsDetails(false)}>Change</button> */}
              </div>
            </section>
            <div className="flex justify-center mb-6">
              <button
                className="px-5 py-2 mr-3 text-white continue_shipping"
                onClick={processToOrder}
              >
                {loading
                  ? 'Processing...'
                  : `Pay $${
                      cartProduct.refAmount
                        ? cartProduct.refAmount.toFixed(2)
                        : totalAmount.toFixed(2)
                    }`}
              </button>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

// export async function getInitialProps() {
//   const apiKey = process.env.TEST_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

//   return {
//     props: {
//       apiKey,
//     },
//   };
// }

export default payment;

{
  /* <PaymentForm
        shipping={shipping}
        setShipping={setShipping}
        cssClasses={shipping ? "hidden" : "block"}
        refCode={refCode}
        setRefCode={setRefCode}
      /> */
}
