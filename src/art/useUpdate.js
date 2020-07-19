import { useRef, useEffect } from "react";

import Anime from "./Anime";

/*
 * Creates an Anime instance for me.
 * Checks if the coming props is either an instance or bare object.
 * If configured as offsets, animate x and y and if not animate transforms.
 * If configured with count, we create the count number of animes.
 * Shoud I always return an anime instance even when using count?
 */

export default function useUpdate(
  props,
  configs = { offsets: false, count: undefined }
) {
  const ref = useRef();

  if (ref.current === undefined) {
    if (configs.count && !Array.isArray(configs.count)) {
      ref.current = Object.create(Anime, {
        elements: {
          value: Array.from(Array(configs.count)).map((_, n) => {
            const defaultProps = typeof props === "function" ? props(n) : props;

            return Object.create(Anime, {
              default: { value: defaultProps, writable: true },
              offsets: { value: configs.offsets },
            });
          }),
        },
      });
    } else if (Array.isArray(configs.count)) {
      const elements = props(...configs.count);

      ref.current = Object.create(Anime, {
        elements: {
          value: elements.map((elem) => {
            return Object.create(Anime, {
              default: { value: elem, writable: true },
              offsets: { value: configs.offsets },
            });
          }),
        },
      });
    } else {
      ref.current = Object.create(Anime, {
        default: { value: props, writable: true },
        offsets: { value: configs.offsets },
      });
    }
  }

  useEffect(() => {
    ref.current.mount();
    return () => ref.current.unmount();
  }, []);

  return ref.current;
}
