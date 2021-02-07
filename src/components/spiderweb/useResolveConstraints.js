import { useCallback } from "react";

import useCalcDistance from "./useCalcDistance";

export default function useResolveConstraints() {
  const calcDistance = useCalcDistance();

  return useCallback(
    ({ length, attached }) => ({ props, event }) => {
      const { x, y, px, py, pinx, piny } = props;
      const mouse = calcDistance(event, { x, y });
      const { dist, diffX, diffY } = calcDistance({ x, y }, attached.get());
      const diff = (length - dist) / Math.max(dist, 0.001);

      if (mouse.dist < 20) return { px, py, x: event.x, y: event.y };
      if (pinx && piny) return { x: pinx, y: piny, px: x, py: y, pinx, piny };

      const dx = diffX * diff * 0.1;
      const dy = diffY * diff * 0.1;

      return { x: x + dx, y: y + dy };
    },
    [calcDistance]
  );
}
