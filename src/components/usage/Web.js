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

      return { x, y, px, py };
    });
  }, [gravity]);

  console.log({ constLen: gravity.elements.length });

  return (
    <group>
      {gravity.map((elem, i) => {
        //   <arc key={i} color="#fff" radius={3} update={elem} />

        // i > 0 && console.log({ aa: i - 1 });
        // i > 0 && console.log({ bb: (i - 1) * (1 % (i % depth)) });
        // i > 0 && console.log({ cc: 1 % (i % depth) });

        return (
          i > 0 && (
            <Constraint
              key={i}
              p1={elem}
              // p2={gravity.elements[(i - 1) * (i % depth)]}
              p2={gravity.elements[(i - 1) * ((i - 1) % (depth - 1))]}
            />
          )
        );
      })}
    </group>
  );
}

// RE THINK IS REQUIRED

/*

try build a new useCreateSpiderWeb that created updates on the fly.

*/
