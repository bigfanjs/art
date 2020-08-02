import { useCallback } from "react";

import useCalcDistance from "./useCalcDistance";

export default function useResolveConstraints() {
  const calcDistance = useCalcDistance();

  return useCallback(
    ({ length, attached }) => ({ props: { x, y, px, py, pinx, piny } }) => {
      const { dist, diffX, diffY } = calcDistance({ x, y }, attached.get());
      const diff = (length - dist) / dist;

      if (pinx && piny)
        return {
          x: pinx,
          y: piny,
          px: x,
          py: y,
          pinx,
          piny,
        };

      const dx = diffX * diff * 0.5;
      const dy = diffY * diff * 0.5;

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
