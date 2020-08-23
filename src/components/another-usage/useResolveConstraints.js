import { useCallback } from "react";

import useCalcDistance from "./useCalcDistance";

export default function useResolveConstraints() {
  const calcDistance = useCalcDistance();

  return useCallback(
    (dir, length) => ({ props: { x, y, px, py, pinx, piny }, attached }) => {
      const { dist, diffX, diffY } = calcDistance({ x, y }, attached[0]);
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

      const dx = diffX * diff * 0.05;
      const dy = diffY * diff * 0.05;

      return {
        x: x + dx * dir,
        y: y + dy * dir,
        px: px,
        py: py,
      };
    },
    [calcDistance]
  );
}
