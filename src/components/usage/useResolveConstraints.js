import { useCallback } from "react";

import useCalcDistance from "./useCalcDistance";

export default function useResolveConstraints({ length }) {
  const calcDistance = useCalcDistance();

  return useCallback(
    (dir) => {
      return ({ x, y, p2 }) => {
        const { dist, diffX, diffY } = calcDistance({ x, y }, p2);
        const diff = (length - dist) / dist;

        const px = diffX * diff * 0.5;
        const py = diffY * diff * 0.5;

        return { x: x - px, y: y - py };
      };
    },
    [length, calcDistance]
  );
}
