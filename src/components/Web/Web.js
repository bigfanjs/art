import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useAddForce from "./art/useAddForce";

import Constraint from "./Constraint";

const Settings = { gravity: 0 };

export default function Web() {
  const addForce = useAddForce();
  const controls = useUpdate(
    // we create a class with the following props:
    { x: 0, y: 0, px: 0, py: 0 },
    { count: 10, offsets: true }
  );

  // point physics: ✓
  useEffect(() => {
    controls.start(({ props: { x, y, px, py } }) => {
      const { vx, vy } = addForce(0, Settings.gravity);
      const delta = 0.016;

      const nx = x + (x - px) * 0.99 + (vx / 2) * delta;
      const ny = y + (y - py) * 0.99 + (vy / 2) * delta;

      return { x: nx, y: ny, px: x, py: y };
    });
  });

  return (
    <group>
      {controls.elements.map((point, idx) => (
        <Constraint
          key={idx}
          p1={point}
          p2={idx > 0 && controls.elements[idx - 1]}
        />
      ))}
    </group>
  );
}
