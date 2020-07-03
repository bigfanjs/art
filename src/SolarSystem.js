import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useArt from "./art/useArt";

export default function SolarSystem() {
  const { width, height } = useArt();
  const controls = useUpdate({ rotate: 0 });

  useEffect(() => {
    controls.start(({ time }) => {
      return { rotate: Math.PI * time * 0.0002 };
    });
  }, [controls]);

  return (
    <group
      x={0}
      y={0}
      transform={{ x: width / 2, y: height / 2 }}
      hint={0}
      update={controls}
    >
      <hexagon x={0} y={0} color="gold" radius={50} update={controls} />
      <group
        x={0}
        y={0}
        transform={{ x: 150, y: 0 }}
        update={controls}
        hint={0}
      >
        <hexagon x={0} y={0} color="skyblue" radius={15} />
        <hexagon x={30} y={0} color="darkgray" radius={8} update={controls} />
      </group>
    </group>
  );
}
