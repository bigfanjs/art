import React, { useEffect } from "react";

import useCalcDistance from "./useCalcDistance";
import useUpdate from "../../art/useUpdate";

export default function Constraint({ constraint, length }) {
  const resolver = useUpdate(constraint);
  const controls = useUpdate(resolver, { new: true });
  const calcDistance = useCalcDistance();

  // resolve constraints:
  useEffect(() => {
    resolver.start(({ p1, p2 }) => {
      const { dist, diffX, diffY } = calcDistance(p1, p2);
      const diff = (length - dist) / dist;

      const px = diffX * diff * 0.5;
      const py = diffY * diff * 0.5;

      return [
        { x: p1.x + px, y: p1.y + py },
        { x: p2.x - px, y: p2.y - py },
      ];
    });

    controls.start(([p1, p2]) => {
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    });
  }, []);

  return <line update={controls} />;
}
