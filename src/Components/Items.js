import React, { forwardRef } from "react";

const Item = forwardRef(
  ({ id, withOpacity, isDragging, imageUrl, style, ...props }, ref) => {
    const inlineStyles = {
      opacity: withOpacity ? "0.5" : "1",
      transformOrigin: "50% 50%",
      height: "140px", // Default height for desktop
      width: "140px", // Default width for desktop
      borderRadius: "10px",
      cursor: isDragging ? "grabbing" : "grab",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: isDragging
        ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
        : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      ...style
    };

    // Check if the device is a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      inlineStyles.height = "100px"; // Adjusted height for mobile
      inlineStyles.width = "100px"; // Adjusted width for mobile
    }

    return (
      <div ref={ref} style={inlineStyles} {...props}>
        <img src={imageUrl} style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }
);

export default Item;
