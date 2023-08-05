import React from "react"

const Grid = ({ children, columns }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, .1fr)`,
        gridGap: 10,
        justifyContent: "center", 
        alignItems: "center", 
      }}
    >
      {children}
    </div>
  )
}

export default Grid;

