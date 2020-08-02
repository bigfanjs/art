import React, { useEffect } from "react";

import useCreateSiderWeb from "./useCreateSiderWeb";
import Constraint from "./Constraint";

export default function Web({ radius, resolution, depth, curve }) {
  const points = useCreateSiderWeb({ depth, resolution });

  useEffect(() => {
    points.start(({ props: { x, y, px, py, pinx, piny } }) => {
      const delta = 1 / 60;

      if (pinx && piny)
        return {
          x: pinx,
          y: piny,
          px: x,
          py: y,
          pinx,
          piny,
        };

      const nx = x + (x - px) + 0 * delta;
      const ny = y + (y - py) + 8.9 * delta;

      return { x: nx, y: ny, px: x, py: y };
    });
  }, [points]);

  return (
    <group>
      {points.map((point, i) =>
        point.map((p2, j) => <Constraint key={j} p1={point} p2={p2} />)
      )}
    </group>
  );
}
