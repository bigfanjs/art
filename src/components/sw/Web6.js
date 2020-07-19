import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useAddForce from "./art/useAddForce";
import Constraints from "./Constraints5";

const Settings = { gravity: 0 };

export default function Web() {
  const addForce = useAddForce();
  const controls = useUpdate(
    { x: 0, y: 0, px: 0, py: 0 },
    { count: 10, offsets: true }
  );

  useEffect(() => {
    controls.start(({ x, y, px, py }) => {
      const { vx, vy } = addForce(0, Settings.gravity);
      const delta = 0.016;

      const nx = x + (x - px) * 0.99 + (vx / 2) * delta;
      const ny = y + (y - py) * 0.99 + (vy / 2) * delta;

      return { x: nx, y: ny, px: x, py: y };
    });
  });

  return <Constraints points={controls} />;
}
