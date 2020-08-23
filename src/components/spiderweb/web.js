import React, { useEffect } from "react";

import useCreateSpiderWeb from "./useCreateSpiderWeb";
import Constraint from "./Constraint";
import useCalcDistance from "./useCalcDistance";
import useEvent from "../../art/useEvent";
import useArt from "../../art/useArt";

export default function Web({ resolution, depth }) {
  const { canvas } = useArt();
  const mouse = useEvent({ x: 0, y: 0, px: 0, py: 0 });
  const points = useCreateSpiderWeb({ depth, resolution, event: mouse });
  const calcDistance = useCalcDistance({ depth, resolution });

  useEffect(() => {
    mouse.start("mousemove", ({ event }) => {
      const rect = canvas.getBoundingClientRect();

      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    });

    points.start(({ props: { x, y, px, py } }) => {
      const delta = 1 / 60;

      const nx = x + (x - px) + 0 * delta;
      const ny = y + (y - py) + 8.9 * delta;

      return { x: nx, y: ny, px: x, py: y };
    });
  }, [points, calcDistance, canvas, mouse]);

  return (
    <group>
      {points.map((point) =>
        point.map((p2, j) => <Constraint key={j} p1={point} p2={p2} />)
      )}
    </group>
  );
}
