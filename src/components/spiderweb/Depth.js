import React from "react";
import Constraint from "./Constraint";

export default function DrawDepth({ x, y, depth, offset, angle }) {
  const current_point = {
    x: points[0].x + offset * x * Math.cos(y * angle + angle / 2),
    y: points[0].y + offset * x * Math.sin(y * angle + angle / 2),
  };
  const previous_point = x + (y - offset) * depth;

  return (
    x > 0 && (
      <Constraint
        previous_point={previous_point}
        current_point={current_point}
      />
    )
  );
}
