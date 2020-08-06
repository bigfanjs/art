import { useCallback } from "react";

import useCalcDistance from "./useCalcDistance";

export default function useResolveConstraints() {
  const calcDistance = useCalcDistance();

  return useCallback(
    ({ length, attached }) => ({
      props: { x, y, px, py, pinx, piny },
      event,
    }) => {
      const { dist: disto } = calcDistance(event, { x, y });
      const { dist, diffX, diffY } = calcDistance({ x, y }, attached.get());
      const diff = (length - dist) / Math.max(dist, 0.001);

      if (disto < 10) return { px, py, x: event.x, y: event.y };
      if (pinx && piny) return { x: pinx, y: piny, px: x, py: y, pinx, piny };

      const dx = diffX * diff * 0.1;
      const dy = diffY * diff * 0.1;

      return {
        x: x + dx,
        y: y + dy,
        px: px,
        py: py,
      };
    },
    [calcDistance]
  );
}
