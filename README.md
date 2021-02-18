# @bigfan/art

`@Bigfan/art` is a 2D drawing library leveraging the `react-reconciler` package that will help create 2D graphics using a declarative API that renders the output to the canvas. At its core `@Bigfan/art` is a React custom renderer for HTML5 Canvas.

It provides re-usable components that makes it as easy as possible to get 2D content on a webpage. These components can react to state changes and are able to animate using `@bigfan/art`'s native animation system.

## Installation

using npm: npm i @bigfan/art

using yarn: yarn add @bigfan/art

## Demos

<p align="center">
  <a href="https://codesandbox.io/s/solar-system-0pf6z"><img width="274" height="268" src="https://user-images.githubusercontent.com/10690029/108429011-baf42280-723f-11eb-8a41-56c59b637d47.gif" /></a>
  <a href="https://codesandbox.io/s/spider-web-5ioch?file=/src/index.js"><img width="274" height="268" src="https://user-images.githubusercontent.com/10690029/108428816-71a3d300-723f-11eb-919e-4b96ef153e93.gif" /></a>
  <a href="https://codesandbox.io/s/selection-hpcog?file=/src/index.js"><img width="274"  height="268" src="https://user-images.githubusercontent.com/10690029/108428511-f7734e80-723e-11eb-9ae4-c15933000895.gif" /></a>
</p>

## Why

It makes it painless to create sophisticated 2D drawings by composing small, independent, reusable components that manage their own state. And makes your code more predictable thanks to react's declarative nature and its component-based architecture.

## Usage

```jsx
export default function Rectangle() {
  const { width, height } = useArt(); // get the width & height of the canvas

  return <rect x={width / 2} y={height / 2} width={40} height={40} />;
}
```

## grouping

A group acts like a container for elements and other groups. They render nothing on their own but transfoming a group will cause anything inside it to transform as well. Each element rendered inside the group, will be positioned and oriented relative to its parent group.

```jsx
import React, { useEffect } from "react";
import { useArt, useUpdate } from "@bigfan/art";

export default function SolarSystem() {
  const { width, height } = useArt();

  return (
    <group
      x={0}
      y={0}
      transform={{ x: width / 2, y: height / 2 }}
      hint={0} // don't visualize the 2 axes
      update={controls}
    >
      <hexagon x={0} y={0} color="gold" radius={150} />
    </group>
  );
}
```

## Events

Events in `@bigfan/art` work similarly to React DOM. But it's only limited to listening for click, mouse in, mouse out and mouse move events. Plus the ability to drag and scale out of the box.

- Click Event

```jsx
export default function MyCircle() {
  const [color, setColor] = useState();

  const { width, height } = useArt(); // get the width & height of the canvas

  const onToggleColor = () => setColor(color === "grey" ? "yellow" : "grey");

  return (
    <arc
      x={width / 2}
      y={height / 2}
      radius={50}
      color={circlerColor}
      onClick={onToggleColor}
    />
  );
}
```

- Mouse in / mouse out

```jsx
export default function MyCircle() {
  const [color, setColor] = useState();

  const { width, height } = useArt(); // get the width & height of the canvas

  const onMouseIn = () => setColor("pink");
  const onMouseOut = () => setColor("yellow");

  return (
    <arc
      x={width / 2}
      y={height / 2}
      radius={50}
      color={circlerColor}
      onMouseIn={onMouseIn}
      onMouseOut={onMouseOut}
    />
  );
}
```

- mouse move

```jsx
export default function MyCircle() {
  const [cords, setCords] = useState({ x: 0, y: 0 });

  const { width, height } = useArt();

  const onMouseMove = ({ x, y }) => {
    setCords({
      x: Math.abs(width / 2 - 50 - x) / 100,
      y: Math.abs(height / 2 - 50 - y) / 100,
    });
  };

  return (
    <arc
      x={width / 2}
      y={height / 2}
      radius={50}
      color={`hsl(${cords.x * 360}, ${cords.y * 100}%, 60%)`}
      onMouseMove={onMouseMove}
    />
  );
}
```

- Drag and drop

```jsx
export default function MyCircle() {
  const [color, setColor] = useState();

  const { width, height } = useArt(); // get the width & height of the canvas
  return (
    <arc x={width / 2} y={height / 2} radius={50} color={circlerColor} drag />
  );
}
```

- select and scale

```jsx
export default function MyCircle() {
  const [color, setColor] = useState();

  const { width, height } = useArt(); // get the width & height of the canvas
  return (
    <arc x={width / 2} y={height / 2} radius={50} color={circlerColor} select />
  );
}
```

## Host elements: (or platform-specific components)

- rect
- arc
- line
- polygon
- text
- img
- hexagon

## API

### useEvent

`useEvent` is built-in custom hook returns an instance of Event class

```jsx
export default function Bigfan() {
  const event = useEvent("mousemove");
  const controls = useUpdate(null, { loop: true, event });

  useEffect(() => {
    controls.start(({ props: { x, y, px, py }, event }) => {
      console.log({ event }); // { x, y } of mouse move event
    });
  }, []);

  return <line />;
}
```

### useUpdate

The `useUpdate` hook can be used to imperatively control animations. The update is started as soon as you call the start method. the start method accpets a function which when called will be passed a time argument that represents the high-resolution timestamp that indicates the current time. `useUpdate` will return an instance that must be passed to the `update` prop of the element that you want to update.

`useUpdate` recieve the following configs:

#### offsets

Setting this to true will animate the manual offests of a given element. and when set to false it will animate transfoms.

#### count

Count can be helpful when you want to create a number of updates using a single `useUpdate` hook, and let each one of these updates to start after the other in a sequence. Count can either be passed a number or an array.

- When passed a number, it will generate a number of animation instances which can be controlled in the start method callback function.

  ```jsx
    export default function Bigfan() {
      const controls = useUpdate((n) => ({ x: 0 + n, y: 0 }), { count: 10 });

      useEffect(() => {
        controls.start(({ time, props, attached }) => {

          // 10 update instances:
          attached.map(({ x, y }) => { return { x: x * time } })
        });
      }, []);

      return controls.map(({ x, y } index) => <rect key={index} x={x} y={y} />);
    }
  ```

- Similarly when we pass an array, it also generates a number of instances but this way is helpfull when you want to have a list of unrelated default props.

  ```jsx
  export default function Bigfan() {
  const controls = useUpdate(
    ({ x, y }) => ({ x, y }),
    { count: [{ x: 10, y: 10 }, { x: 350, y: 0 }] }
  );

  useEffect(() => {
    controls.start(({ time, props, event, attached }) => {
      // our two update instances:
      attached.map(({ x, y }) => { return { x: x * time } })
    });
  }, []);

  return controls.map(({ x, y } index) => <line key={index} />);
  }
  ```

#### loop

when you pass a count prop, an attached prop will be passed to the start method and you have to take care of it all. But when set loop to true the start function will automalitacly loop over your attached instances providing you with an extra index prop.

```jsx
export default function Bigfan() {
  const controls = useUpdate((n) => ({ x: n * 10 }), { count: 10, loop: true });

  useEffect(() => {
    controls.start(({ time, index, props, event, attached }) => {
      return { x: 1 + time * index }
    });
  }, []);

  return controls.map(({ x, y } index) => <rect key={index} x={x} y={y} />);
}
```

#### attaching updates

Each update instance could have a list of other attached instances and the attach method allows you to attach one of more instances to an instance.

### useArt

This hook allows you to access the canvas width and height as well as the current canvas context.
