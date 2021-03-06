import { useRef, useEffect } from "react";

import Anime from "./Anime";

export default function useUpdate(
  props,
  configs = { offsets: false, count: undefined, event: null }
) {
  const ref = useRef();

  if (ref.current === undefined) {
    if (configs.count && !Array.isArray(configs.count)) {
      ref.current = Object.create(Anime, {
        attached: {
          value: Array.from(Array(configs.count)).map((_, n) => {
            const defaultProps = typeof props === "function" ? props(n) : props;

            return Object.create(Anime, {
              default: { value: defaultProps, writable: true },
              offsets: { value: configs.offsets },
              attached: {
                value: [],
                configurable: true,
                enumerable: true,
                writable: true,
              },
              updates: {
                value: [],
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
          }),
        },
        loop: { value: configs.loop },
        updates: {
          value: [],
          configurable: true,
          enumerable: true,
          writable: true,
        },
        event: {
          value: configs.event,
          configurable: true,
          enumerable: true,
          writable: true,
        },
      });
    } else if (Array.isArray(configs.count)) {
      const elements = props(...configs.count);

      ref.current = Object.create(Anime, {
        attached: {
          value: elements.map((elem) => {
            return Object.create(Anime, {
              default: { value: elem, writable: true },
              offsets: { value: configs.offsets },
              attached: {
                value: [],
                configurable: true,
                enumerable: true,
                writable: true,
              },
              updates: {
                value: [],
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
          }),
        },
        loop: { value: configs.loop },
        updates: {
          value: [],
          configurable: true,
          enumerable: true,
          writable: true,
        },
        event: {
          value: configs.event,
          configurable: true,
          enumerable: true,
          writable: true,
        },
      });
    } else {
      const defaults = props && !Anime.isPrototypeOf(props) ? props : undefined;
      let attached = [];

      if (props && Anime.isPrototypeOf(props)) attached = [props];
      else if (props && Array.isArray(props)) attached = props;

      ref.current = Object.create(Anime, {
        default: { value: defaults, writable: true },
        offsets: { value: configs.offsets },
        loop: { value: configs.loop },
        attached: {
          value: attached,
          configurable: true,
          enumerable: true,
          writable: true,
        },
        updates: {
          value: [],
          configurable: true,
          enumerable: true,
          writable: true,
        },
        event: {
          value: configs.event,
          configurable: true,
          enumerable: true,
          writable: true,
        },
      });
    }
  }

  useEffect(() => {
    ref.current.mount();
    return () => ref.current.unmount();
  }, []);

  return ref.current;
}
