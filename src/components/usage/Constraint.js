import React, { useEffect } from "react";

import useUpdate from "../../art/useUpdate";
import useResolveConstraints from "./useResolveConstraints";
import useCalcDistance from "./useCalcDistance";

export default function Constraint({ p1, p2 }) {
  const calcDistance = useCalcDistance();
  const resolveConstraints = useResolveConstraints();
  const controls = useUpdate(null, { offsets: true });

  useEffect(() => {
    const { dist } = calcDistance(p1.get(), p2.get());

    p1.attach(p2).start(resolveConstraints(1, dist));
    p2.attach(p1).start(resolveConstraints(-1, dist));

    controls.attach([p1, p2]).start(({ attached: [p1, p2] }) => {
      setTimeout(() => {
        debugger;
      }, 1000);

      return {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
      };
    });
  }, [controls, p1, p2, resolveConstraints, calcDistance]);

  return <line update={controls} color="#fff" />;
}
