import React from "react";
import useArt from "../../art/useArt";
import { useState } from "react";

export default function DragAndDrop() {
  const [isOpen, setIsOpen] = useState(false);
  const { width, height } = useArt();

  const handleMouseClick = () => setIsOpen(!isOpen);

  return (
    <group>
      <arc
        x={100}
        y={100}
        radius={20}
        color="lightblue"
        onClick={handleMouseClick}
      />
      {isOpen ? (
        <rect
          x={width / 2 - 50}
          y={height / 2 - 50}
          width={100}
          height={100}
          color="gold"
          drag
        />
      ) : (
        <>
          <hexagon x={width / 2} y={height / 2} color="gold" radius={50} drag />
          <hexagon
            x={width / 2.8}
            y={height / 2}
            color="red"
            radius={50}
            drag
          />
          <arc x={width / 4.5} y={height / 2} radius={50} color="pink" drag />
          <polygon points="75,300 100,325 100,275" color="green" drag />
        </>
      )}
    </group>
  );
}
