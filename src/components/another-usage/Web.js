import React, { useEffect } from "react";

import useCreateSiderWeb from "./useCreateSiderWeb";
import Constraint from "./Constraint";

export default function Web({ radius, resolution, depth, curve }) {
  const [points, constraints] = useCreateSiderWeb({ depth, resolution });

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
      // const ny = y + (y - py) + 0 * delta; // test 0 gravity

      setTimeout(() => {
        debugger;
      }, 1000);

      return { x, y, px, py };
      // return { x: nx, y: ny, px: x, py: y };
    });
  }, [points]);

  return (
    <group>
      {constraints.map(([p1, p2], i) => {
        // <arc key={i} color="#fff" radius={3} update={point} />
        return <Constraint key={i} p1={p1} p2={p2} />;
      })}
    </group>
  );
}
