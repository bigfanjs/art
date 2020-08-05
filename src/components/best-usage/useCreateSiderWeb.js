import { useMemo } from "react";

import useUpdate from "../../art/useUpdate";
import useArt from "../../art/useArt";

export default function useCreateSpiderWeb({ depth, resolution, event }) {
  const { width, height } = useArt();
  const controls = useUpdate(null, { offsets: true, loop: true });

  return useMemo(() => {
    const spacing = 20;
    const angle = (Math.PI * 2) / (resolution + 1);

    for (let i = 0; i <= resolution; i++) {
      for (let j = 1 % (i + 1); j <= depth; j++) {
        const x = width / 2 + j * spacing * Math.cos(i * angle);
        const y = height / 2 + j * spacing * Math.sin(i * angle);

        // pin points
        const pin = j >= depth ? { pinx: x, piny: y } : {};

        // create a new instance
        const anime = controls.create({ x, y, px: x, py: y, ...pin }, event);
        const attached = controls.attached;

        if (j > 0) anime.attach(attached[(attached.length - 1) * (1 % j)]);
        if (i > 0 && j < depth) anime.attach(attached[j + (i - 1) * depth]);
        if (i >= resolution && j < depth)
          anime.attach(attached[j + (i - resolution) * depth]);

        controls.attach(anime);
      }
    }

    return controls;
  }, [height, width, depth, resolution, controls, event]);
}
