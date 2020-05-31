import React from "react";

import Point from "./Point";
import Constraint from "./Constraint";
import Depth from "./Depth";
import LastPie from "./LastPie";

export default function Web({ radius, resolution, depth, offset }) {
  const angle = Math.PI / 4;
  const createPoint = ({ x, y, radius, width, height }) => ({
    x: width / 2 + x * radius * Math.cos(y * angle),
    y: height / 2 + x * radius * Math.sin(y * angle),
  });

  return (
    <group>
      {Array.from(Array(resolution)).map((y) =>
        Array.from(Array(depth)).map((x) => {
          const key = x + depth * y;
          const current_point = createPoint({
            x,
            y,
            radius,
            width: 100,
            height: 100,
          });
          const previous_point = createPoint({
            x: key * (1 % x) || 0,
            y: key * (1 % y) || 0,
            radius,
            width: 100,
            height: 100,
          });

          return (
            <group key={key}>
              <Point point={current_point} pin={x > depth} />
              {x > 0 && (
                <Constraint current={current_point} previous={previous_point} />
              )}
              {y > 0 && x < depth && (
                <Depth
                  x={x}
                  y={y}
                  depth={depth}
                  offset={offset}
                  angle={angle}
                />
              )}
              {y >= resolution && x < depth && (
                <LastPie
                  x={x}
                  y={y}
                  depth={depth}
                  offset={offset}
                  angle={angle}
                />
              )}
            </group>
          );
        })
      )}
    </group>
  );
}
