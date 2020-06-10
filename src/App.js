import React, { useEffect } from "react";
import { useUpdate, useContext2D } from "./canvas-renderer";

function App() {
  const props = useContext2D();
  const controls = useUpdate({ x: 10 });
  const controls2 = useUpdate({ rotate: 0 });

  console.log(props);

  useEffect(() => {
    controls.start(({ time }) => {
      return { x: time * 0.01 };
    });
  }, [controls]);

  useEffect(() => {
    controls2.start(({ time }) => {
      return { rotate: Math.PI * 0.001 * time };
    });
  }, [controls2]);

  return (
    <>
      <group
        x={0}
        y={0}
        transform={{ x: 200, y: 200 }}
        hint={100}
        update={controls2}
      >
        <rect
          x={10}
          y={10}
          width={100}
          height={100}
          color="red"
          transform={{ rotate: Math.PI * 0.1, scale: 1.5 }}
        />
        <rect
          x={40}
          y={120}
          width={100}
          height={100}
          color="lightGray"
          transform={{ rotate: -Math.PI * 0.1, scale: 0.5 }}
        />
      </group>
      <group
        x={0}
        y={0}
        transform={{ x: 500, y: 200, rotate: -Math.PI * 0.1 }}
        hint={100}
        update={controls}
      >
        <group x={0} y={0} transform={{ x: 100, y: 100 }} hint={100}>
          <arc x={20} y={20} radius={20} color="purple" />
        </group>
        <rect
          x={0}
          y={0}
          width={100}
          height={100}
          color="blue"
          // update={controls}
          transform={{ rotate: Math.PI * 0.5, scale: 0.3 }}
        />
        <rect
          x={40}
          y={0}
          width={100}
          height={100}
          color="pink"
          transform={{ rotate: -Math.PI * 0.1, scale: 0.5 }}
        />
      </group>
    </>
  );
}

export default App;
