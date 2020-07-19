import React, { useEffect } from "react";

import useCreateConstraints from "./useCreateConstraints";
import useCalcDistance from "./useCalcDistance";
import useUpdate from "../art/useUpdate";

// the idea here is to avoid creating too much updates
export default function Constraints({ points }) {
  const constraints = useCreateConstraints(points);
  const resolver = useUpdate(constraints);
  const controls = useUpdate(resolver, { new: true });
  const calcDistance = useCalcDistance();

  // resolve constraints by modifying the same given instance:
  useEffect(() => {
    resolver.start(({ props }) => {
      const [p1, p2] = props;
      const { dist, diffX, diffY } = calcDistance(p1, p2);
      const diff = (length - dist) / dist;

      const px = diffX * diff * 0.5;
      const py = diffY * diff * 0.5;

      return [
        { x: p1.x + px, y: p1.y + py },
        { x: p2.x - px, y: p2.y - py },
      ];
    });

    // attach by creating new instances for each instance.
    controls.start(([p1, p2]) => {
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    });
  }, []);

  return (
    <group>
      {controls.elements.map((crl, idx) => (
        <line key={idx} update={crl} />
      ))}
    </group>
  );
}
