import React, { useEffect } from "react";

import useCreateSiderWeb from "./useCreateSiderWeb";
import Constraint from "./Constraint";

export default function Web({ radius, resolution, depth, curve }) {
  const points = useCreateSiderWeb({ depth, resolution });

  useEffect(() => {
    points.start(({ props: { x, y, px, py } }) => {
      //   const delta = 1 / 60;

      //   const nx = x + (x - px) + 0 * delta;
      //   const ny = y + (y - py) + 8.9 * delta;

      //   return { x: nx, y: ny, px: x, py: y };

      return { x, y, px, py };
    });
  }, [points]);

  return (
    <group>
      {points.map((point, i) => (
        <Constraint key={i} point={point} />
      ))}
    </group>
  );
}
