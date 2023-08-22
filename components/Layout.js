import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../store/cartSlice";

const Layout = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const cookieValue = Cookies.get("myCookie");

    if (cookieValue) {
      const cookieObject = JSON.parse(cookieValue);
      console.log("cookieObject", cookieObject);

      // fill redux from cookies
      dispatch(cartActions.addState(cookieObject));
    } else {
      console.log("Cookie not found or is undefined.");
    }
  }, []); // Empty dependency array ensures the effect runs only once on initial render

  // const item = useSelector((state) => state.cart);

  // const cookieValue = JSON.stringify(item.cart);
  // Cookies.set("myCookie", cookieValue);
  return <div>{props.children}</div>;
};

export default Layout;
