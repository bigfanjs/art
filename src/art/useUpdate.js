import { useRef, useEffect } from "react";

import Anime from "./Anime";

export default function useUpdate(props = {}, configs = {}) {
  const ref = useRef();

  if (ref.current === undefined) {
    ref.current = Object.create(Anime, {
      props: { value: props, writable: true },
      configs: { value: configs },
    });
  }

  useEffect(() => {
    ref.current.mount();
    return () => ref.current.unmount();
  }, []);

  return ref.current;
}
