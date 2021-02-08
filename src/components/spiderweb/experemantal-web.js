import React, { useEffect } from "react";

import useCreateSpiderWeb from "./useCreateSpiderWeb";
import Constraint from "./Constraint";
import useCalcDistance from "./useCalcDistance";
import useEvent from "../../art/useEvent";

export default function Web({ resolution, depth }) {
  const mouse = useEvent("mousemove");
  const points = useCreateSpiderWeb({ depth, resolution, event: mouse });
  const calcDistance = useCalcDistance({ depth, resolution });

  useEffect(() => {
    points.start(({ props: { x, y, px, py } }) => {
      const delta = 1 / 60;

      const nx = x + (x - px) + 0 * delta;
      const ny = y + (y - py) + 8.9 * delta;

      return { x: nx, y: ny, px: x, py: y };
    });
  }, [points, calcDistance]);

  return (
    <group>
      {points.map((point) =>
        point.map((p2, j) => <Constraint key={j} p1={point} p2={p2} />)
      )}
    </group>
  );
}
