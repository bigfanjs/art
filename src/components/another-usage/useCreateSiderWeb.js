import { useMemo } from "react";

import useUpdate from "../../art/useUpdate";
import useArt from "../../art/useArt";

export default function useCreateConstraints({ depth, resolution }) {
  const { width, height } = useArt();
  const controls = useUpdate(null, { loop: true });

  return useMemo(() => {
    const spacing = 20;
    const angle = (Math.PI * 2) / resolution;

    for (let i = 0; i < resolution; i++) {
      for (let j = 1 % (i + 1); j < depth; j++) {
        const x = width / 2 + j * spacing * Math.cos(i * angle);
        const y = height / 2 + j * spacing * Math.sin(i * angle);

        const anime = controls.create({ x, y, px: x, py: y });
        const attached = anime.attached;

        if (j > 0) anime.attach(attached[(attached.length - 1) * (1 % x)]);
        if (i > 0 && x < depth) anime.attach(attached[x + (y - 1) * depth]);
        if (i >= resolution && j < depth)
          anime.attach(attached[x + (y - resolution) * depth]);
      }
    }

    return controls;
  }, [height, width, depth, resolution, controls]);
}
