import { useCallback } from "react";

export default function useCalcDistance(length) {
  return useCallback((p1, p2) => {
    const diffX = p1.x - p2.x;
    const diffY = p1.y - p2.y;
    const dist = Math.sqrt(diffX * diffX + diffY * diffY);
    const diff = (length - dist) / dist;

    return { dist: diff, diffX, diffY };
  }, []);
}
