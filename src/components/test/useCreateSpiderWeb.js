import { useCallback } from "react";

import useArt from "../../art/useArt";

export default function useCreateSpiderWeb({ depth, resolution }) {
  const { width, height } = useArt();

  return useCallback(() => {
    const spacing = 20;
    const angle = (Math.PI * 2) / resolution;
    const points = [];

    for (let i = 0; i < resolution; i++) {
      for (let j = 1 % (i + 1); j < depth; j++) {
        const x = width / 2 + j * spacing * Math.cos(i * angle);
        const y = height / 2 + j * spacing * Math.sin(i * angle);

        points.push({ x, y, px: x, py: y });
      }
    }

    return points;
  }, [height, width, depth, resolution]);
}
