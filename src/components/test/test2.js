import React, { useEffect, useCallback } from "react";

import useUpdate from "../../art/useUpdate";
import useArt from "../../art/useArt";

export default function Web({ radius, resolution, depth, curve }) {
  const { width, height } = useArt();
  const drawSpiderWeb = useCallback((dep, reso) => {
    const points = [];

    for (let i = 0; i < reso; i++) {
      for (let j = 1 % (i + 1); j < dep; j++) {
        const x = width / 2 + j * spacing * Math.cos(i * angle);
        const y = height / 2 + j * spacing * Math.sin(i * angle);

        points.push({ x, y, px: x, py: y });
      }
    }

    return points;
  }, []);
  const gravity = useUpdate(drawSpiderWeb, {
    offsets: true,
    count: [depth, resolution],
  });

  useEffect(() => {
    gravity.start(({ props: { x, y, px, py } }) => {
      const delta = 1 / 60;

      const nx = x + (x - px) + 0 * delta;
      const ny = y + (y - py) + 8.9 * delta;

      return { x: nx, y: ny, px: x, py: y };
    });
  }, [gravity]);

  const totalLength = resolution * depth + 1;
  const spacing = 20;
  const angle = (Math.PI * 2) / resolution;

  console.log({ totalLength });

  return (
    <group>
      {/* {gravity.elements.map((control, index) => (
        <arc key={index} color="#fff" radius={5} update={control} />
        // <Constraint key={index} p1={elem} p2={elem} />
      ))} */}
      {Array.from(Array(totalLength)).map((_, i) => {
        // const alpha = Math.floor(i / depth);
        const a = depth % (i + 1);
        const b = 1 - Math.floor(a / depth);
        const alpha = Math.floor(Math.max(i - 1, 0) / (depth + b));

        const beta = 1 % (alpha + 1);
        // const gamma = (i % (depth - b)) + beta;
        const gamma = ((i + b) % (depth + b)) + beta;

        // console.log({ i, alpha, gamma, b });
        console.log(drawSpiderWeb(depth, resolution));

        return (
          <arc
            key={i}
            x={width / 2 + gamma * Math.cos(alpha * angle) * spacing}
            y={height / 2 + gamma * Math.sin(alpha * angle) * spacing}
            color="#fff"
            radius={6}
          />
        );
      })}
    </group>
  );
}
