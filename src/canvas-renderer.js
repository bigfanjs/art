import ReactReconciler from "react-reconciler";
import { useEffect, useRef } from "react";

const drawQueue = [];
const updateQueue = [];
const clickHandlerQueue = [];

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
    this.props.x = x;
    this.props.y = y;
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

const primitives = {
  group: () => {},
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
    array.filter((_, idx) => idx != 0).forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.closePath();

    ctx.fill();
  },
  text: (ctx, { x, y, text, size, fontFamily = "Arial", color }) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = `${size}px ${fontFamily}`;
    ctx.fillText(text, x, y);
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
      const obj = Object.create(Obj, {
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

      obj.type = type;
      obj.update = props.update;
      obj.transform = props.transform;

      if (type) drawQueue.push(obj);

      return obj;
    },
    prepareForCommit: () => {
      // console.log("Update me prepareForCommit");
    },
    appendChildToContainer: () => {
      // console.log("Update me appendChildToContainer");
    },
    appendInitialChild: () => {
      // console.log("Update me appendInitialChild");
    },
    createTextInstance: () => {
      // console.log("Update me createTextInstance");
    },

    removeChildFromContainer: () => {},
    prepareUpdate: (instance, type, oldProps, newProps) => {
      let payload;

      if (oldProps.x !== newProps.x) {
        payload = { x: newProps.x };
      }

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

    reconciler.updateContainer(element, container, null, null);

    function looper(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // updating
      updateQueue.forEach((animation) => animation.run(time));

      // drawing
      drawQueue.forEach((elem) => elem.draw(ctx));

      window.requestAnimationFrame(looper);
    }

    looper();

    canvas.addEventListener("click", () => {
      clickHandlerQueue.forEach((handler) => handler());
    });
  },
};

// export function useUpdate() {
//   const start = useCallback((update) => {
//     updateQueue.push(update);
//   }, []);

//   return { start };
// }

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
