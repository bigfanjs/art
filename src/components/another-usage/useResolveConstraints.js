import { useCallback } from "react";

import useCalcDistance from "./useCalcDistance";

export default function useResolveConstraints() {
  const calcDistance = useCalcDistance();

  return useCallback(
    (dir, length) => ({ props: { x, y, pinx, piny }, attached }) => {
      const { dist, diffX, diffY } = calcDistance({ x, y }, attached[0]);
      const diff = (length - dist) / dist;

      //   const px = diffX * diff * 0.5;
      //   const py = diffY * diff * 0.5;

      return { x, y };
      //   return { x: x - px, y: y - py };
    },
    [calcDistance]
  );
}
