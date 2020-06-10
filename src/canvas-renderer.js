import ReactReconciler from "react-reconciler";
import React, { useEffect, useRef, useContext, createContext } from "react";

const drawQueue = [];
const updateQueue = [];
const clickHandlerQueue = [];

const Context = createContext({});

const Obj = {
  props: null,
  type: null,
  update: null,
  transform: null,
  draw: function (ctx) {
    const primitive = primitives[this.type];

    if (this.transform) {
      ctx.save();

      Object.keys(this.transform).forEach((transform) => {
        const value = this.transform[transform];

        if (ctx[transform]) {
          if (transform === "scale") ctx[transform](value, value);
          else ctx[transform](value);
        }
      });
    }

    primitive(ctx, {
      ...this.props,
      ...(this.update ? this.update.props : {}),
    });

    if (this.transform) ctx.restore();
  },
  setPos: function setPos(x, y) {
    this.props.x = this.props.x + x;
    this.props.y = this.props.y + y;

    return this;
  },
};

const Animation = {
  props: null,
  update: null,
  start: function (update) {
    this.update = update;
    this.props.n = 100;
  },
  run: function (time) {
    this.props = this.update({ time });
  },
  mount: function () {
    updateQueue.push(this);
  },
  unmount: function () {
    updateQueue.filter((update) => update !== this);
  },
};

const Group = {
  x: 0,
  y: 0,
  transform: null,
  type: "group",
  hint: 0,
  update: null,
  pos: function pos() {
    if (this.update && this.update.props) {
      this.update.props.x && (this.x = this.update.props.x);
      this.update.props.y && (this.y = this.update.props.y);
    }

    return this;
  },
  setPos: function setPos(group) {
    this.x = this.x + group.x;
    this.y = this.y + group.y;
  },
  add: function add(child) {
    // console.log("time");
    this.followers.push(child);
  },
  attach: function (child) {
    if (child.type === "group") {
      this.setPos(child);
      return child;
    } else {
      // if (child.type === "rect" && child.props.color === "blue")
      //   console.log({ child, group: this });
      child.setPos(this.x, this.y);
      return child;
    }
  },
  draw: function (ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.hint, this.y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.hint);
    ctx.stroke();
  },
};

const primitives = {
  rect: (ctx, { x, y, width, height, color }) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    ctx.fill();
  },
  arc: (
    ctx,
    {
      x,
      y,
      radius,
      start = 0,
      end = Math.PI * 2,
      isCounterclockwise = false,
      color,
    }
  ) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, start, end, isCounterclockwise);
    ctx.fill();
  },
  polygon: (ctx, { points, color }) => {
    const array = points.split(" ").map((point) => {
      const [x, y] = point.split(",");

      return { x, y };
    });

    ctx.beginPath();

    ctx.fillStyle = color;
    ctx.moveTo(array[0].x, array[0].y);
    array.filter((_, idx) => idx !== 0).forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.closePath();

    ctx.fill();
  },
  text: (ctx, { x, y, text, size, fontFamily = "Arial", color }) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = `${size}px ${fontFamily}`;
    ctx.fillText(text, x, y);
  },
  hexagon: (ctx, { x, y, radius, color }) => {
    // console.log({ x, y });
    ctx.beginPath();
    ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));

    for (let side = 0; side < 7; side++) {
      ctx.lineTo(
        x + radius * Math.cos((side * 2 * Math.PI) / 6),
        y + radius * Math.sin((side * 2 * Math.PI) / 6)
      );
    }

    ctx.fillStyle = color;
    ctx.fill();
  },
};

