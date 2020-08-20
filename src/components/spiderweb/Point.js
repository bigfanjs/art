import React from "react";

export default function Point({ x = 0, y = 0, delta, radius, res }) {
  const [position, setPosition] = useState({ x, y });
  const [previous, setPrevious] = useState({ x, y });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const addForce = useAddForce(velocity, setVelocity);
  const calcDistance = useCalcDistance();

  useUpdate(() => {
    const dist = calcDistance(mouse, position);

    if (Mouse.button == 1 && dist < 20) setPosition(Mouse);

    addForce(0, Settings.gravity);

    // save previous position
    setPrevious(position);

    // update position
    setPosition(
      position.x +
        (position.x - previous.x) * 0.99 +
        (velocity.x / 2) * (delta * delta),
      position.y +
        (position.y - previous.x) * 0.99 +
        (velocity.y / 2) * (delta * delta)
    );

    // reset velocity
    setVelocity({ x: 0, y: 0 });
  });

  return <arc x={x} y={y} radius={radius} />;
}
