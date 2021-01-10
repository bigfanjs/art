import React, { useState } from "react";
import useArt from "../../art/useArt";

export default function DragAndDrop() {
  const [circlerColor, setCirclerColor] = useState("grey");
  const [rectColor, setRectColor] = useState("#ff6347");
  const [hexColor, setHexColor] = useState("blue");
  const [polyColor, setPolyColor] = useState("yellow");

  // const [cords, setCords] = useState({ x: 0, y: 0 });
  const { width, height } = useArt();

  const handleCircleClick = () => {
    setCirclerColor(circlerColor === "grey" ? "yellow" : "grey");
  };

  const handleRectClick = () => {
    setRectColor(rectColor === "#ff6347" ? "#98FB98" : "#ff6347");
  };

  const handleHexClick = () => {
    setHexColor(hexColor === "blue" ? "gold" : "blue");
  };

  const handlePolClick = () => {
    setPolyColor(polyColor === "yellow" ? "red" : "yellow");
  };

  // const handleMouseMove = (mouse) => {
  //   setCords({
  //     x: Math.abs(width / 2 - 50 - mouse.x) / 100,
  //     y: Math.abs(height / 2 - 50 - mouse.y) / 100,
  //   });
  // };

  return (
    <group>
      {/* <arc
        x={200}
        y={height / 2}
        radius={50}
        color={circlerColor}
        // onClick={handleCircleClick}
        onMouseIn={handleCircleClick}
        onMouseOut={handleCircleClick}
        select={true}
        // drag
      /> */}

      {/* <rect
        x={width / 2}
        y={height / 2}
        width={300}
        height={300}
        // color={`hsl(${cords.x * 360}, ${cords.y * 100}%, 60%)`}
        color={rectColor}
        // onClick={handleRectClick}
        onMouseIn={handleRectClick}
        onMouseOut={handleRectClick}
        select={true}
        // onMouseMove={handleMouseMove}
        // drag
      /> */}
      {/* <hexagon
        x={width / 2.2 - 50}
        y={height / 2 - 50}
        color={hexColor}
        radius={50}
        onMouseIn={handleHexClick}
        onMouseOut={handleHexClick}
        select={true}
        // transform={{ scaleX: 2 }}
        // drag
      /> */}
      <text
        x={width / 5}
        y={height / 5}
        text="BEAST ADEL"
        size={40}
        color="green"
        baseLine="middle"
        select
        // drag
      />
      {/* <text
        x={300}
        y={50}
        text="Who am I?"
        size={20}
        color="gray"
        baseLine="middle"
        // drag
      /> */}
      {/* <polygon
        points="420,250 500,300 420,300"
        color={polyColor}
        onMouseIn={handlePolClick}
        onMouseOut={handlePolClick}
        select={true}
        stroke
      /> */}
      {/* <img
        src="https://drscdn.500px.org/photo/78655895/m%3D900/ff907b64c70732ae8a730f04ba157655"
        x={550}
        y={100}
        width={300}
        height={200}
        // drag
      /> */}
    </group>
  );
}
