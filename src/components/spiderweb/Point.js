import React, { useEffect } from "react";

import useUpdate from "./art/useUpdate";
import useArt from "./art/useArt";

export default function Point({ x = 0, y = 0, delta, radius, res }) {
  const controls = useUpdate({ x, y });
  const addForce = useAddForce(velocity, setVelocity);
  const calcDistance = useCalcDistance();

  useEffect(() => {
    controls.start(({ time }) => {
      const dist = calcDistance(mouse, {});

      this.addForce(0, Settings.gravity);

      delta *= delta;

      nx = this.x + (this.x - this.px) * 0.99 + (this.vx / 2) * delta;
      ny = this.y + (this.y - this.py) * 0.99 + (this.vy / 2) * delta;

      this.px = this.x;
      this.py = this.y;

      this.x = nx;
      this.y = ny;

      this.vy = this.vx = 0;
    });
  }, [controls]);

  useUpdate(() => {
    const dist = calcDistance(mouse, position);

    if (Mouse.button == 1 && dist < 20) setPosition(Mouse);

    addForce(0, Settings.gravity);

    // save previous position
    setPrevious(position);

    // update position
    setPosition(
      position.x +
        (position.x - previous.x) * 0.99 +
        (velocity.x / 2) * (delta * delta),
      position.y +
        (position.y - previous.x) * 0.99 +
        (velocity.y / 2) * (delta * delta)
    );

    // reset velocity
    setVelocity({ x: 0, y: 0 });
  });

  return <arc x={x} y={y} radius={radius} />;
}
