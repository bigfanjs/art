import { useEffect, useRef } from "react";

import Event from "./Event-mixed";

export default function useEvent(name) {
  const ref = useRef();

  if (ref.current === undefined) ref.current = new Event(name);
  const eventHandler = (mouse) => (ref.current.props = mouse);

  useEffect(() => {
    ref.current.schedule(name, eventHandler);
    return () => ref.current.remove();
  }, [name]);

  return ref.current;
}
