import React, { useEffect } from "react";

import useUpdate from "../../art/useUpdate";
import useResolveConstraints from "./useResolveConstraints";

export default function Constraint({ p1, p2 }) {
  const resolveConstraints = useResolveConstraints();
  const controls = useUpdate([p1, p2]);

  useEffect(() => {
    p1.attach(p2).start(resolveConstraints(1));
    p2.attach(p1).start(resolveConstraints(-1));

    controls.reduce(([p1, p2]) => ({
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
    }));

    // controls.reduce(
    //   (sum, point, i) => ({
    //     ...sum,
    //     [`x${i + 1}`]: point.x,
    //     [`y${i + 1}`]: point.y,
    //   }),
    //   {}
    // );
  }, [controls, p1, p2, resolveConstraints]);

  return <line update={controls} />;
}
