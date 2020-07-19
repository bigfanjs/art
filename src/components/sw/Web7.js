import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useAddForce from "./art/useAddForce";
import Constraint from "./Constraint";

const Settings = { gravity: 0 };

/*
    delta *= delta;

    var x = this.pos.x,
        y = this.pos.y;

    this.acc.mul(delta);

    this.pos.x += x - this.pre.x + this.acc.x;
    this.pos.y += y - this.pre.y + this.acc.y;

    this.acc.reset();

    this.pre.x = x;
    this.pre.y = y;
*/

/*
Questions:

1- Should I save the points in Anime class?
2- Do I have to always set props by returning? Why?
3-
4-
5-

*/

export default function Web({ depth }) {
  // provides animes and updates
  const controls = useUpdate();

  useEffect(() => {
    controls.start(({ delta, props: { x, y, px, py } }) => {
      // here we update things

      delta *= delta;

      var nx = x,
        ny = y;

      this.acc.mul(delta);

      x += nx - this.pre.x + this.acc.x;
      y += ny - this.pre.y + this.acc.y;

      this.acc.reset();

      this.pre.x = x;
      this.pre.y = y;
    });
  }, []);

  return (
    <group>
      {/* {arr.map((constraint, index) => (
        <Constraint key={index} constraint={constraint} />
      ))} */}
    </group>
  );
}
