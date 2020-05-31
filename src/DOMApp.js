import React, { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";

function App() {
  const [toggle, setToggle] = useState(true);
  const [props, set] = useSpring(() => ({
    opacity: 1,
    width: 100,
    height: 100,
    backgroundColor: "green",
  }));
  const handleClick = () => setToggle(!toggle);

  useEffect(() => {
    set({ opacity: toggle ? 1 : 0 });
  }, [set, toggle]);

  console.log({ props });

  return (
    <animated.div style={props} id="x" className="dd" onClick={handleClick} />
  );
}

export default App;
