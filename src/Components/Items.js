import React, { forwardRef } from "react";

const Item = ({ id, withOpacity, isDragging, imageUrl, rows, columns, style, ...props }, ref) => {
  const gridSize = `${rows}*${columns}`;
  let height = "140px"; // Default height for desktop
  let width = "140px"; // Default width for desktop

  switch (gridSize) {
    case '3*3':
      height = "140px";
      width = "140px";
      break;
    case '4*4':
      height = "90px";
      width = "90px";
      break;
     
     case '6*6':
      height="60px";
      width="60px";
      break;
    default:
      break;
  }

  const inlineStyles = {
    opacity: withOpacity ? "0.5" : "1",
    transformOrigin: "50% 50%",
    height: height,
    width: width,
    borderRadius: "10px",
    cursor: isDragging ? "grabbing" : "grab",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: isDragging
      ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
      : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
    transform: isDragging ? "scale(1.05)" : "scale(1)",
    ...style,
  };

  // Check if the device is a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    switch (gridSize) {
      case '3*3':
        inlineStyles.height = "90px";
        inlineStyles.width = "90px";
        break;
      case '4*4':
        inlineStyles.height = "60px";
        inlineStyles.width = "60px";
        break;
       
       case '6*6':
        inlineStyles.height = "30px";
        inlineStyles.width = "30px";
        break;
      default:
        break;
    }
  
  }

  return (
    <div ref={ref} style={inlineStyles} {...props}>
      <img src={imageUrl} style={{ width: "100%", height: "100%" }} alt="Item" />
    </div>
  );
}

export default forwardRef(Item);
