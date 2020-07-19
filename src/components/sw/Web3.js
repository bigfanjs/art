import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useCreateElements from "./art/useCreateElements";
import useAddForce from "./art/useAddForce";

import Constraint from "./Constraint";

const Settings = {
  gravity: 0,
};

export default function Web() {
  const addForce = useAddForce();
  const controls = useUpdate({ count: 10 });
  const points = useCreateElements(10, (n) => {
    return { x: 0, y: 0, px: 0, py: 0, update: controls[n] };
  });

  useEffect(() => {
    controls.start(({ point }) => {
      const { vx, vy } = addForce(0, Settings.gravity);
      const delta = 0.016;

      const x = point.x + (point.x - point.px) * 0.99 + (vx / 2) * delta;
      const y = point.y + (point.y - point.py) * 0.99 + (vy / 2) * delta;

      return { x, y, px: point.x, py: point.y };
    });
  });

  return (
    <group>
      {points.map((point, idx) => (
        <Constraint p1={point} p2={idx > 0 && points[idx - 1]} />
      ))}
    </group>
  );
}
