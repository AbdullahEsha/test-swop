import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { VscLoading } from 'react-icons/vsc';
import { TextField } from './TextField';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import { URL } from './Reuses/URL';
import { cartActions } from '../store/cartSlice';

const ShippingAddress = ({
  shipping,
  setShipping,
  cssClasses,
  refCode,
  setRefCode,
  formAction,
}) => {
  const {
    email,
    address,
    address2,
    city,
    country,
    firstName,
    lastName,
    phoneNumber,
    state,
    zip,
  } = shipping;

  const [couponCode, setCouponCode] = useState();

  const validate = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.number().required('Zip is required'),
  });

  const cartProduct = useSelector((state) => state.cart) || {};

  let totalAmount = cartProduct.cart.reduce(
    (accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.quantity;
    },
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/api/v1/coupon/all`);
        const data = response.data.data;
        setCouponCode(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [couponError, setCouponError] = useState();
  const dispatch = useDispatch();
  const handleCheckCupon = () => {
    // chackrefferelCode(refCode, cartDispatch);
    const code = couponCode.filter((el) => el.promoCode === refCode);
    if (code.length < 1) setCouponError("This Coupon doesn't exist.");
    else if (code[0].minimumPurchaseAmount >= totalAmount)
      setCouponError('Total Amount is too low');
    else if (code[0].discountType === 'percentage') {
      dispatch(
        cartActions.refAmountController(
          totalAmount - (code[0].percentageOff / 100) * totalAmount
        )
      );
    } else {
      dispatch(
        cartActions.refAmountController(
          totalAmount - code[0].amountOff
        )
      );
    }
  };

  return (
    <>
      <div className="container-x home-top-margin">
        <div className="payment__container">
          <div className="lg:grid overflow-x-hidden grid-cols-3 flexing_reverse">
            <div className="col-span-2 contact_info_right_border">
              <Formik
                initialValues={{
                  email: '',
                  firstName: '',
                  lastName: '',
                  address: '',
                  address2: '',
                  city: '',
                  country: '',
                  state: '',
                  zip: '',
                  phoneNumber: '',
                }}
                validationSchema={validate}
                onSubmit={(values) => {
                  setShipping(values);
                }}
              >
                {(formik) => (
                  <div>
                    <div>
                      <h2 className="pb-4 section__title">
                        Contact Information
                      </h2>
                    </div>
                    <Form>
                      <TextField
                        label="Enter your email"
                        name="email"
                        type="email"
                        // value={formik.values.email}
                      />
                      <div>
                        <h2 className="py-4">Shipping address </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <TextField
                          label="First Name"
                          name="firstName"
                          type="text"
                          // value={formik.values.firstName}
                        />
                        <TextField
                          label="Last Name"
                          name="lastName"
                          type="text"
                          // value={formik.values.lastName}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label="Address"
                          name="address"
                          type="text"
                          // value={formik.values.address}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label="Apartment, suite, etc. (optional)"
                          name="address2"
                          type="text"
                          // value={formik.values.address2}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label="City"
                          name="city"
                          type="text"
                          // value={formik.values.city}
                        />
                      </div>

                      <div className="lg:grid lg:grid-cols-3 lg:gap-3">
                        <div className="mb-4">
                          <TextField
                            label="State"
                            name="state"
                            type="text"
                            // value={formik.values.state}
                          />
                        </div>
                        <div className="mb-4">
                          <TextField
                            label="Zip code"
                            name="zip"
                            type="text"
                            // value={formik.values.zip}
                          />
                        </div>
                        <div className="mb-4">
                          <TextField
                            label="Country"
                            name="country"
                            type="text"
                            // value={formik.values.country}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <TextField
                          label="Phone Number"
                          name="phoneNumber"
                          type="text"
                          // value={formik.values.phoneNumber}
                        />
                      </div>

                      <div className="mb-4 py-4">
                        <button
                          type="submit"
                          className="px-5 py-2 mr-3 text-white continue_shipping"
                        >
                          Continue to Shipping
                        </button>

                        <button>
                          <Link
                            href="/cart"
                            style={{
                              color: '#000000',
                              marginLeft: '10px',
                            }}
                          >
                            Return To Cart
                          </Link>
                        </button>
                      </div>
                    </Form>
                  </div>
                )}
              </Formik>
            </div>

            <div className="py-5 shipping_product_list">
              <div className="order-summary__section--product-list">
                {cartProduct.cart.length > 0 &&
                  cartProduct.cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center py-4 rounded-md mb-4"
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
              <div className="">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Discount Code"
                    className="shipping_input_box w-full  rounded-md py-2"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                  />
                  <button
                    className="field__input-btn btn btn--disabled"
                    onClick={handleCheckCupon}
                    // disabled={!refCode}
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-600 text-[14px] translate-y-1">
                    {couponError}
                  </p>
                )}

                <div className="total_summary__section">
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
                    <span className="line-through">$5.99</span>
                  </div>
                </div>
                <hr className=" text-gray-400" />
                <div className="total_summary_price pt-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingAddress;
