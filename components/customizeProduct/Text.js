import React, { Fragment, useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";

const TextDisplay = ({
  text,
  isSelected,
  onSelect,
  onDragStart,
  onDragEnd,
  stageRef,
  activeRef,
  setFont,
  setSelectedId,
  layerRef,
  color,
  fill,
}) => {
  const textRef = useRef();
  const trRef = useRef();

  const stage = stageRef.current;
  const layer = layerRef.current;

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.moveToTop();
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
      console.log(textRef);
      activeRef.current = textRef.current;
    }
  }, [isSelected]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.moveToTop();
      textRef.current.attrs.fontSize = 32;
      textRef.current.attrs.fontFamily = "Arial";
      textRef.current.attrs.fill = "000";
      textRef.current.attrs.color = color;
      setSelectedId(text.hash);
    }
  }, []);

  const onDblClick = () => {
    const textNode = textRef.current;
    const tr = trRef.current;

    textNode.hide();
    tr.hide();
    layer.draw();

    let rotation = textNode.rotation();
    let scale = textNode.getAbsoluteScale().x;

    const textPosition = textNode.absolutePosition();

    const areaPosition = {
      x: stage.container().offsetLeft + textPosition.x,
      y: stage.container().offsetTop + textPosition.y,
    };

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textNode.text();

    Object.assign(textarea.style, {
      position: "absolute",
      top: areaPosition.y + "px",
      left: areaPosition.x + "px",
      width: textNode.width() - textNode.padding() * 2 + "px",
      height: textNode.height() - textNode.padding() * 2 + 5 + "px",
      fontSize: textNode.fontSize() * scale + "px",
      border: "none",
      padding: "0px",
      margin: "0px",
      overflow: "hidden",
      background: "none",
      outline: "none",
      resize: "none",
      lineHeight: textNode.lineHeight(),
      fontFamily: textNode.fontFamily(),
      transformOrigin: "left top",
      textAlign: textNode.align(),
      rotation: textNode.rotation(),
    });

    let transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }

    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += "translateY(-" + px + "px)";

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = "auto";
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + "px";

    textarea.focus();

    function removeTextarea() {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener("click", handleOutsideClick);
      textNode.show();
      tr.show();
      layer.draw();
    }

    textarea.addEventListener("keydown", function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value);
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener("keydown", function (e) {
      scale = textNode.getAbsoluteScale().x;
      // setTextareaWidth(textNode.width() * scale);
      textarea.style.height = "auto";
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + "px";
    });

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  };

  return (
    <Fragment>
      <Text
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onMouseEnter={(event) => {
          stageRef.current.container().style.cursor = "move";
        }}
        onMouseLeave={(event) => {
          stageRef.current.container().style.cursor = "default";
        }}
        onDragMove={onSelect}
        onClick={onSelect}
        onTap={onSelect}
        ref={textRef}
        text={text.text}
        x={text.x}
        y={text.y}
        fontFamily={text.fontFamily}
        fill={fill}
        draggable
        type={text.type}
        width={200}
        onDblClick={onDblClick}
        onTransform={() => {
          const textNode = textRef.current;
          textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            scaleX: 1,
          });
        }}
      />
      {isSelected && (
        <Transformer
          enabledAnchors={["middle-left", "middle-right"]}
          anchorFill="#2dacf5"
          onDragMove={(event) => {
            const shape = event.target;
            shape.moveToTop();
          }}
          onClick={(event) => {
            const shape = event.target;
            shape.moveToTop();
          }}
          anchorStrokeWidth={1}
          borderStrokeWidth={1}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </Fragment>
  );
};

export default TextDisplay;
