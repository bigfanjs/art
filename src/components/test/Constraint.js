import React, { useEffect } from "react";

import useUpdate from "../../art/useUpdate";
import useResolveConstraints from "./useResolveConstraints";

export default function Constraint({ p1, p2 }) {
  const resolveConstraints = useResolveConstraints();
  const attach = useUpdate(null, { attach: true });
  const controls = useUpdate(null, { map: true }); // creates a new instance and chain

  useEffect(() => {
    attach([p1, p2]);

    p1.start(resolveConstraints(1));
    p2.start(resolveConstraints(-1));

    controls.map([p1, p2], ([p1, p2]) => ({
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
    }));
  }, [attach, controls, p1, p2, resolveConstraints]);

  return <line update={controls} />;
}
