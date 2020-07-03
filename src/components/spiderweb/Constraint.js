import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useCalcDistance from "./useCalcDistance";

export default function Constraint({ p1, p2, cp, length, point }) {
  const controls = useUpdate();
  const calcDistance = useCalcDistance();

  useEffect(() => {
    controls.start(({ time }) => {
      const { dist, diffX, diffY } = calcDistance(p1, p1);
      const diff = (length - dist) / dist;

      const px = diffX * diff * 0.5;
      const py = diffY * diff * 0.5;

      p1.x += px;
      p1.y += py;
      p2.x -= px;
      p2.y -= py;
    });
  });

  return <line update={controls} />;

  //   return ({ ctx }) => {
  //     ctx.moveTo(p1.x, p1.y);

  //     cp ? ctx.quadraticCurveTo(cp.x, cp.y, p2.x, p2.y) : ctx.lineTo(p2.x, p2.y);
  //   };
}
