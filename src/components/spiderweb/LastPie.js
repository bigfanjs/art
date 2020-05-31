import React from "react";
import Constraint from "./Constraint";

export default function DrawLastPiece({ x, y, depth, offset, angle }) {
  const current_point = {
    x: points[0].x + offset * x * Math.cos(y * angle - angle / 2),
    y: points[0].y + offset * x * Math.sin(y * angle - angle / 2),
  };
  const previous_point = points[x + (y - 1) * depth];

  return (
    x > 0 && (
      <Constraint
        current_point={current_point}
        previous_point={previous_point}
      />
    )
  );
}