const createReconciler = (ctx) => {
  const canvas2DConfigs = {
    // I know:
    now: Date.now,
    createInstance: (
      type,
      props,
      rootContainerInstance,
      _currentHostContext,
      workInProgress
    ) => {
      if (type === "group") {
        const configs = Object.keys(props).reduce(
          (sum, prop) => ({
            ...sum,
            [prop]: {
              value: props[prop],
              configurable: true,
              enumerable: true,
              writable: true,
            },
            followers: {
              value: [],
              configurable: true,
              enumerable: true,
              writable: true,
            },
          }),
          {}
        );

        const group = Object.create(Group, configs);

        return group;
      } else {
        let obj;

        switch (type) {
          case "rect":
            obj = Object.create(Obj, {
              props: {
                value: {
                  x: props.x,
                  y: props.y,
                  width: props.width,
                  height: props.height,
                  color: props.color,
                },
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          case "arc":
            obj = Object.create(Obj, {
              props: {
                value: {
                  x: props.x,
                  y: props.y,
                  radius: props.radius,
                  start: props.start,
                  end: props.end,
                  color: props.color,
                  isCounterclockwise: props.isCounterclockwise,
                },
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          case "hexagon":
            obj = Object.create(Obj, {
              props: {
                value: {
                  x: props.x,
                  y: props.y,
                  radius: props.radius,
                  color: props.color,
                },
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          default:
            return;
        }

        obj.type = type;
        obj.update = props.update;
        obj.transform = props.transform;

        return obj;
      }
    },
    prepareForCommit: (parent, child) => {
      // console.log("Update me prepareForCommit");
    },
    appendChildToContainer: (_, child) => {
      // console.log(group, child);
      drawQueue.push(child);

      // console.log("Update me appendChildToContainer");
    },
    appendInitialChild: (group, child) => {
      // console.log({ group, child });
      group.add(child);
    },
    createTextInstance: () => {
      // console.log("Update me createTextInstance");
    },

    removeChildFromContainer: () => {},
    prepareUpdate: (instance, type, oldProps, newProps) => {
      let payload;

      if (oldProps.x !== newProps.x) payload = { x: newProps.x };

      if (oldProps.color !== newProps.color) {
        payload = { color: newProps.color };
      }

      return payload;
    },
    commitUpdate: (
      instance,
      updatePayload,
      type,
      oldProps,
      newProps,
      finishWork
    ) => {
      if (updatePayload.x) {
        instance.setPos(updatePayload.x, 0);
      }
      if (updatePayload.color) {
        instance.props.color = updatePayload.color;
      }
      // console.log(instance.props, updatePayload);
    },

    // I dont know:
    getRootHostContext: (type, props, a, b, c) => {
      // console.log(type, props, a, b, c);
    },
    resetAfterCommit: () => {
      // console.log("update me resetAfterCommit");
    },
    getChildHostContext: () => {
      // console.log("update me getChildHostContext");
    },
    shouldSetTextContent: () => {
      // console.log("update me shouldSetTextContent");
    },
    finalizeInitialChildren: () => {
      // console.log("update me finalizeInitialChildren");
    },

    updateFundamentalComponent: () => {
      // console.log("update me updateFundamentalComponent");
    },
    unmountFundamentalComponent: () => {
      // console.log("update me unmountFundamentalComponent");
    },
    clearContainer: () => {
      // console.log("update me clearContainer");
    },

    supportsMutation: true,
  };

  return ReactReconciler(canvas2DConfigs);
};

let CanvasRenderer = {
  render: (element, canvas) => {
    const ctx = canvas.getContext("2d");
    const reconciler = createReconciler(ctx);

    let container = reconciler.createContainer(canvas, false, false);

    const newElement = React.createElement(
      Context.Provider,
      { value: { width: canvas.width, height: canvas.height } },
      element
    );

    reconciler.updateContainer(newElement, container, null, null);

    function looper(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // updating
      updateQueue.forEach((animation) => animation.run(time));

      // drawing
      // drawQueue.forEach((elem) => elem.draw(ctx));

      // help
      function draw(elem) {
        // console.log(elem);

        if (elem.type === "group") {
          // console.log(elem);
          if (elem.transform || elem.update) {
            ctx.save();

            const { x, y, ...transform } = elem.transform || {};
            const transforms = { translate: x && y && { x, y }, ...transform };

            let arr =
              elem.update && elem.update.props
                ? Object.keys(elem.update.props)
                : [];

            for (let i = 0; i < arr.length; i++) {
              const transos = Object.keys(transforms);
              const reso = transos.find((trans) => trans === arr[i]);

              if (!reso) transforms[arr[i]] = elem.update.props[arr[i]];
            }

            Object.keys(transforms).forEach((key) => {
              const value = transforms[key];

              // console.log(elem.update);

              if (ctx[key]) {
                if (key === "scale") {
                  let scale = 0;

                  if (elem.update && elem.update.props) {
                    elem.update.props.scale &&
                      (scale = elem.update.props.scale);
                  }

                  ctx.scale(value, value + scale);
                }
                if (key === "translate") {
                  let x = 0;
                  let y = 0;

                  if (elem.update && elem.update.props) {
                    elem.update.props.x && (x = elem.update.props.x);
                    elem.update.props.y && (y = elem.update.props.y);
                  }

                  ctx.translate(value.x + x, value.y + y);
                } else {
                  let val = 0;

                  if (elem.update && elem.update.props) {
                    elem.update.props[key] && (val = elem.update.props[key]);
                    // console.log("key", elem.update.props.rotate);
                  }

                  ctx[key](value + val);
                }
              }
            });
          }

          // draw elements
          elem.followers.forEach((child) => {
            draw(elem.attach(child));
          });

          // draw group:
          if (elem.hint) elem.draw(ctx);

          if (elem.transform) ctx.restore();
        } else elem.draw(ctx);
      }

      drawQueue.forEach((elem) => draw(elem));

      window.requestAnimationFrame(looper);
    }

    looper();

    canvas.addEventListener("click", () => {
      clickHandlerQueue.forEach((handler) => handler());
    });
  },
};

export function useUpdate(props = {}) {
  const ref = useRef();

  if (ref.current === undefined) {
    ref.current = Object.create(Animation, {
      props: { value: props, writable: true },
    });
  }

  useEffect(() => {
    ref.current.mount();
    return () => ref.current.unmount();
  }, []);

  return ref.current;
}

export function useContext2D() {
  const context = useContext(Context);

  return context;
}

// Regesters the coming handler in the handler queue [DONE]
// Prevent it from adding to the queue each time component updates []
// -Check if function already exists on the queue and swap it
// --[X] each time it updates it sends a new function.

// Each time dependencies change, swap the handlers.
export function useOnCanvasClick(handler, dependencies) {
  clickHandlerQueue.add(handler);

  // how to make it statefull
  // it should remember
}

export default CanvasRenderer;
