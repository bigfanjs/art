import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useCalcDistance from "./useCalcDistance";

// the problem is how to minipulate the points.

// why I don't like the array approach?

/* Cons */
// 1- It forces me to expend the api way beyond how it's first intended to be
// 2- I beieve there is a shorter nicer way to do it.
// 3- I did not like the idea of passing objects to the update hook
// 4- It feels like it's getting too much spiderweb specific.

/* Pros */
// 1- I like the idea of passing p1 and p2 to the Constraint component.
// 2-

/** Ideas: */
// 1- introduce the concept of chaining updates.
// 2- make sure the api is as clear as possible.
// 3- do you think it makes sense that we update the points inside the Constraint?
//

/**
  set new to true to let useUpdate hook know that it should create a new instance of
 */

export default function Constraint({ p1, p2, cp, length, point }) {
  const resolver = useUpdate([p1, p2]);
  const controls = useUpdate(resolver, { new: true });
  const calcDistance = useCalcDistance();

  // resolve constraints:
  useEffect(() => {
    resolver.start(({ props: [p1, p2] }) => {
      const { dist, diffX, diffY } = calcDistance(p1, p2);
      const diff = (length - dist) / dist;

      const px = diffX * diff * 0.5;
      const py = diffY * diff * 0.5;

      return [
        { x: p1.x + px, y: p1.y + py },
        { x: p2.x - px, y: p2.y - py },
      ];
    });

    // attach
    controls.start(({ props: [p1, p2] }) => {
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    });
  });

  return <line update={controls} />;
}
