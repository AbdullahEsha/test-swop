import Link from "next/link";
import Image from "next/image";
import cart from "../images/cart.png";
import menuline from "../images/menulineicon.png";
import mobilelogo from "../images/swopLogo.png";
import menucross from "../images/menucrossicon.png";
import google from "../images/googlelogo.png";
import apple from "../images/applelogo.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useWindowDimensions from "./useWindowDimensions";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import Cookies from "js-cookie";
import { cartActions } from "../store/cartSlice";

const Navbar = () => {
  const router = useRouter();
  const [show, handleShow] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        handleShow(true);
      } else handleShow(false);
    });
    return () => {
      window.removeEventListener("scroll", null);
    };
  }, []);

  const { width } = useWindowDimensions();

  const item = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  // const cookieValue = Cookies.get("myCookie");

  // if (cookieValue) {
  //   const cookieObject = JSON.parse(cookieValue);
  //   console.log("cookieObject", cookieObject);
  // } else {
  //   console.log("Cookie not found or is undefined.");
  // }

  return (
    <>
      {width < 992 ? (
        <div className="mobile-nav">
          <div className={`nav-menu-ber ${show && "colorNav"} `}>
            {menu === false ? (
              <Image
                src={menuline}
                alt="menuline-icon"
                height={21}
                width={15}
                onClick={() => {
                  setMenu(true);
                  document.querySelector(".nav-menu-hidden").style.display =
                    "grid";
                  document.querySelector(
                    ".nav-menu-ber"
                  ).style.borderBottomLeftRadius = "0px";
                  document.querySelector(
                    ".nav-menu-ber"
                  ).style.borderBottomRightRadius = "0px";
                }}
              />
            ) : (
              <Image
                src={menucross}
                alt="menuline-icon"
                height={21}
                width={15}
                onClick={() => {
                  setMenu(false);
                  document.querySelector(".nav-menu-hidden").style.display =
                    "none";
                  document.querySelector(
                    ".nav-menu-ber"
                  ).style.borderBottomLeftRadius = "15px";
                  document.querySelector(
                    ".nav-menu-ber"
                  ).style.borderBottomRightRadius = "15px";
                }}
              />
            )}
            <Link href="/">
              <Image
                src="/swop-main-logo.svg"
                alt="mobilelogo"
                height={21}
                width={88}
                className="!w-[88px] !h-[31px]"
              />
            </Link>
            {/* <Image src={cart} alt="cart-icon" height={18} width={18} /> */}
            <Link href="/cart">
              <FiShoppingCart size={25} />
              <span
                className="absolute cart-product-count border-2"
                onClick={() => router.push("/cart")}
              >
                {item.cart.length}
              </span>
            </Link>
          </div>
          <div className={`nav-menu-hidden ${show && "colorNav"} `}>
            <input type="text" placeholder="🔎︎ Search here" />
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="https://swopexplorer.netlify.app/" target="_blank">
              Dapp Explorer
            </Link>
            <Link href="/qr-generator">QR Generator</Link>
            <div id="border-line-bottom-menu" />
            <div className="menu-bottom-container">
              <div className="menu-bottom-card">
                <h6>Services</h6>
                <p>Unlock the world most advanced digital business card</p>
                <Link href="/service">Learn more</Link>
              </div>
              <div className="menu-bottom-card">
                <h6>Whitepaper</h6>
                <p>Manage your teams digital business card and others</p>
                <Link href="/coming-soon">Learn more</Link>
              </div>
            </div>
            <div className="app-logo-container">
              <Image
                src={google}
                alt="google-app-logo"
                height={42}
                width={140}
              />
              <Image src={apple} alt="apple-app-logo" height={42} width={140} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={`nav-outside container-x ${show && "colorNav"} `}>
            <div className="nav-top">
              <label>Free Shipping For Orders Over $80 </label>
              <div className="nav-top-item">
                <ul>
                  <li>
                    <Link href="/help">Help Center</Link>
                  </li>
                  <li>
                    <Link href="/return-policy">Returns</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                  <li>
                    <Link href="/coming-soon">Whitepaper</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="nav-bottom">
              <h2>
                <Link href="/">
                  <Image
                    src="/swop-main-logo.svg"
                    alt="swop-logo"
                    height={300}
                    width={1207}
                    className="h-[30px] w-[127px]"
                  />
                </Link>
              </h2>
              <div className="nav-bottom-item">
                <ul>
                  <li>
                    <Link href="/shop">Shop</Link>
                  </li>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link
                      href="https://swopexplorer.netlify.app/"
                      target="_blank"
                    >
                      Dapp Explorer
                    </Link>
                  </li>
                  <li>
                    <Link href="/qr-generator">QR Generator</Link>
                  </li>
                </ul>
              </div>
              <Link
                href="/cart"
                className="relative"
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "18px",
                  display: "flex",
                  gap: "5px",
                }}
              >
                Cart
                {/* <Image
                  src={cart}
                  alt="cart-icon"
                  height="18"
                  width="auto"
                  id="cart-image"
                /> */}
                <FiShoppingCart size={25} />
                <span
                  className="absolute"
                  style={{
                    top: "-35%",
                    right: "-20%",
                    zIndex: "10",
                    backgroundColor: "orangered",
                    color: "white",
                    fontSize: "11px",
                    padding: "2px 6px 0px 6px",
                    borderRadius: "50%",
                  }}
                >
                  {item.cart.length}
                </span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
