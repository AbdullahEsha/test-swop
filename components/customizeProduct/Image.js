import React, { Fragment, useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from './useImage';

const AdImage = ({
  image,
  isSelected,
  onSelect,
  onDragStart,
  onDragEnd,
  stageRef,
  setSelectedId,
  layerRef,
}) => {
  const [img] = useImage(image.src, 'anonymous');
  const imageRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually

      trRef.current.moveToTop();
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.moveToTop();
      setSelectedId(image.hash);
    }
  }, []);

  const clearFocus = (shape) => {
    shape.setStroke('transparent');
    layerRef.current.draw();
  };

  const setFocus = (shape) => {
    shape.setStroke('#2dacf5');
    layerRef.current.draw();
  };
  console.log('image', image);

  return (
    <Fragment>
      <Image
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onMouseEnter={(event) => {
          const shape = event.target;

          stageRef.current.container().style.cursor = 'move';

          if (!isSelected) {
            setFocus(shape);
          }
        }}
        onMouseLeave={(event) => {
          const shape = event.target;
          stageRef.current.container().style.cursor = 'default';
          if (!isSelected) {
            clearFocus(shape);
          }
        }}
        onDragMove={(event) => {
          const shape = event.target;
          clearFocus(shape);
          onSelect(event);
        }}
        onClick={(event) => {
          const shape = event.target;
          onSelect(event);
          clearFocus(shape);
        }}
        onTap={onSelect}
        ref={imageRef}
        image={img}
        imageUrl={image.src}
        x={image.x}
        y={image.y}
        imageId={image.id}
        draggable
        offsetX={0}
        offsetY={0}
        {...(img && {
          offsetX: image.offsetX,
          offsetY: image.offsetY,
          scaleX: image.scaleX,
          scaleY: image.scaleY,
        })}
        type={image.type}
        strokeWidth={1}
      />
      {isSelected && (
        <Transformer
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
          keepRatio
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Fragment>
  );
};

export default AdImage;
