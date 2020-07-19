import React, { useEffect } from "react";

import useUpdate from "../../art/useUpdate";
import useArt from "../../art/useArt";
import useAddForce from "./useAddForce";

/*

Steps: I have taken so far:
1- using references
2- create virtual elements
3- using useUpdate hook


Spider Web example:
1- use native useUpdate hook
2- try to create a pointPhyics hook and combine it with useUpdate.

Build a bouncing ball example

Test:
1- count
2- offsets
3- chain starts
4- chain updates
5-

*/

export default function Web() {
  const { width } = useArt();
  const addForce = useAddForce();
  const gravity = useUpdate(
    // we create a class with the following props:
    { x: width / 2, y: 20, px: width / 2, py: 20 },
    { offsets: true }
  );

  // point physics: ✓
  useEffect(() => {
    gravity.start(({ props: { x, y, px, py } }) => {
      const { vx, vy } = addForce(0, 1200);
      const delta = 0.00016;

      const nx = x + (x - px) * 0.99 + (vx / 2) * delta;
      const ny = y + (y - py) * 0.99 + (vy / 2) * delta;

      return { x: nx, y: ny, px: x, py: y };
    });
  }, [gravity]);

  return (
    <group>
      <arc color="#fff" radius={5} update={gravity} />
      {/* {Array.from(Array(4)).map((_, i) => (
      ))} */}
    </group>
  );
}
