import { useEffect, useMemo, useState } from "react";

function useTextArea({ textNode, stage, transformer, layer }) {
  const textArea = useMemo(() => {
    if (!textNode) return null;
    let scale = textNode.getAbsoluteScale().x;
    let rotation = textNode.rotation();

    const textPosition = textNode.absolutePosition();

    const areaPosition = {
      x: stage.container().offsetLeft + textPosition.x,
      y: stage.container().offsetTop + textPosition.y
    };

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

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
      color: textNode.fill(),
      rotation: textNode.rotation()
    });

    return textarea;
  }, [textNode, stage]);

  // return array because it it better to use in case of several useImage hooks
  return [textArea];
}

export default useTextArea;
