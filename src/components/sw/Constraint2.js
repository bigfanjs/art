import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useCalcDistance from "./useCalcDistance";

export default function Constraint({ p1, p2, cp, length, point }) {
  const controls = useUpdate();
  const calcDistance = useCalcDistance();

  // resolve constraints:
  useEffect(() => {
    controls.start(({ p1, p2 }) => {
      const { dist, diffX, diffY } = calcDistance(p1, p2);
      const diff = (length - dist) / dist;

      const px = diffX * diff * 0.5;
      const py = diffY * diff * 0.5;

      return {
        x1: p1.x1 + px,
        y1: p1.y1 + py,
        x2: p2.x2 - px,
        y2: p2.y2 - py,
      };
    });
  });

  return <line update={controls} />;
}
