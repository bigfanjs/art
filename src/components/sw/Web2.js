import React, { useEffect } from "react";

import useElement from "./art/useElement";
import useUpdate from "./art/useUpdate";

import Constraint from "./Constraint";

const points = [];

export default function Web() {
  const createElement = useElement({ update: true });

  useEffect(() => {
    Array.from(Array(10)).forEach((_, idx) => {
      const { element, controls } = createElement({ x: 0, y: 9 });

      controls.start(({ time }) => {
        const XX = true;

        return { x: 0, y: 0 };
      });

      points.push(element);
    });
  }, [createElement]);

  return (
    <group>
      {points.map((point) => (
        <Constraint p1={point} p2={point} />
      ))}
    </group>
  );
}
