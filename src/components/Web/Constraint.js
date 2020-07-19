import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useCalcDistance from "./useCalcDistance";

export default function Constraint({ p1, p2, length }) {
  const resolver = useUpdate();
  const controls = useUpdate(); // creates a new instance and chain
  const calcDistance = useCalcDistance();

  useEffect(() => {
    resolver.start(() => {
      const { dist, diffX, diffY } = calcDistance(p1, p2);
      const diff = (length - dist) / dist;

      const px = diffX * diff * 0.5;
      const py = diffY * diff * 0.5;

      p1.set({ x: p1.x + px, y: p1.y + py });
      p2.set({ x: p1.x - px, y: p1.y - py });
    });

    controls.start(() => {
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    });
  }, []);

  return <line update={controls} />;
}
