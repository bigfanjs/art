import React, { useState } from "react";
import useArt from "../../art/useArt";

export default function DragAndDrop() {
  const [circlerColor, setCirclerColor] = useState("yellow");
  const [rectColor, setRectColor] = useState("red");
  const [hexColor, setHexColor] = useState("blue");
  // const [cords, setCords] = useState({ x: 0, y: 0 });
  const { width, height } = useArt();

  const handleCircleClick = () => {
    setCirclerColor(circlerColor === "yellow" ? "pink" : "yellow");
  };

  const handleRectClick = () => {
    setRectColor(rectColor === "red" ? "green" : "red");
  };

  const handleHexClick = () => {
    setHexColor(hexColor === "blue" ? "gold" : "blue");
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
        // onClick={handleCircleClick}
        onMouseIn={handleCircleClick}
        onMouseOut={handleCircleClick}
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
        onMouseIn={handleRectClick}
        onMouseOut={handleRectClick}
        // onMouseMove={handleMouseMove}
        drag
      />
      <hexagon
        x={width / 2 - 50}
        y={height / 2 - 50}
        color={hexColor}
        radius={50}
        onMouseIn={handleHexClick}
        onMouseOut={handleHexClick}
        drag
      />
      <text
        x={20}
        y={50}
        text="BEAST ADEL"
        size={40}
        color="green"
        baseLine="middle"
        drag
      />
      <text
        x={300}
        y={50}
        text="Who am I?"
        size={20}
        color="gray"
        baseLine="middle"
        drag
      />
      <polygon points="20,50 100,100 20,100 20,50" color="yellow" stroke drag />
      <img
        src="https://drscdn.500px.org/photo/78655895/m%3D900/ff907b64c70732ae8a730f04ba157655"
        x={550}
        y={100}
        width={300}
        height={200}
        drag
      />
    </group>
  );
}
