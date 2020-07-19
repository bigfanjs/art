import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useCalcDistance from "./useCalcDistance";

export default function Constraint({ p1, p2, length }) {
  const resolver = useUpdate({ p1, p2 }, { new: true });
  const controls = useUpdate(resolver, { new: true });
  const calcDistance = useCalcDistance();

  useEffect(() => {
    resolver.start(({ props: { p1, p2 } }) => {
      const { dist, diffX, diffY } = calcDistance(p1, p2);
      const diff = (length - dist) / dist;

      const px = diffX * diff * 0.5;
      const py = diffY * diff * 0.5;

      return {
        p1: { x: p1.x + px, y: p1.y + py },
        p2: { x: p2.x - px, y: p2.y - py },
      };
    });

    controls.start(({ props: { p1, p2 } }) => {
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    });
  }, []);

  return <line update={controls} />;
}
