import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import html2canvas from "html2canvas";
import { Image as CanvasImage } from "canvas";
// import Footer from '../components/Footer'
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/router";
import Image from "next/image";
import { ProductData } from "../../../components/ProductData";
import productimage1 from "../../../images/productcount1.png";
import productimage2 from "../../../images/productcount2.png";
import { HiPlus, HiMinus } from "react-icons/hi";
import { RiFontColor } from "react-icons/ri";
import cardImg1 from "../../../images/homeCard1.png";
import cardImg2 from "../../../images/homeCard2.png";
import cardImg3 from "../../../images/homeCard3.png";
import number1 from "../../../images/number-icon1.png";
import number2 from "../../../images/number-icon2.png";
import number3 from "../../../images/number-icon3.png";
import useWindowDimensions from "../../../components/useWindowDimensions";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import parse from "html-react-parser";
import { useGetProductsByNumberQuery } from "../../../services/productApi";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../store/cartSlice";
import { replaceHyphenWithWhitespace } from "../../../components/Reuses/Reuse";
import {
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
} from "@chakra-ui/react";
import { CompactPicker } from "react-color";
import TextDisplay from "../../../components/customizeProduct/Text";
import AdImage from "../../../components/customizeProduct/Image";

const Product = () => {
  const router = useRouter();
  const { product } = router.query;

  const Products = useSelector((state) => state?.products.allProducts) || {};

  const [singleProduct] = Products.data.filter((el) => el.slug === product);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const [file, setFile] = useState([]);

  const layerRef = React.useRef();
  const itemRef = React.useRef();
  const stageRef = React.useRef();
  const [images, setImages] = React.useState([]);
  const [texts, setTexts] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [isClicked, setIsClicked] = useState(false);

  const [font, setFont] = React.useState({
    size: 32,
    family: "Arial",
    color: "#000",
  });
  const activeRef = React.useRef();
  const backgroundRef = React.useRef();
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const [color, setColor] = React.useState("#000");

  const [showImage, setShowImage] = useState(false);
  const [showText, setShowText] = useState(false);
  const [initState, setInitState] = useState(true);
  const [showPVariation, setShowPVariation] = useState(false);
  const [showSavedDesign, setShowSavedDesign] = useState(false);
  const [customStageColor, setCustomStageColor] = useState("#efeef0");
  const [activeBox, setActiveBox] = useState("white");
  const [savedImg, setsavedImg] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 46 && activeRef.current && layerRef.current) {
        setSelectedId(null);
        activeRef.current.destroy();
        layerRef.current.draw();
      }
    });
  }, []);

  useEffect(() => {
    const json = localStorage.getItem("saveDesignFlat");
    if (json) {
      const state = JSON.parse(json);
      const imgArr = state.imgArr;
      setsavedImg(imgArr);
    }
  }, []);

  const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // changing of reference
    if (activeRef.current) {
      const { fontSize, fontFamily, color } = activeRef.current.attrs;
      setFont({
        size: fontSize,
        family: fontFamily,
        color: color,
      });
    }
  }, [selectedId]);

  useEffect(() => {
    const { size, family, color } = font;

    if (activeRef.current) {
      if (activeRef.current.attrs.text) {
        activeRef.current.attrs.fill = color;
      } else {
        activeRef.current.attrs.fill = "transparent";
      }
      activeRef.current.attrs.fontSize = size;
      activeRef.current.attrs.fontFamily = family;
      activeRef.current.attrs.color = color;
      // activeRef.current.attrs.fill = "#463d70";
      activeRef.current.attrs.borderRadius = "50%";
    }
  }, [font]);

  // console.log(fontFamily);

  const changeImg = (img_url) => {
    const findImg = images.some((item) => item.src === img_url);
    if (!findImg) {
      const hash = btoa(Math.random()).substr(10, 5);
      let img = new Image();
      img.src = img_url;
      img.onload = function () {
        const item = {
          type: "image",
          src: img_url,
          id: hash,
          hash: hash,
          x: 130.91964783726962,
          y: 130.98084650809713,
          imageId: "21-logo",
          draggable: true,
          strokeWidth: 1,
          offsetX: this.width / 4,
          offsetY: this.height / 4,
          scaleX: 0.55855047430681098,
          scaleY: 0.5585504743068107,
        };

        setImages((images) => [...images, item]);
      };
    }
  };
  const handleImage = (e) => {
    console.log(e);
    if (e.target.files[0]) {
      setFile((file) => [...file, URL.createObjectURL(e.target.files[0])]);

      const hash = btoa(Math.random()).substr(10, 5);

      // Create a new image element
      let img = document.createElement("img");

      let url = URL.createObjectURL(e.target.files[0]);
      img.src = url;
      img.onload = function () {
        const item = {
          type: "image",
          src: URL.createObjectURL(e.target.files[0]),
          id: hash,
          hash: hash,
          x: 130.91964783726962,
          y: 130.98084650809713,
          imageId: "21-logo",
          draggable: true,
          strokeWidth: 1,
          offsetX: this.width / 4,
          offsetY: this.height / 4,
          scaleX: 0.55855047430681098,
          scaleY: 0.5585504743068107,
        };

        setImages((images) => [...images, item]);
      };
    }
  };

  const removeImg = (index) => {
    setFile([...file.slice(0, index), ...file.slice(index + 1, file.length)]);
    setImages([
      ...images.slice(0, index),
      ...images.slice(index + 1, images.length),
    ]);
  };

  const customAddToCart = async () => {
    const element = document.getElementById("container");
    let canvas = await html2canvas(element);
    let data = canvas.toDataURL();

    const uri = stageRef.current.toDataURL();
    addItem({ ...product, qty: 1, customDesign: [data, uri] }, cardDispatch);
  };

  const handleText = (e, id) => {
    const text = {
      x: 130.91964783726962,
      y: 130.98084650809713,
      text: e,
      fontSize: 30,
      fontFamily: "Calibri",
      id: 0,
      color: "#000",
      fill: "#000",
    };

    if (texts.length === 0) {
      setTexts((texts) => [...texts, text]);
    } else {
      const newTexts = texts.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            text: e,
          };
        }
        return item;
      });
      setTexts(newTexts);
    }
  };

  const changeColor = (val) => {
    console.log(val.target.value);
    setColor(val.target.value);
    setFont({ ...font, color });
  };

  const clickText = () => {
    setShowImage(false);
    setShowText(true);
    setInitState(false);
    setShowPVariation(false);
    setShowSavedDesign(false);
  };

  const clickProductVariation = () => {
    setShowImage(false);
    setShowText(false);
    setInitState(false);
    setShowPVariation(true);
    setShowSavedDesign(false);
  };

  const clickSavedDesign = () => {
    setShowImage(false);
    setShowText(false);
    setInitState(false);
    setShowPVariation(false);
    setShowSavedDesign(true);
  };

  const changeCustomStageColor = (color) => {
    if (color === "#000000") {
      setActiveBox("black");
    } else {
      setActiveBox("white");
    }
    setCustomStageColor(color);
  };

  const removeSavedDesign = (index) => {
    const json = localStorage.getItem("saveDesignFlat");
    if (json) {
      const state = JSON.parse(json);

      state.stagArr.splice(index, 1);
      state.imgArr.splice(index, 1);

      setsavedImg(state.imgArr);

      localStorage.setItem("saveDesignFlat", JSON.stringify(state));
    }
  };

  const showDesign = (index) => {
    const json = localStorage.getItem("saveDesignFlat");

    if (json) {
      const state = JSON.parse(json);
      const stagArr = JSON.parse(state.stagArr[index]);

      setImages([]);
      setTexts([]);

      stagArr.children[0].children.forEach((element) => {
        if (element.className === "Image") {
          const childAttr = element.attrs;
          const hash = btoa(Math.random()).substr(10, 5);
          let img = new Image();
          img.src = childAttr.imageUrl;
          img.onload = function () {
            const item = {
              type: "image",
              src: childAttr.imageUrl,
              id: hash,
              hash: hash,
              x: childAttr.x,
              y: childAttr.y,
              imageId: childAttr.imageId,
              draggable: true,
              strokeWidth: 1,
              offsetX: childAttr.offsetX,
              offsetY: childAttr.offsetY,
              scaleX: childAttr.scaleX,
              scaleY: childAttr.scaleY,
            };

            setImages((images) => [...images, item]);
          };
        } else {
          const childAttr = element.attrs;
          const text = {
            x: childAttr.x,
            y: childAttr.y,
            text: childAttr.text,
            fontSize: childAttr.fontSize,
            fontFamily: "Calibri",
            id: 0,
            color: childAttr.color,
            fill: childAttr.fill,
          };
          setTexts((texts) => [...texts, text]);
        }
      });
    }
  };
  const saveDesign = () => {
    let savedDesign = JSON.parse(localStorage.getItem("saveDesignFlat"));
    if (savedDesign === null) {
      const designObj = {
        stagArr: [],
        imgArr: [],
      };
      const json = stageRef.current.toJSON();
      designObj.stagArr.push(json);
      setSelectedId(null);

      setTimeout(() => {
        const dataURL = stageRef.current.toDataURL({
          quality: 1,
          pixelRatio: 1,
          mimeType: "image/png",
        });

        designObj.imgArr.push(dataURL);
        setsavedImg(designObj.imgArr);
        localStorage.setItem("saveDesignFlat", JSON.stringify(designObj));
      }, 1000);
    } else {
      const json = stageRef.current.toJSON();

      savedDesign.stagArr.push(json);
      console.log(savedDesign);
      setSelectedId(null);

      setTimeout(() => {
        const dataURL = stageRef.current.toDataURL({
          quality: 1,
          pixelRatio: 1,
          mimeType: "image/png",
        });

        savedDesign.imgArr.push(dataURL);
        setsavedImg(savedDesign.imgArr);
        localStorage.setItem("saveDesignFlat", JSON.stringify(savedDesign));
      }, 1000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-x home-top-margin">
        {singleProduct && (
          <div className="product-details">
            <div className="row-div border-product-detail">
              <div className="col-6 ">
                {singleProduct.category === "Custom Dot" ? (
                  <div className="product-background ">
                    <Flex justifyContent="space-between">
                      <Flex flexGrow={1} justifyContent="center">
                        <Box
                          p="50px"
                          bg="#fff"
                          //boxShadow="rgb(204 204 204 / 25%) 0px 0px 10px 0px"
                          id="container"
                          onDrop={(e) => {
                            e.preventDefault();
                            const hash = btoa(Math.random()).substr(10, 5);
                            // register event position
                            stageRef.current.setPointersPositions(e);
                            const item = {
                              ...stageRef.current.getPointerPosition(),
                              ...itemRef.current,
                              hash,
                            };
                            if (itemRef.current.type === "image") {
                              setImages((images) => [...images, item]);
                            } else {
                              setTexts((texts) => [...texts, item]);
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <Stage
                            width={400}
                            height={400}
                            style={{
                              backgroundColor: customStageColor,
                              borderRadius: "50%",
                              overflow: "hidden",
                              // boxShadow: "0px 0px 17px 0px rgb(204 204 204 / 64%)"
                            }}
                            ref={stageRef}
                            onMouseDown={checkDeselect}
                            onTouchStart={checkDeselect}
                          >
                            <Layer ref={layerRef}>
                              {images.map((image, index) => {
                                return (
                                  <AdImage
                                    key={`image-${index}`}
                                    image={image}
                                    stageRef={stageRef}
                                    layerRef={layerRef}
                                    setSelectedId={setSelectedId}
                                    selectedId={selectedId}
                                    isSelected={image.hash === selectedId}
                                    onSelect={(event) => {
                                      const shape = event.target;
                                      activeRef.current = shape;

                                      setSelectedId(image.hash);
                                    }}
                                  />
                                );
                              })}
                              {texts.map((text, index) => {
                                return (
                                  <TextDisplay
                                    key={`text-${index}`}
                                    text={text}
                                    stageRef={stageRef}
                                    fontSize={font.size}
                                    fontFamily={font.family}
                                    color={color}
                                    fill={color}
                                    activeRef={activeRef}
                                    layerRef={layerRef}
                                    setSelectedId={setSelectedId}
                                    selectedId={selectedId}
                                    setFont={(e) => setFont(e)}
                                    isSelected={text.hash === selectedId}
                                    onSelect={(event) => {
                                      const shape = event.target;
                                      activeRef.current = shape;

                                      setSelectedId(text.hash);
                                    }}
                                  />
                                );
                              })}
                            </Layer>
                          </Stage>
                        </Box>
                      </Flex>
                    </Flex>
                  </div>
                ) : (
                  <div className="product-background">
                    <Flex justifyContent="space-between">
                      <Flex
                        flexGrow={1}
                        justifyContent="center"
                        flexDir="column"
                      >
                        <Box
                          p="50px"
                          bg="#fff"
                          //boxShadow="rgb(204 204 204 / 25%) 0px 0px 10px 0px"
                          id="container"
                          onDrop={(e) => {
                            e.preventDefault();
                            const hash = btoa(Math.random()).substr(10, 5);
                            // register event position
                            stageRef.current.setPointersPositions(e);
                            const item = {
                              ...stageRef.current.getPointerPosition(),
                              ...itemRef.current,
                              hash,
                            };
                            if (itemRef.current.type === "image") {
                              setImages((images) => [...images, item]);
                            } else {
                              setTexts((texts) => [...texts, item]);
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <Stage
                            width={500}
                            height={300}
                            style={{
                              backgroundColor: customStageColor,
                              borderRadius: "2%",
                              overflow: "hidden",
                              // boxShadow: "0px 0px 17px 0px rgb(204 204 204 / 64%)"
                            }}
                            ref={stageRef}
                            onMouseDown={checkDeselect}
                            onTouchStart={checkDeselect}
                          >
                            <Layer ref={layerRef}>
                              {images.map((image, index) => {
                                return (
                                  <AdImage
                                    key={`image-${index}`}
                                    image={image}
                                    stageRef={stageRef}
                                    layerRef={layerRef}
                                    setSelectedId={setSelectedId}
                                    selectedId={selectedId}
                                    isSelected={image.hash === selectedId}
                                    onSelect={(event) => {
                                      const shape = event.target;
                                      activeRef.current = shape;

                                      setSelectedId(image.hash);
                                    }}
                                  />
                                );
                              })}
                              {texts.map((text, index) => {
                                return (
                                  <TextDisplay
                                    key={`text-${index}`}
                                    text={text}
                                    stageRef={stageRef}
                                    fontSize={font.size}
                                    fontFamily={font.family}
                                    color={color}
                                    fill={color}
                                    activeRef={activeRef}
                                    layerRef={layerRef}
                                    setSelectedId={setSelectedId}
                                    selectedId={selectedId}
                                    setFont={(e) => setFont(e)}
                                    isSelected={text.hash === selectedId}
                                    onSelect={(event) => {
                                      const shape = event.target;
                                      activeRef.current = shape;

                                      setSelectedId(text.hash);
                                    }}
                                  />
                                );
                              })}
                            </Layer>
                          </Stage>
                        </Box>
                      </Flex>
                    </Flex>
                  </div>
                )}

                {/* end */}
              </div>
              <div className="col-6">
                <div className="product-details-content">
                  <div className="product-details-content-inside">
                    <h3>{singleProduct.name}</h3>
                    <h4>${singleProduct.price.$numberDecimal}</h4>
                    <h6>
                      Availablity: <span>In Stock</span>
                    </h6>
                    <h5>Color:</h5>
                    <div class="customize-image">
                      <div class="color-container">
                        <div class="product-details-color" id="color-first">
                          <input type="color" onChange={changeColor} />
                        </div>
                        {/* <div
                          class="product-details-color"
                          id="color-second"
                        >
                          <input type="color" value="#ffffff" />
                        </div> */}
                      </div>
                      <div class="upload-image-container">
                        <input
                          id="file"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleImage}
                        />
                      </div>
                      <div class="text-container">
                        {isClicked ? (
                          <input
                            onChange={(e) => handleText(e.target.value, 0)}
                            style={{
                              fontSize: "14px",
                              color: "#000",
                              padding: "10px",
                              height: 80,
                              display: "flex",
                              width: "100%",
                              boxShadow: "rgb(0 0 0 / 25%) 0px 1px 4px",
                              fontFamily: "'Helvetica','Arial', sans-serif",
                              borderRadius: "4px",
                              background: "#ffffff",
                            }}
                          />
                        ) : (
                          <button
                            onClick={() => setIsClicked(!isClicked)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 24 24"
                              height="22"
                              width="22"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g>
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path d="M15.246 14H8.754l-1.6 4H5l6-15h2l6 15h-2.154l-1.6-4zm-.8-2L12 5.885 9.554 12h4.892zM3 20h18v2H3v-2z"></path>
                              </g>
                            </svg>{" "}
                            <h6>Text</h6>
                          </button>
                        )}
                      </div>
                      <div class="font-container">
                        <select
                          onChange={(e) =>
                            setFont({
                              ...font,
                              family: e.target.value,
                            })
                          }
                        >
                          <option value="Time to new roman">
                            Time to new roman
                          </option>
                          <option value="Arial" style={{ fontFamily: "Arial" }}>
                            Arial
                          </option>
                          <option
                            value="Arial Black"
                            style={{ fontFamily: "Arial" }}
                          >
                            Arial Black
                          </option>
                          <option
                            value="Algerian"
                            style={{ fontFamily: "Algerian" }}
                          >
                            Algerian
                          </option>
                          <option
                            value="Berlin Sans FB"
                            style={{
                              fontFamily: "Berlin Sans FB",
                            }}
                          >
                            Berlin Sans FB
                          </option>
                          <option
                            value="Comic Sans MS"
                            style={{
                              fontFamily: "Comic Sans MS",
                            }}
                          >
                            Comic Sans MS
                          </option>
                          <option value="Muli" style={{ fontFamily: "Muli" }}>
                            Google Font Muli
                          </option>
                          <option
                            value="Quicksand"
                            style={{ fontFamily: "Quicksand" }}
                          >
                            Google Font Quicksand
                          </option>
                        </select>
                      </div>
                    </div>
                    <h5>Quantity:</h5>
                    <ActiveTab data={singleProduct} stageRef={stageRef} />
                  </div>
                </div>
              </div>
            </div>
            <ProductDesTab description={singleProduct.description} />
          </div>
        )}
        <HowItWorks />
        <SliderSec />
      </div>
      <Footer />
    </>
  );
};

export default Product;

const ActiveTab = ({ data, stageRef }) => {
  const [activeTab, setActiveTab] = useState("single");

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (data.quantity > quantity) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const dispatch = useDispatch();

  const addToCartHandler = async () => {
    const element = document.getElementById("container");
    let canvas = await html2canvas(element);
    //let data = canvas.toDataURL();

    const uri = stageRef.current.toDataURL();

    dispatch(
      cartActions.addItem({
        name: data.name,
        id: data._id,
        sku: "",
        image: data.imageUrls[0],
        price: data.price.$numberDecimal,
        quantity: Number(quantity),
        discount: 0,
        type: data.type,
        category: data.category,
        total: Number(quantity) * Number(data.price.$numberDecimal),
        design: uri,
      })
    );
  };

  const item = useSelector((state) => state.cart);
  const isInCard = item.cart.filter((el) => el.id == data._id);

  return (
    <>
      <div className="product-details-quantity">
        <div className="product-quantity-card active border-2 min-h-[95px]">
          <p>Set</p>
          <div className="product-multi-outside">
            <div className="product-multi-inside">
              <HiMinus onClick={handleDecrement} />
              <span style={{ color: "#fff" }}>{quantity}</span>
              <HiPlus onClick={handleIncrement} />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={addToCartHandler}
        className={`addtocart-btn ${
          isInCard.length > 0 ? "inCard" : "inNotCard"
        }`}
      >
        Add to cart
        {isInCard.length > 0 && (
          <span style={{ color: "black", marginLeft: "15px" }}>✔</span>
        )}
      </button>
    </>
  );
};

const ProductDesTab = ({ description }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [seeMore, setSeeMore] = useState(false);
  const [seeMoreIsShown, setSeeMoreIsShown] = useState(true);

  const descriptionRef = useRef(null);
  const parentRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current && parentRef.current) {
      const descriptionHeight = descriptionRef.current.offsetHeight;
      const parentHeight = parentRef.current.offsetHeight;
      if (descriptionHeight < 143) {
        setSeeMoreIsShown(false);
      }
    }
  }, []);

  const ParseText = () => {
    return <div ref={descriptionRef}>{parse(description)}</div>;
  };
  return (
    <div
      // style={{ minHeight: `${seeMore ? "fit-content" : "240px"}` }}
      className="product-description"
      ref={parentRef}
    >
      <div className="tab-bar product-description-title">
        <button
          className={`tab-button ${activeTab === "tab1" ? "active-btn" : ""}`}
          onClick={() => {
            handleTabClick("tab1");
          }}
        >
          Description
        </button>
        <button
          className={`tab-button ${activeTab === "tab2" ? "active-btn" : ""}`}
          onClick={() => {
            handleTabClick("tab2");
          }}
        >
          Compatibility
        </button>
        <button
          className={`tab-button ${activeTab === "tab3" ? "active-btn" : ""}`}
          onClick={() => {
            handleTabClick("tab3");
          }}
        >
          Shiping & Returns
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "tab1" && (
          <div>
            <div
              className={`product-description-textbox ${
                seeMore ? "" : "text-hide"
              } `}
            >
              <ParseText></ParseText>
              {/* {parse(description)} */}
            </div>
            {seeMoreIsShown && (
              <>
                {!seeMore ? (
                  <button
                    className="text-[13px] md:text-[16px]"
                    onClick={() => setSeeMore(true)}
                  >
                    See More
                  </button>
                ) : (
                  <button
                    className="text-[13px] md:text-[16px]"
                    onClick={() => setSeeMore(false)}
                  >
                    See Less
                  </button>
                )}
              </>
            )}
          </div>
        )}
        {activeTab === "tab2" && (
          <div>
            <div
              className={`product-description-textbox text-[13px] md:text-[16px] ${
                seeMore ? "" : "text-hide"
              } `}
            >
              {text}
            </div>
            {!seeMore ? (
              <button
                className="text-[13px] md:text-[16px]"
                onClick={() => setSeeMore(true)}
              >
                See More
              </button>
            ) : (
              <button
                className="text-[13px] md:text-[16px]"
                onClick={() => setSeeMore(false)}
              >
                See Less
              </button>
            )}
          </div>
        )}
        {activeTab === "tab3" && (
          <div className="product-description-textbox text-[13px] md:text-[16px]">
            Contact Support for returns.
          </div>
        )}
        {/* <div className="see-controller">
          <AiOutlineArrowDown />
        </div> */}
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <div className="home-how-it-work">
      <h2>HOW ITS WORKS</h2>
      <p className="hide-mobile-view">
        Swop is free to download and very easy to get started. After making a
        profile and getting setup be
        <br />
        sure to order a NFC. Our technology is compatible with all current and
        most
        <br />
        modern models of smartphones. Never miss an opportunity
        <br />
        again with Swop.
      </p>
      <p className="hide-pc-view">
        Swop is free to download and very easy to get started. After making a
        profile and getting setup be sure to order a NFC. Our technology is
        compatible with all current and most modern models of smartphones. Never
        miss an opportunity again with Swop.
      </p>
      <div className="background-level"></div>
      <div className="row-div">
        <div className="col-4">
          <Image
            src={number1}
            alt="number_image"
            height={71}
            width={71}
            className="number-icon"
          />
          <div className="card-how-it">
            <Image src={cardImg1} alt="no_image" width={360} height={540} />
            <h5>
              Set up your <span>SWOP</span> profile
            </h5>
            <p>
              Personlize the look of your digital business card. Add all of your
              contact information.
            </p>
          </div>
        </div>
        <div className="col-4">
          <Image
            src={number2}
            alt="number_image"
            height={71}
            width={71}
            className="number-icon"
          />
          <div className="card-how-it">
            <Image src={cardImg2} alt="no_image" width={360} height={540} />
            <h5>
              Active your <span>SWOP</span> device
            </h5>
            <p>
              Device is made simple so you can get to connecting faster than
              ever before.
            </p>
          </div>
        </div>
        <div className="col-4">
          <Image
            src={number3}
            alt="number_image"
            height={71}
            width={71}
            className="number-icon"
          />
          <div className="card-how-it">
            <Image src={cardImg3} alt="no_image" width={360} height={540} />
            <h5>Ready to connect</h5>
            <p>
              With a single tap you'll be able to transfer your dot.Profile and
              begin connecting with style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SliderSec = () => {
  const { width } = useWindowDimensions();
  const Products = useSelector((state) => state?.products.allProducts) || {};

  SwiperCore.use([Autoplay]);
  return (
    <div className="home-product">
      <h2>OUR PRODUCTS</h2>
      <p className="hide-mobile-view">
        All of our products come with a 30 day warranty where we will send you a
        new NFC no questions asked. NFC chips come in a variety
        <br />
        of shapes and sizes. Some share information faster than others. While
        other types store more data. Be sure to get
        <br />
        the NFC that fits your needs. We also offer custom printing, where we
        can apply your logo
        <br />
        or custom QR code directly to your NFC product.
      </p>
      <p className="hide-pc-view">
        All of our products come with a 30 day warranty where we will send you a
        new NFC no questions asked. NFC chips come in a variety of shapes and
        sizes. Some share information faster than others. While other types
        store more data. Be sure to get the NFC that fits your needs. We also
        offer custom printing, where we can apply your logo or custom QR code
        directly to your NFC product.
      </p>
      <div className="individual-product-slider">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={false}
          effect="coverflow"
          autoplay={true}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 3,
            slideShadows: false,
          }}
          slidesPerView={width > 1023 ? 4 : width > 767 ? 2.5 : 1.5}
          spaceBetween={35}
          pagination={{
            dynamicBullets: true,
          }}
          initialSlide={1.6}
          style={{
            width: "100%",
            margin: "auto",
            padding: "30px",
            justifyContent: "center",
          }}
        >
          {Products.data.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="product-card" key={index}>
                <Link
                  href={`/shop/${item.type === "regular" ? "" : "custom/"}${
                    item.slug
                  }`}
                  key={item._id}
                >
                  <Image
                    src={item.imageUrls[0]}
                    alt="no_image"
                    height={300}
                    width={300}
                  />
                </Link>
                <h5>{item.title}</h5>
                <p>{item.detail}</p>
                <div className="product-price">
                  <label>{item.price.$numberDecimal}</label>
                  <Link
                    href={`/shop/${item.type === "regular" ? "" : "custom/"}${
                      item.slug
                    }`}
                  >
                    Buy
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const text = `iPhones: iPhone 7 (only with iOS 14 NFC widget in control center)
iPhone 8 (only with iOS 14 NFC widget in control center) iPhone X
(only with iOS 14 NFC widget in control center) iPhone XR iPhone
XS iPhone XS Max iPhone 11 iPhone 11 Pro iPhone 11 Pro Max iPhone
12 iPhone 12 Pro iPhone 12 Pro Max iPhone SE (2nd Generation) all
future iPhones Pixels: Pixel Pixel XL Pixel 2 Pixel 2XL Pixel 3
Pixel 3XL Pixel 3A Pixel 3aXL Pixel 4 all future Pixels Galaxy:
SIII S4 S5 S6 S6 Edge S6 Edge+ S7 S7Edge S8 S8+ S9 S9+ S10 S10 5G
S10+ S20 S20+ A20 A20e A30 A50 A51 Galaxy Fold Galaxy Fold 2 all
future Galaxies Samsung: Note 8 Note 9 Note 10 Note 10+ Note 20
Note 20 Ultra Note 20 Ultra Plus all future Samsungs HTC: One M9
Desire 10 Pro Exodus 1 U11/Life/+ Desire 12/12+ U11 Eyes U12 Life
U12+ U19e 19+ all future HTC phones Huawei: P10 P10 Plus P10 Lite
P20 P20 Pro P20 Lite P30 P30 Pro P30 Lite all future Huawei models
LG: G3 Nexus 5X V10 G4 K10 V20 G5 G6 V30 V35 ThinQ Q Stylus Q
Stylo 4 Stylo 5 V40 ThinQ V50 ThinQ 5G Q8 Q7 G7 ThinQ G8 G8s ThinQ
Q9 One all future LG phones Xiaomi: Mi Mix Mi Mix2 Mi Mix 2S Mi
Mix 3 Mi5 Mi5s Mi5 Plus Mi6/X Mi6 Mi8 Mi8 Lite Mi8 Pro Mi9 Mi9 SE
all future Xiaomi phones Nokia: 3 5 6 8 8.1 6.1 8 Sirocco 7 Plus
5.1 9 PureView all future Nokias OnePlus – One, 3, 3T, 5, 5T, 6,
6T, 7, 7 Pro, 7 Pro 5G, all future OnePlus phones Motorola – Moto
P50, Moto X4, Moto Z3, Moto Z3 Play, all future Motorolas Sony –
Xperia XZ1/Compact, Xperia 1, 10/Plus, Xperia XA1/Ultra/Plus,
Xperia XZ2/Compact/Premium, Xperia XA2/Ultra/Plus, Xperia XZ3, all
future Sony phones Essential – PH, PH-1, all future Essential
phones`;
