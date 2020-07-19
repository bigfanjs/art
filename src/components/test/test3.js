import React, { useEffect } from "react";

import useUpdate from "../../art/useUpdate";
import useCreateSpiderWeb from "./useCreateSpiderWeb";
import Constraint from "./Constraint";

export default function Web({ radius, resolution, depth, curve }) {
  const createSpiderWeb = useCreateSpiderWeb({ depth, resolution });
  const gravity = useUpdate(createSpiderWeb, {
    offsets: true,
    count: [depth, resolution],
  });

  useEffect(() => {
    gravity.start(({ props: { x, y, px, py } }) => {
      //   const delta = 1 / 60;

      //   const nx = x + (x - px) + 0 * delta;
      //   const ny = y + (y - py) + 8.9 * delta;

      //   return { x: nx, y: ny, px: x, py: y };
      return { x, y, px: x, py: y };
    });
  }, [gravity]);

  return (
    <group>
      {gravity.map(
        (elem, i) =>
          i && <Constraint key={i} p1={elem} p2={gravity.elements[i - 1]} />
          // <arc key={i} color="#fff" radius={3} update={elem} />
      )}
    </group>
  );
}
