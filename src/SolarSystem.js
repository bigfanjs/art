import React, { useEffect } from "react";
import { useUpdate, useContext2D } from "./canvas-renderer";

export default function SolarSystem() {
  const { width, height } = useContext2D();
  const controls = useUpdate({ rotate: 0 });

  useEffect(() => {
    controls.start(({ time }) => {
      return { rotate: Math.PI * time * 0.0001 };
    });
  }, [controls]);

  return (
    <group
      transform={{ x: width / 2, y: height / 2 }}
      hint={150}
      update={controls}
    >
      <hexagon x={0} y={0} color="yellow" radius={50} />
      <hexagon x={200} y={0} color="skyblue" radius={15} />
    </group>
  );
}
