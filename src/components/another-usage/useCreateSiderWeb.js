import { useMemo } from "react";

import useUpdate from "../../art/useUpdate";
import useArt from "../../art/useArt";

export default function useCreateConstraints({ depth, resolution }) {
  const { width, height } = useArt();
  const controls = useUpdate(null, { offsets: true, loop: true });

  return useMemo(() => {
    const spacing = 20;
    const angle = (Math.PI * 2) / (resolution + 1);
    const constraints = [];

    for (let i = 0; i <= resolution; i++) {
      for (let j = 1 % (i + 1); j <= depth; j++) {
        const x = width / 2 + j * spacing * Math.cos(i * angle);
        const y = height / 2 + j * spacing * Math.sin(i * angle);

        const pin = j >= depth ? { pinx: x, piny: y } : {};

        const anime = controls.create({ x, y, px: x, py: y, ...pin });
        const attached = controls.attached;

        if (j > 0)
          constraints.push([anime, attached[(attached.length - 1) * (1 % j)]]);
        if (i > 0 && j < depth)
          constraints.push([anime, attached[j + (i - 1) * depth]]);
        if (i >= resolution && j < depth)
          constraints.push([anime, attached[j + (i - resolution) * depth]]);

        controls.attach(anime);
      }
    }

    return [controls, constraints];
  }, [height, width, depth, resolution, controls]);
}
