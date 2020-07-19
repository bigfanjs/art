import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useCalcDistance from "./useCalcDistance";

export default function Constraint({ p1, p2, cp, length, point }) {
  const controls = useUpdate();
  const update = useUpdateElements({ p1, p2 });
  const calcDistance = useCalcDistance();

  useEffect(() => {
    controls.start(() => {
      const { dist, diffX, diffY } = calcDistance(p1, p1);
      const diff = (length - dist) / dist;

      const px = diffX * diff * 0.5;
      const py = diffY * diff * 0.5;

      update({
        x: p1.x + (!index ? px : px * -1),
        y: p2.y + (!index ? py : py * -1),
      });

      return {
        x1: p1.x + px,
        x2: p1.y + px,
        y1: p2.x - px,
        y2: p2.y - px,
      };
    });
  });

  return <line update={controls} />;
}
