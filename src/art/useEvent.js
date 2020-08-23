import Event from "./Event";
import { useEffect, useRef } from "react";
import useArt from "./useArt";

export default function useEvent(defaults) {
  const ref = useRef();
  const { canvas } = useArt();

  if (ref.current === undefined) {
    ref.current = new Event(defaults, canvas);
  }

  useEffect(() => {
    ref.current.mount(canvas);
    return () => ref.current.unmount(canvas);
  }, [canvas]);

  return ref.current;
}
