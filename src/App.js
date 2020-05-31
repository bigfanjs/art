import React, { useEffect } from "react";
import { useUpdate } from "./canvas-renderer";

function App() {
  const controls = useUpdate({ x: 10 });

  useEffect(() => {
    controls.start(({ time }) => {
      return { x: time * 0.01 };
    });
  }, [controls]);

  return (
    <>
      <rect
        x={10}
        y={10}
        width={100}
        height={100}
        color="red"
        update={controls}
        transform={{ rotate: Math.PI * 0.1 }}
      />
      <rect x={40} y={120} width={100} height={100} color="green" />
    </>
  );
}

export default App;
