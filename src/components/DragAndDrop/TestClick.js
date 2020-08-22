import React, { useState } from "react";
import useArt from "../../art/useArt";

export default function DragAndDrop() {
  const [circlerColor, setCirclerColor] = useState("yellow");
  const [rectColor, setRectColor] = useState("red");
  // const [cords, setCords] = useState({ x: 0, y: 0 });
  const { width, height } = useArt();

  const handleCircleClick = () => {
    setCirclerColor(circlerColor === "yellow" ? "pink" : "yellow");
  };

  const handleRectClick = () => {
    setRectColor(rectColor === "red" ? "green" : "red");
  };

  // const handleMouseMove = (mouse) => {
  //   setCords({
  //     x: Math.abs(width / 2 - 50 - mouse.x) / 100,
  //     y: Math.abs(height / 2 - 50 - mouse.y) / 100,
  //   });
  // };

  return (
    <group>
      <arc
        x={width / 2 - 50}
        y={height / 2 - 50}
        radius={50}
        color={circlerColor}
        onClick={handleCircleClick}
        onMouseOver={handleCircleClick}
        drag
      />
      <rect
        x={width / 2 - 50}
        y={height / 2 - 50}
        width={100}
        height={100}
        // color={`hsl(${cords.x * 360}, ${cords.y * 100}%, 60%)`}
        color={rectColor}
        // onClick={handleRectClick}
        onMouseOver={handleRectClick}
        // onMouseMove={handleMouseMove}
        drag
      />
      {/* <text
        x={20}
        y={20}
        text={`${cords.x}, ${cords.y}`}
        size={20}
        color="#fff"
      /> */}
    </group>
  );
}
