import React, { useEffect } from "react";

import useUpdate from "../../art/useUpdate";
import useResolveConstraints from "./useResolveConstraints";
import useCalcDistance from "./useCalcDistance";

export default function Constraint(point) {
  const calcDistance = useCalcDistance();
  const resolveConstraints = useResolveConstraints();
  const controls = useUpdate(point, { offsets: true });

  const attached = point.attached;

  useEffect(() => {
    const { dist } = calcDistance(point.get(), attached.get());

    point.start(resolveConstraints(1, dist));
    attached.start(resolveConstraints(-1, dist));

    controls.start(({ props: p1, attached: p2 }) => {
      return {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
      };
    });
  }, [controls, point, attached, resolveConstraints, calcDistance]);

  return <line update={controls} color="#fff" />;
}
