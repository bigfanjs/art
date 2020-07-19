import React, { useEffect } from "react";

import useElement from "./art/useElement";
import useUpdate from "./art/useUpdate";

import Constraint from "./Constraint";

const points = [];

export default function Web() {
  const createElement = useElement();
  const controls = useUpdate({ count: 10 });

  useEffect(() => {
    Array.from(Array(10)).forEach((_, idx) => {
      const element = createElement({ x: 0, y: 9, update: controls[idx] });

      points.push(element);
    });
  }, [createElement, controls]);

  useEffect(() => {
    controls.start(({ time }) => {
      return points.map((point) => {
        const XX = true;

        return { x: 0, y: 0 };
      });
    });
  });

  return (
    <group>
      {points.map((point) => (
        <Constraint p1={point} p2={point} />
      ))}
    </group>
  );
}
