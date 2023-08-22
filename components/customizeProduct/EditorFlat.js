import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Stage, Layer } from "react-konva";
import html2canvas from "html2canvas";
import AdImage from "./Image";
import Footer from "../Footer";
import Header from "../Header";
import { FaTimes, FaImages } from "react-icons/fa";
import {
  MdUpload,
  MdOutlineUpload,
  MdOutlineTextFormat,
  MdLayers,
  MdOutlinePalette,
  MdOutlineImage,
  MdPalette,
  MdSave,
} from "react-icons/md";
import { TbCirclePlus } from "react-icons/tb";

import {
  RiBringForward,
  RiSendBackward,
  RiShoppingCartLine,
} from "react-icons/ri";
import { BsImageFill } from "react-icons/bs";
import { useCart } from "../../context/cartContext/CartProvider";
import { addItem } from "../../context/cartContext/cartActions";
import { useProduct } from "../../context/productContext/ProductProvider";
import Loader from "../Loader";
import { getProduct } from "../../context/productContext/productActions";
import {
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
} from "@chakra-ui/react";
import TextDisplay from "./Text";
import useWindowDimensions from "../../custom-hooks/useWindowDimensions";
import { CompactPicker } from "react-color";

import customCircleWhite from "../../images/custom_product/bfkyxdvhgixrfdutyn16.png";
import customCircleBlack from "../../images/custom_product/ek8qv00pirnismhmqtvq.jpeg";
const App = () => {
  const params = useParams();

  const [{ items }, cardDispatch] = useCart();
  const [{ products, loading, error }, productDispatch] = useProduct();

  const founItem = products.filter((item) => item._id === params.id);
  const product = founItem[0];

  const [file, setFile] = useState([]);

  const layerRef = React.useRef();
  const itemRef = React.useRef();
  const stageRef = React.useRef();
  const [images, setImages] = React.useState([]);
  const [texts, setTexts] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);

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
  const [circleColor, setCircleColor] = useState("#efeef0");
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
    setFile((file) => [...file, URL.createObjectURL(e.target.files[0])]);

    const hash = btoa(Math.random()).substr(10, 5);

    let img = new Image();
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
    setColor(val.hex);
    setFont({ ...font, color });
  };

  const clickText = () => {
    setShowImage(false);
    setShowText(true);
    setInitState(false);
    setShowPVariation(false);
    setShowSavedDesign(false);
  };

  const clickImage = () => {
    setShowImage(true);
    setShowText(false);
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

  const changeCircleColor = (color) => {
    if (color === "#000000") {
      setActiveBox("black");
    } else {
      setActiveBox("white");
    }
    setCircleColor(color);
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
      <Header />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader className="text-6xl font-semibold" />
        </div>
      ) : error ? (
        <div className="container text-center pt-24 pb-6 text-red-500 font-semibold text-xl">
          Something wrong Please Reload your Application or click try again
          button
          <br />
          <button
            className="bg-green-400 px-6 py-2.5 rounded-full mt-3 text-white"
            onClick={() => getProduct(productDispatch)}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="mt-20" style={{ background: "#8f7f7" }}>
          <div className="container">
            {width > 1050 ? (
              <Flex>
                <Flex
                  flex={1.6}
                  h="70vh"
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* <Flex
                justifyContent="space-between"
                alignItems="center"
                bgColor="white"
                p="20px"
              >
                <Box>
                  <Button
                    mr="10px"
                    onClick={() => {
                      const json = stageRef.current.toJSON();
                      localStorage.setItem("designer", JSON.stringify(json));

                      console.log(json);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedId(null);
                      activeRef.current.setStroke("transparent");
                      layerRef.current.draw();

                      setTimeout(() => {
                        const dataURL = stageRef.current.toDataURL({
                          quality: 1,
                          pixelRatio: 1,
                          mimeType: "image/png",
                        });
                        downloadURI(dataURL, "stage.png");
                      }, 1000);
                    }}
                  >
                    Download
                  </Button>
                </Box>
              </Flex> */}

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
                            backgroundColor: circleColor,
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
                </Flex>

                <Flex marginTop={40} flex={0.6}>
                  <Flex className="toolbox" flexDir="column">
                    <div
                      className={
                        showImage ? "toolbox-item tool-active" : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickImage()}>
                        <MdUpload fontSize={24} />
                      </button>
                      <div className="toolbox-item-label">Image</div>
                    </div>
                    <div
                      className={
                        showText ? "toolbox-item tool-active" : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickText()}>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 28 24"
                          height="22"
                          width="28"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M2 20h20v4H2v-4zm3.49-3h2.42l1.27-3.58h5.65L16.09 17h2.42L13.25 3h-2.5L5.49 17zm4.42-5.61l2.03-5.79h.12l2.03 5.79H9.91z"></path>
                        </svg>
                      </button>
                      <div className="toolbox-item-label">Text</div>
                    </div>
                    <div
                      className={
                        showPVariation
                          ? "toolbox-item tool-active"
                          : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickProductVariation()}>
                        <MdPalette fontSize={24} />
                      </button>
                      <div className="toolbox-item-label">
                        Product variations
                      </div>
                    </div>
                    <div
                      className={
                        showSavedDesign
                          ? "toolbox-item tool-active"
                          : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickSavedDesign()}>
                        <BsImageFill fontSize={22} />
                      </button>
                      <div className="toolbox-item-label">My saved designs</div>
                    </div>

                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div className="toolbox-item-stack">
                      <div>
                        <MdLayers fontSize={28} />
                      </div>
                      <div className="toolbox-stack-label">
                        <div>
                          <button
                            className="toolbar_btn"
                            onClick={() => {
                              if (activeRef.current) {
                                activeRef.current.moveToTop();
                                layerRef.current.draw();
                              }
                            }}
                          >
                            <RiBringForward />
                            <span>Bring forward</span>
                          </button>
                          <button
                            className="toolbar_btn"
                            onClick={() => {
                              if (activeRef.current) {
                                activeRef.current.moveToBottom();
                                layerRef.current.draw();
                              }
                            }}
                          >
                            <RiSendBackward />
                            <span>Send backward</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Flex>
                  <Flex
                    flex={1}
                    flexDir="column"
                    backgroundColor="white"
                    position="relative"
                  >
                    {initState && (
                      <>
                        <div>
                          <ul className="customProdBox">
                            <li onClick={() => clickImage()}>
                              <div className="onBox">
                                <span>
                                  Upload <br /> Image
                                </span>
                                <div className="icon">
                                  <MdOutlineUpload />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  Upload <br /> Image
                                </span>
                                <div className="icon">
                                  <MdOutlineUpload />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickText()}>
                              <div className="onBox">
                                <span>
                                  <br />
                                  Text
                                </span>
                                <div className="icon">
                                  <MdOutlineTextFormat />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  <br />
                                  Text
                                </span>
                                <div className="icon">
                                  <MdOutlineTextFormat />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickProductVariation()}>
                              <div className="onBox">
                                <span>
                                  Product <br /> variations
                                </span>
                                <div className="icon">
                                  <MdOutlinePalette />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  Product <br /> variations
                                </span>
                                <div className="icon">
                                  <MdOutlinePalette />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickSavedDesign()}>
                              <div className="onBox">
                                <span>
                                  My saved <br /> designs
                                </span>
                                <div className="icon">
                                  <MdOutlineImage />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  My saved <br /> designs
                                </span>
                                <div className="icon">
                                  <MdOutlineImage />
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                    {showText && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          PLAIN TEXT
                        </div>
                        <div style={{ padding: "20px" }}>
                          <div className="custom_text_div">
                            <textarea
                              onChange={(e) => handleText(e.target.value, 0)}
                              placeholder="Text to be added to your design"
                              rows={2}
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
                          </div>

                          <div className="custom_text_font_elem">
                            <div className="custom_label">Font</div>
                            <select
                              placeholder={font.family}
                              onChange={(e) =>
                                setFont({
                                  ...font,
                                  family: e.target.value,
                                })
                              }
                            >
                              <option
                                value="Arial"
                                style={{ fontFamily: "Arial" }}
                              >
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
                              <option
                                value="Muli"
                                style={{ fontFamily: "Muli" }}
                              >
                                Google Font Muli
                              </option>
                              <option
                                value="Quicksand"
                                style={{ fontFamily: "Quicksand" }}
                              >
                                Google Font Quicksand
                              </option>
                              <option
                                value="nunito"
                                style={{ fontFamily: "nunito" }}
                              >
                                Google Font Nunito Regular
                              </option>
                            </select>
                            <div className="custom_label">Font Size</div>
                            <NumberInput
                              defaultValue={0}
                              value={font.size}
                              onChange={(size) => setFont({ ...font, size })}
                              clampValueOnBlur={false}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper fontSize={12} />
                                <NumberDecrementStepper fontSize={12} />
                              </NumberInputStepper>
                            </NumberInput>
                            <div className="custom_label">Color</div>
                            <div style={{ marginTop: "10px" }}>
                              <CompactPicker
                                color={color}
                                onChange={changeColor}
                                className="color_picker"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {showImage && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          UPLOAD IMAGE
                        </div>
                        <div className="_img_card">
                          <div className="_img_card__content">
                            {/* <div className="icon">
                              <svg
                                id="svg_preview"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="{2}"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div> */}

                            <h1 className="mt-1">
                              <label htmlFor="file">
                                <TbCirclePlus
                                  fontSize="18px"
                                  className="plus_icon_upload"
                                />
                                <span className="ml-1">Upload Image</span>
                              </label>
                            </h1>
                            <input
                              id="file"
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              onChange={handleImage}
                            />
                            <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto mb-4">
                              {file.length > 0
                                ? file.map((img, index) => {
                                    return (
                                      <div
                                        className="custom_images"
                                        key={index}
                                      >
                                        <button
                                          onClick={() => removeImg(index)}
                                          className="cross_btn"
                                        >
                                          <FaTimes />
                                        </button>
                                        <img
                                          alt="logo"
                                          src={img}
                                          draggable="true"
                                          onClick={() => changeImg(img)}
                                          onDragStart={(e) => {
                                            itemRef.current = {
                                              type: "image",
                                              src: e.target.src,
                                              id: "s21",
                                            };
                                          }}
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {showPVariation && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          PRODUCT VARIATIONS
                        </div>
                        <div
                          style={{
                            padding: "20px",
                          }}
                        >
                          {/* <ul className="rect-custom-products">
                            <li>
                              <div className="custom_prod_border active_border">
                                <img
                                  src={customRectImg1}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Black</span>
                              </div>
                            </li>
                            <li>
                              <div className="custom_prod_border">
                                <img
                                  src={customRectImg2}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">White</span>
                              </div>
                            </li>
                            <li>
                              <div className="custom_prod_border">
                                <img
                                  src={customRectImg3}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Prism</span>
                              </div>
                            </li>
                          </ul> */}
                          <ul className="rect-custom-products">
                            <li onClick={() => changeCircleColor("#efeef0")}>
                              <div
                                className={`${
                                  activeBox === "white"
                                    ? "custom_prod_border active_border"
                                    : "custom_prod_border"
                                }`}
                              >
                                <img
                                  src={customCircleWhite}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">White</span>
                              </div>
                            </li>
                            <li onClick={() => changeCircleColor("#000000")}>
                              <div
                                className={`${
                                  activeBox === "black"
                                    ? "custom_prod_border active_border"
                                    : "custom_prod_border"
                                }`}
                              >
                                <img
                                  src={customCircleBlack}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Black</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                    {showSavedDesign && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          SAVED DESIGNS
                        </div>
                        <div
                          style={{
                            padding: "20px",
                          }}
                        >
                          <div className="no_design">
                            {savedImg.length > 0 ? (
                              <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-2 gap-4 auto-rows-auto mb-4">
                                {savedImg.map((img, i) => {
                                  return (
                                    <div className="custom_images" key={i}>
                                      <button
                                        onClick={() => removeSavedDesign(i)}
                                        className="cross_btn"
                                      >
                                        <FaTimes />
                                      </button>
                                      <img
                                        alt="logo"
                                        src={img}
                                        onClick={() => showDesign(i)}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <h3>You currently have no saved designs</h3>
                            )}

                            <div className="mt-4">
                              <button
                                className="save_btn"
                                onClick={() => saveDesign()}
                              >
                                <MdSave />
                                <span>SAVE DESIGN</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <button
                      type="button"
                      className="custom_cart_btn"
                      onClick={() => customAddToCart()}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      <RiShoppingCartLine />
                      <span>Add to Cart</span>
                    </button>
                  </Flex>
                </Flex>
              </Flex>
            ) : width > 700 ? (
              <Flex>
                <Flex
                  flex={1.2}
                  h="60vh"
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* <Flex
                justifyContent="space-between"
                alignItems="center"
                bgColor="white"
                p="20px"
              >
                <Box>
                  <Button
                    mr="10px"
                    onClick={() => {
                      const json = stageRef.current.toJSON();
                      localStorage.setItem("designer", JSON.stringify(json));

                      console.log(json);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedId(null);
                      activeRef.current.setStroke("transparent");
                      layerRef.current.draw();

                      setTimeout(() => {
                        const dataURL = stageRef.current.toDataURL({
                          quality: 1,
                          pixelRatio: 1,
                          mimeType: "image/png",
                        });
                        downloadURI(dataURL, "stage.png");
                      }, 1000);
                    }}
                  >
                    Download
                  </Button>
                </Box>
              </Flex> */}

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
                          width={300}
                          height={300}
                          style={{
                            backgroundColor: circleColor,
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
                </Flex>

                <Flex marginTop={40} flex={0.8}>
                  <Flex className="toolbox" flexDir="column">
                    <div
                      className={
                        showImage ? "toolbox-item tool-active" : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickImage()}>
                        <MdUpload fontSize={24} />
                      </button>
                      <div className="toolbox-item-label">Image</div>
                    </div>
                    <div
                      className={
                        showText ? "toolbox-item tool-active" : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickText()}>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 28 24"
                          height="22"
                          width="28"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M2 20h20v4H2v-4zm3.49-3h2.42l1.27-3.58h5.65L16.09 17h2.42L13.25 3h-2.5L5.49 17zm4.42-5.61l2.03-5.79h.12l2.03 5.79H9.91z"></path>
                        </svg>
                      </button>
                      <div className="toolbox-item-label">Text</div>
                    </div>
                    <div
                      className={
                        showPVariation
                          ? "toolbox-item tool-active"
                          : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickProductVariation()}>
                        <MdPalette fontSize={24} />
                      </button>
                      <div className="toolbox-item-label">
                        Product variations
                      </div>
                    </div>
                    <div
                      className={
                        showSavedDesign
                          ? "toolbox-item tool-active"
                          : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickSavedDesign()}>
                        <BsImageFill fontSize={22} />
                      </button>
                      <div className="toolbox-item-label">My saved designs</div>
                    </div>

                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div className="toolbox-item-stack">
                      <div>
                        <MdLayers fontSize={28} />
                      </div>
                      <div className="toolbox-stack-label">
                        <div>
                          <button
                            className="toolbar_btn"
                            onClick={() => {
                              if (activeRef.current) {
                                activeRef.current.moveToTop();
                                layerRef.current.draw();
                              }
                            }}
                          >
                            <RiBringForward />
                            <span>Bring forward</span>
                          </button>
                          <button
                            className="toolbar_btn"
                            onClick={() => {
                              if (activeRef.current) {
                                activeRef.current.moveToBottom();
                                layerRef.current.draw();
                              }
                            }}
                          >
                            <RiSendBackward />
                            <span>Send backward</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Flex>
                  <Flex
                    flex={1}
                    flexDir="column"
                    backgroundColor="white"
                    position="relative"
                  >
                    {initState && (
                      <>
                        <div>
                          <ul className="customProdBox">
                            <li onClick={() => clickImage()}>
                              <div className="onBox">
                                <span>
                                  Upload <br /> Image
                                </span>
                                <div className="icon">
                                  <MdOutlineUpload />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  Upload <br /> Image
                                </span>
                                <div className="icon">
                                  <MdOutlineUpload />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickText()}>
                              <div className="onBox">
                                <span>
                                  <br />
                                  Text
                                </span>
                                <div className="icon">
                                  <MdOutlineTextFormat />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  <br />
                                  Text
                                </span>
                                <div className="icon">
                                  <MdOutlineTextFormat />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickProductVariation()}>
                              <div className="onBox">
                                <span>
                                  Product <br /> variations
                                </span>
                                <div className="icon">
                                  <MdOutlinePalette />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  Product <br /> variations
                                </span>
                                <div className="icon">
                                  <MdOutlinePalette />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickSavedDesign()}>
                              <div className="onBox">
                                <span>
                                  My saved <br /> designs
                                </span>
                                <div className="icon">
                                  <MdOutlineImage />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  My saved <br /> designs
                                </span>
                                <div className="icon">
                                  <MdOutlineImage />
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                    {showText && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          PLAIN TEXT
                        </div>
                        <div style={{ padding: "20px" }}>
                          <div className="custom_text_div">
                            <textarea
                              onChange={(e) => handleText(e.target.value, 0)}
                              placeholder="Text to be added to your design"
                              rows={2}
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
                          </div>

                          <div className="custom_text_font_elem">
                            <div className="custom_label">Font</div>
                            <select
                              placeholder={font.family}
                              onChange={(e) =>
                                setFont({
                                  ...font,
                                  family: e.target.value,
                                })
                              }
                            >
                              <option
                                value="Arial"
                                style={{ fontFamily: "Arial" }}
                              >
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
                              <option
                                value="Muli"
                                style={{ fontFamily: "Muli" }}
                              >
                                Google Font Muli
                              </option>
                              <option
                                value="Quicksand"
                                style={{ fontFamily: "Quicksand" }}
                              >
                                Google Font Quicksand
                              </option>
                              <option
                                value="nunito"
                                style={{ fontFamily: "nunito" }}
                              >
                                Google Font Nunito Regular
                              </option>
                            </select>
                            <div className="custom_label">Font Size</div>
                            <NumberInput
                              defaultValue={0}
                              value={font.size}
                              onChange={(size) => setFont({ ...font, size })}
                              clampValueOnBlur={false}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper fontSize={12} />
                                <NumberDecrementStepper fontSize={12} />
                              </NumberInputStepper>
                            </NumberInput>
                            <div className="custom_label">Color</div>
                            <div style={{ marginTop: "10px" }}>
                              <CompactPicker
                                color={color}
                                onChange={changeColor}
                                className="color_picker"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {showImage && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          UPLOAD IMAGE
                        </div>
                        <div className="_img_card">
                          <div className="_img_card__content">
                            {/* <div className="icon">
                              <svg
                                id="svg_preview"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="{2}"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div> */}

                            <h1 className="mt-1">
                              <label htmlFor="file">
                                <TbCirclePlus
                                  fontSize="18px"
                                  className="plus_icon_upload"
                                />
                                <span className="ml-1">Upload Image</span>
                              </label>
                            </h1>
                            <input
                              id="file"
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              onChange={handleImage}
                            />
                            <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto mb-4">
                              {file.length > 0
                                ? file.map((img, index) => {
                                    return (
                                      <div
                                        className="custom_images"
                                        key={index}
                                      >
                                        <button
                                          onClick={() => removeImg(index)}
                                          className="cross_btn"
                                        >
                                          <FaTimes />
                                        </button>
                                        <img
                                          alt="logo"
                                          src={img}
                                          draggable="true"
                                          onClick={() => changeImg(img)}
                                          onDragStart={(e) => {
                                            itemRef.current = {
                                              type: "image",
                                              src: e.target.src,
                                              id: "s21",
                                            };
                                          }}
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {showPVariation && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          PRODUCT VARIATIONS
                        </div>
                        <div
                          style={{
                            padding: "20px",
                          }}
                        >
                          {/* <ul className="rect-custom-products">
                            <li>
                              <div className="custom_prod_border active_border">
                                <img
                                  src={customRectImg1}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Black</span>
                              </div>
                            </li>
                            <li>
                              <div className="custom_prod_border">
                                <img
                                  src={customRectImg2}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">White</span>
                              </div>
                            </li>
                            <li>
                              <div className="custom_prod_border">
                                <img
                                  src={customRectImg3}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Prism</span>
                              </div>
                            </li>
                          </ul> */}
                          <ul className="rect-custom-products">
                            <li onClick={() => changeCircleColor("#efeef0")}>
                              <div
                                className={`${
                                  activeBox === "white"
                                    ? "custom_prod_border active_border"
                                    : "custom_prod_border"
                                }`}
                              >
                                <img
                                  src={customCircleWhite}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">White</span>
                              </div>
                            </li>
                            <li onClick={() => changeCircleColor("#000000")}>
                              <div
                                className={`${
                                  activeBox === "black"
                                    ? "custom_prod_border active_border"
                                    : "custom_prod_border"
                                }`}
                              >
                                <img
                                  src={customCircleBlack}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Black</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                    {showSavedDesign && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          SAVED DESIGNS
                        </div>
                        <div
                          style={{
                            padding: "20px",
                          }}
                        >
                          <div className="no_design">
                            {savedImg.length > 0 ? (
                              <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-2 gap-4 auto-rows-auto mb-4">
                                {savedImg.map((img, i) => {
                                  return (
                                    <div className="custom_images" key={i}>
                                      <button
                                        onClick={() => removeSavedDesign(i)}
                                        className="cross_btn"
                                      >
                                        <FaTimes />
                                      </button>
                                      <img
                                        alt="logo"
                                        src={img}
                                        onClick={() => showDesign(i)}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <h3>You currently have no saved designs</h3>
                            )}

                            <div className="mt-4">
                              <button
                                className="save_btn"
                                onClick={() => saveDesign()}
                              >
                                <MdSave />
                                <span>SAVE DESIGN</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <button
                      type="button"
                      className="custom_cart_btn"
                      onClick={() => customAddToCart()}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      <RiShoppingCartLine />
                      <span>Add to Cart</span>
                    </button>
                  </Flex>
                </Flex>
              </Flex>
            ) : (
              <Flex flexDir="column">
                <Flex justifyContent="center" alignItems="center">
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
                          width={300}
                          height={300}
                          style={{
                            backgroundColor: circleColor,
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
                </Flex>

                <Flex marginTop={40} h="80vh">
                  <Flex
                    flex={1}
                    flexDir="column"
                    backgroundColor="white"
                    position="relative"
                  >
                    {initState && (
                      <>
                        <div>
                          <ul className="customProdBox">
                            <li onClick={() => clickImage()}>
                              <div className="onBox">
                                <span>
                                  Upload <br /> Image
                                </span>
                                <div className="icon">
                                  <MdOutlineUpload />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  Upload <br /> Image
                                </span>
                                <div className="icon">
                                  <MdOutlineUpload />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickText()}>
                              <div className="onBox">
                                <span>
                                  <br />
                                  Text
                                </span>
                                <div className="icon">
                                  <MdOutlineTextFormat />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  <br />
                                  Text
                                </span>
                                <div className="icon">
                                  <MdOutlineTextFormat />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickProductVariation()}>
                              <div className="onBox">
                                <span>
                                  Product <br /> variations
                                </span>
                                <div className="icon">
                                  <MdOutlinePalette />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  Product <br /> variations
                                </span>
                                <div className="icon">
                                  <MdOutlinePalette />
                                </div>
                              </div>
                            </li>
                            <li onClick={() => clickSavedDesign()}>
                              <div className="onBox">
                                <span>
                                  My saved <br /> designs
                                </span>
                                <div className="icon">
                                  <MdOutlineImage />
                                </div>
                              </div>
                              <div className="offBox">
                                <span>
                                  My saved <br /> designs
                                </span>
                                <div className="icon">
                                  <MdOutlineImage />
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                    {showText && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          PLAIN TEXT
                        </div>
                        <div style={{ padding: "20px" }}>
                          <div className="custom_text_div">
                            <textarea
                              onChange={(e) => handleText(e.target.value, 0)}
                              placeholder="Text to be added to your design"
                              rows={2}
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
                          </div>

                          <div className="custom_text_font_elem">
                            <div className="custom_label">Font</div>
                            <select
                              placeholder={font.family}
                              onChange={(e) =>
                                setFont({
                                  ...font,
                                  family: e.target.value,
                                })
                              }
                            >
                              <option
                                value="Arial"
                                style={{ fontFamily: "Arial" }}
                              >
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
                              <option
                                value="Muli"
                                style={{ fontFamily: "Muli" }}
                              >
                                Google Font Muli
                              </option>
                              <option
                                value="Quicksand"
                                style={{ fontFamily: "Quicksand" }}
                              >
                                Google Font Quicksand
                              </option>
                              <option
                                value="nunito"
                                style={{ fontFamily: "nunito" }}
                              >
                                Google Font Nunito Regular
                              </option>
                            </select>
                            <div className="custom_label">Font Size</div>
                            <NumberInput
                              defaultValue={0}
                              value={font.size}
                              onChange={(size) => setFont({ ...font, size })}
                              clampValueOnBlur={false}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper fontSize={12} />
                                <NumberDecrementStepper fontSize={12} />
                              </NumberInputStepper>
                            </NumberInput>
                            <div className="custom_label">Color</div>
                            <div style={{ marginTop: "10px" }}>
                              <CompactPicker
                                color={color}
                                onChange={changeColor}
                                className="color_picker"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {showImage && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          UPLOAD IMAGE
                        </div>
                        <div className="_img_card">
                          <div className="_img_card__content">
                            {/* <div className="icon">
                              <svg
                                id="svg_preview"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="{2}"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div> */}

                            <h1 className="mt-1">
                              <label htmlFor="file">
                                <TbCirclePlus
                                  fontSize="18px"
                                  className="plus_icon_upload"
                                />
                                <span className="ml-1">Upload Image</span>
                              </label>
                            </h1>
                            <input
                              id="file"
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              onChange={handleImage}
                            />
                            <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto mb-4">
                              {file.length > 0
                                ? file.map((img, index) => {
                                    return (
                                      <div
                                        className="custom_images"
                                        key={index}
                                      >
                                        <button
                                          onClick={() => removeImg(index)}
                                          className="cross_btn"
                                        >
                                          <FaTimes />
                                        </button>
                                        <img
                                          alt="logo"
                                          src={img}
                                          draggable="true"
                                          onClick={() => changeImg(img)}
                                          onDragStart={(e) => {
                                            itemRef.current = {
                                              type: "image",
                                              src: e.target.src,
                                              id: "s21",
                                            };
                                          }}
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {showPVariation && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          PRODUCT VARIATIONS
                        </div>
                        <div
                          style={{
                            padding: "20px",
                          }}
                        >
                          {/* <ul className="rect-custom-products">
                            <li>
                              <div className="custom_prod_border active_border">
                                <img
                                  src={customRectImg1}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Black</span>
                              </div>
                            </li>
                            <li>
                              <div className="custom_prod_border">
                                <img
                                  src={customRectImg2}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">White</span>
                              </div>
                            </li>
                            <li>
                              <div className="custom_prod_border">
                                <img
                                  src={customRectImg3}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Prism</span>
                              </div>
                            </li>
                          </ul> */}
                          <ul className="rect-custom-products">
                            <li onClick={() => changeCircleColor("#efeef0")}>
                              <div
                                className={`${
                                  activeBox === "white"
                                    ? "custom_prod_border active_border"
                                    : "custom_prod_border"
                                }`}
                              >
                                <img
                                  src={customCircleWhite}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">White</span>
                              </div>
                            </li>
                            <li onClick={() => changeCircleColor("#000000")}>
                              <div
                                className={`${
                                  activeBox === "black"
                                    ? "custom_prod_border active_border"
                                    : "custom_prod_border"
                                }`}
                              >
                                <img
                                  src={customCircleBlack}
                                  alt="custom product"
                                />
                                <span class="tooltipstered">Black</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                    {showSavedDesign && (
                      <>
                        <div
                          style={{
                            background: "#f6f7f8",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          SAVED DESIGNS
                        </div>
                        <div
                          style={{
                            padding: "20px",
                          }}
                        >
                          <div className="no_design">
                            {savedImg.length > 0 ? (
                              <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-2 gap-4 auto-rows-auto mb-4">
                                {savedImg.map((img, i) => {
                                  return (
                                    <div className="custom_images" key={i}>
                                      <button
                                        onClick={() => removeSavedDesign(i)}
                                        className="cross_btn"
                                      >
                                        <FaTimes />
                                      </button>
                                      <img
                                        alt="logo"
                                        src={img}
                                        onClick={() => showDesign(i)}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <h3>You currently have no saved designs</h3>
                            )}

                            <div className="mt-4">
                              <button
                                className="save_btn"
                                onClick={() => saveDesign()}
                              >
                                <MdSave />
                                <span>SAVE DESIGN</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <button
                      type="button"
                      className="custom_cart_btn"
                      onClick={() => customAddToCart()}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      <RiShoppingCartLine />
                      <span>Add to Cart</span>
                    </button>
                  </Flex>
                  <Flex className="toolbox" flexDir="column">
                    <div
                      className={
                        showImage ? "toolbox-item tool-active" : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickImage()}>
                        <MdUpload fontSize={24} />
                      </button>
                      <div className="toolbox-item-label">Image</div>
                    </div>
                    <div
                      className={
                        showText ? "toolbox-item tool-active" : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickText()}>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 28 24"
                          height="22"
                          width="28"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M2 20h20v4H2v-4zm3.49-3h2.42l1.27-3.58h5.65L16.09 17h2.42L13.25 3h-2.5L5.49 17zm4.42-5.61l2.03-5.79h.12l2.03 5.79H9.91z"></path>
                        </svg>
                      </button>
                      <div className="toolbox-item-label">Text</div>
                    </div>
                    <div
                      className={
                        showPVariation
                          ? "toolbox-item tool-active"
                          : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickProductVariation()}>
                        <MdPalette fontSize={24} />
                      </button>
                      <div className="toolbox-item-label">
                        Product variations
                      </div>
                    </div>
                    <div
                      className={
                        showSavedDesign
                          ? "toolbox-item tool-active"
                          : "toolbox-item"
                      }
                    >
                      <button onClick={() => clickSavedDesign()}>
                        <BsImageFill fontSize={22} />
                      </button>
                      <div className="toolbox-item-label">My saved designs</div>
                    </div>

                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div style={{ height: "43px" }}></div>
                    <div className="toolbox-item-stack">
                      <div>
                        <MdLayers fontSize={28} />
                      </div>
                      <div className="toolbox-stack-label">
                        <div>
                          <button
                            className="toolbar_btn"
                            onClick={() => {
                              if (activeRef.current) {
                                activeRef.current.moveToTop();
                                layerRef.current.draw();
                              }
                            }}
                          >
                            <RiBringForward />
                            <span>Bring forward</span>
                          </button>
                          <button
                            className="toolbar_btn"
                            onClick={() => {
                              if (activeRef.current) {
                                activeRef.current.moveToBottom();
                                layerRef.current.draw();
                              }
                            }}
                          >
                            <RiSendBackward />
                            <span>Send backward</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Flex>
                </Flex>
              </Flex>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default App;
