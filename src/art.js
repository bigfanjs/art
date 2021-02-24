import React, { createContext } from "react";
import ReactReconciler from "react-reconciler";

import Group from "./group";
import Element from "./element";
import Event from "./Event";

const rootHostContext = {};
const childHostContext = {};

let globalIndex = 0;

const DPI = window.devicePixelRatio;

const drawQueue = [];
export const updateQueue = [];
export const eventQueue = [];

export const Context = createContext({});

const createReconciler = (canvas, ctx) => {
  const canvas2DConfigs = {
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
        let element;

        switch (type) {
          case "rect":
            element = Object.create(Element, {
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
              isPath: {
                value: true,
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          case "arc":
            element = Object.create(Element, {
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
              isPath: {
                value: true,
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          case "hexagon":
            element = Object.create(Element, {
              props: {
                value: {
                  x: props.x,
                  y: props.y,
                  radius: props.radius,
                  color: props.color,
                  stroke: props.stroke,
                },
                configurable: true,
                enumerable: true,
                writable: true,
              },
              isPath: {
                value: true,
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          case "line":
            element = Object.create(Element, {
              props: {
                value: {
                  x1: props.x1,
                  y1: props.y1,
                  x2: props.x2,
                  y2: props.y2,
                  color: props.color,
                  strokeWidth: props.strokeWidth || 1,
                  stroke: true,
                },
                configurable: true,
                enumerable: true,
                writable: true,
              },
              isPath: {
                value: true,
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          case "polygon":
            element = Object.create(Element, {
              props: {
                value: {
                  points: props.points,
                  color: props.color,
                  stroke: props.stroke,
                },
                configurable: true,
                enumerable: true,
                writable: true,
              },
              isPath: {
                value: true,
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          case "text":
            element = Object.create(Element, {
              props: {
                value: {
                  x: props.x,
                  y: props.y,
                  text: props.text,
                  size: props.size,
                  fontFamily: props.fontFamily || "arial",
                  color: props.color,
                  baseLine: props.baseLine || "middle",
                  textAlign: props.textAlign || "right",
                },
                configurable: true,
                enumerable: true,
                writable: true,
              },
              isPath: {
                value: false,
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });
            break;
          case "img":
            const image = new Image();

            image.src = props.src;

            element = Object.create(Element, {
              props: {
                value: {
                  src: props.src,
                  x: props.x,
                  y: props.y,
                  width: props.width,
                  height: props.height,
                  sx: props.sx,
                  sy: props.sy,
                  sw: props.sw,
                  sh: props.sh,
                },
                configurable: true,
                enumerable: true,
                writable: true,
              },
              isPath: {
                value: false,
                configurable: true,
                enumerable: true,
                writable: true,
              },
              image: {
                value: image,
                configurable: true,
                enumerable: true,
                writable: true,
              },
              isLoaded: {
                value: false,
                configurable: true,
                enumerable: true,
                writable: true,
              },
            });

            image.onload = function () {
              element.isLoaded = true;
            };
            break;
          default:
            return;
        }

        globalIndex = globalIndex + 1;
        element.zIndex = globalIndex;

        element.type = type;
        element.update = props.update;
        element.transform = props.transform;

        let event = null;

        if (type === "polygon") element.setPlygonOffsets();
        if (type === "line") element.setLineOffsets();

        if (
          props.onClick ||
          props.onMouseMove ||
          props.onMouseIn ||
          props.onMouseOut ||
          props.onMouseUp ||
          props.onMouseDown ||
          props.drag ||
          props.select
        ) {
          event = new Event({ selected: props.select, element });

          event.type = type;
          event.index = globalIndex;
          element.event = event;
        }

        if (event) {
          props.onClick && event.schedule("click", props.onClick);
          props.onMouseMove && event.schedule("mousemove", props.onMouseMove);
          props.onMouseDown && event.schedule("mousedown", props.onMouseDown);
          props.onMouseIn && event.schedule("mousein", props.onMouseIn);
          props.onMouseOut && event.schedule("mouseout", props.onMouseOut);

          props.drag && event.startDrag(element);

          if (props.select) {
            event.startDraggingAnchors(element);
            event.selectable = true;
            element.clearOffset(type);
            element.select = true;
          } else {
            event.selectable = false;
          }
        }

        return element;
      }
    },
    prepareForCommit: (parent, child) => {
      console.log("prepareForCommit", { parent, child });
    },
    appendChildToContainer: (_, child) => {
      console.log("appendChildToContainer", child);
    },
    appendInitialChild: (group, child) => {
      console.log("appendInitialChild", { parent, child });
      group.add(child);
    },
    createTextInstance: (x) => {
      console.log("createTextInstance", x);
    },
    removeChildFromContainer: (y) => {
      console.log("removeChildFromContainer", y);
    },
    removeChild: (parent, child) => {
      console.log("removeChild", { parent, child });
      if (child.coco && child.props.onClick) {
        canvas.removeEventListener("click", child.coco, false);
      }

      parent.followers = parent.followers.filter(
        (follower) => follower !== child
      );

      child.endDrag(canvas);
    },
    appendChild: (parent, child) => {
      console.log("appendChild", { parent, child });
      removeChild;
      parent.followers = [...parent.followers, child];
    },
    prepareUpdate: (instance, type, oldProps, newProps) => {
      console.log("prepareUpdate", { oldProps, newProps });
      let payload;

      if (oldProps.x !== newProps.x) payload = { ...payload, x: newProps.x };
      if (oldProps.y !== newProps.y) payload = { ...payload, y: newProps.y };

      if (oldProps.color !== newProps.color)
        payload = { ...payload, color: newProps.color };

      if (oldProps.onClick !== newProps.onClick) {
        payload = { ...payload, onClick: newProps.onClick };
      }

      if (oldProps.onMouseMove !== newProps.onMouseMove) {
        payload = { ...payload, onMouseMove: newProps.onMouseMove };
      }

      if (oldProps.onMouseDown !== newProps.onMouseDown) {
        payload = { ...payload, onMouseDown: newProps.onMouseDown };
      }

      if (oldProps.onMouseIn !== newProps.onMouseIn) {
        payload = { ...payload, onMouseIn: newProps.onMouseIn };
      }

      if (oldProps.onMouseOut !== newProps.onMouseOut) {
        payload = { ...payload, onMouseOut: newProps.onMouseOut };
      }

      if (oldProps.text !== newProps.text) {
        payload = { ...payload, text: newProps.text };
      }

      if (oldProps.size !== newProps.size) {
        payload = { ...payload, size: newProps.size };
      }

      if (oldProps.stroke !== newProps.stroke) {
        payload = { ...payload, stroke: newProps.stroke };
      }

      if (oldProps.radius !== newProps.radius) {
        payload = { ...payload, radius: newProps.radius };
      }

      if (oldProps.x1 !== newProps.x1) {
        payload = { ...payload, x1: newProps.x1 };
      }

      if (oldProps.y1 !== newProps.y1) {
        payload = { ...payload, y1: newProps.y1 };
      }

      if (oldProps.x2 !== newProps.x2) {
        payload = { ...payload, x2: newProps.x2 };
      }

      if (oldProps.y2 !== newProps.y2) {
        payload = { ...payload, y2: newProps.y2 };
      }

      if (oldProps.strokeWidth !== newProps.strokeWidth) {
        payload = { ...payload, strokeWidth: newProps.strokeWidth };
      }

      if (oldProps.select !== newProps.select) {
        payload = { ...payload, select: newProps.select };
      }

      if (oldProps.drag !== newProps.drag) {
        payload = { ...payload, drag: newProps.drag };
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
      console.log("commitUpdate", { instance, updatePayload });

      if (updatePayload.x) instance.setPos(updatePayload.x, 0);
      if (updatePayload.y) instance.setPos(updatePayload.y, 0);
      if (updatePayload.color) instance.props.color = updatePayload.color;

      // events:
      const event = instance.event;

      if (updatePayload.onClick) event.schedule("click", updatePayload.onClick);

      if (updatePayload.onMouseMove)
        event.schedule("mousemove", updatePayload.onMouseMove);

      if (updatePayload.onMouseDown)
        event.schedule("mousedown", updatePayload.onMouseDown);

      if (updatePayload.onMouseIn)
        event.schedule("mousein", updatePayload.onMouseIn);

      if (updatePayload.onMouseOut)
        event.schedule("mouseout", updatePayload.onMouseOut);

      if (updatePayload.text) instance.props.text = updatePayload.text;
      if (updatePayload.size) instance.props.size = updatePayload.size;
      if (updatePayload.stroke) instance.props.stroke = updatePayload.stroke;
      if (updatePayload.radius) instance.props.radius = updatePayload.radius;
      if (updatePayload.x1) instance.props.x1 = updatePayload.x1;
      if (updatePayload.y1) instance.props.y1 = updatePayload.y1;
      if (updatePayload.x2) instance.props.x2 = updatePayload.x2;
      if (updatePayload.y2) instance.props.y2 = updatePayload.y2;
      if (updatePayload.select) instance.props.select = updatePayload.select;
      if (updatePayload.strokeWidth)
        instance.props.strokeWidth = updatePayload.strokeWidth;
    },
    getRootHostContext: (x) => {
      console.log("getRootHostContext", { x });
      return rootHostContext;
    },
    resetAfterCommit: (x) => {
      console.log("resetAfterCommit", { x });
    },
    getChildHostContext: (x) => {
      console.log("getChildHostContext", { x });
      return childHostContext;
    },
    shouldSetTextContent: (x) => {
      console.log("shouldSetTextContent", { x });
    },
    finalizeInitialChildren: (x) => {
      console.log("finalizeInitialChildren", { x });
    },
    updateFundamentalComponent: (x) => {
      console.log("updateFundamentalComponent", { x });
    },
    unmountFundamentalComponent: (x) => {
      console.log("unmountFundamentalComponent", { x });
    },
    clearContainer: (x) => {
      console.log("unmountFundamentalComponent", { x });
    },
    supportsMutation: true,
    isPrimaryRenderer: true,
  };

  return ReactReconciler(canvas2DConfigs);
};

export default function render(element, canvas) {
  const ctx = setupCanvas(canvas);
  const reconciler = createReconciler(canvas, ctx);
  const container = reconciler.createContainer(canvas, false, false);
  const Provider = React.createElement(
    Context.Provider,
    { value: { canvas, width: canvas.width, height: canvas.height, ctx } },
    element
  );

  reconciler.updateContainer(Provider, container, null, null);

  function renderLoop(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // updating
    updateQueue.forEach((animation) => animation.run(time));

    function draw(elem) {
      let shouldRestore = false;

      if (elem.type === "group") {
        if (elem.transform || elem.update) {
          ctx.save();
          shouldRestore = true;

          const { x, y, ...transform } = elem.transform || {};
          const transforms = { translate: { x, y }, ...transform };

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

            if (ctx[key]) {
              if (key === "scale") {
                let scale = 0;

                if (elem.update && elem.update.props) {
                  elem.update.props.scale && (scale = elem.update.props.scale);
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
                }

                ctx[key](value + val);
              }
            }
          });
        }

        elem.order();

        // draw elements
        elem.followers.forEach((child) => {
          draw(elem.attach(child));
        });

        // draw group:
        if (elem.hint) elem.draw(ctx);

        if (shouldRestore) ctx.restore();
      } else elem.draw(ctx);
    }

    drawQueue.forEach((elem) => draw(elem));

    window.requestAnimationFrame(renderLoop);
  }

  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * DPI;
    canvas.height = rect.height * DPI;

    const ctx = canvas.getContext("2d");

    // ctx.scale(DPI, DPI);

    return ctx;
  }

  function getMouseCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const mouse = {
      x: (e.clientX - rect.left) * DPI,
      y: (e.clientY - rect.top) * DPI,
    };

    return mouse;
  }

  function eventMiddleware(mouse, name) {
    eventQueue.forEach(
      (event) =>
        name &&
        event[name] &&
        event.checkBoundries &&
        event.checkBoundries(mouse, ctx)
    );

    const indexes = eventQueue
      .filter(({ isIn }) => isIn)
      .map(({ index }) => index);

    const events = eventQueue.filter(
      ({ index }) => index === Math.max(...indexes)
    );

    return events;
  }

  function clickHanlder(e) {
    const mouse = getMouseCoords(e);
    const events = eventMiddleware(mouse, "click");

    events.forEach((event) => event.click && event.click());
  }

  function mouseMoveHandler(e) {
    const mouse = getMouseCoords(e);

    eventQueue.forEach(({ mousemove, checkBoundries, absolute }) => {
      if (absolute && mousemove) mousemove(mouse);
      if (checkBoundries) checkBoundries(mouse, ctx);
    });

    const indexes = eventQueue
      .filter(({ isIn }) => isIn)
      .map(({ index }) => index);

    const isHighest = Math.max(...indexes);

    const isInsideOtherElementsAnchors =
      eventQueue.filter(
        (eve) => eve.selected && eve.isInsideOneOfTheAnchors(mouse, ctx)
      )?.length > 0;

    const selectedElement = eventQueue.find((eve) => {
      return eve.isIn && eve.selected;
    });

    eventQueue.forEach((eve) => {
      if (eve.draggable || eve.scalable) return;

      if (
        (!selectedElement &&
          eve.index === isHighest &&
          !isInsideOtherElementsAnchors) ||
        (selectedElement && eve.selected)
      )
        eve.isIn = true;
      else eve.isIn = false;
    });

    // dragging
    eventQueue
      .filter(({ isIn }) => isIn)
      .forEach((event) => {
        event.mousemove && event.mousemove(mouse);
        event.dragginghandlers && event.dragginghandlers.mousemove(mouse);
      });

    // mouse in event
    eventQueue
      .filter(({ isIn }) => isIn)
      .forEach(({ mousein, isPreviousMouseIn }) => {
        !isPreviousMouseIn && mousein && mousein(mouse);
      });

    // mouse out event:
    eventQueue
      .filter(({ isPreviousMouseIn }) => isPreviousMouseIn)
      .forEach(({ mouseout, isIn }) => !isIn && mouseout && mouseout(mouse));

    // scaling:
    eventQueue.forEach((eve) => {
      if (eve.selected) {
        const anchor = eve.isInsideOneOfTheAnchors(mouse, ctx);

        if (anchor) eve.scalingHandlers.mousemove(mouse, anchor);
      }
    });
  }

  function mouseDownHandler(e) {
    const mouse = getMouseCoords(e);
    const events = eventMiddleware(mouse, "mousedown");

    events.forEach((event) => {
      event.mousedown && event.mousedown(mouse);
      event.dragginghandlers && event.dragginghandlers.mousedown(mouse);
    });

    const inIndexes = eventQueue
      .filter(({ isIn }) => isIn)
      .map(({ index }) => index);

    const selectedElement = eventQueue.find((eve) => eve.isIn && eve.selected);
    const isHighest = Math.max(...inIndexes);

    eventQueue
      .filter(({ selectable }) => selectable)
      .forEach((eve) => {
        const anchor = eve.isInsideOneOfTheAnchors(mouse, ctx);

        if (
          (selectedElement && eve.selected) ||
          (!selectedElement && eve.index === isHighest) ||
          (eve.selected && anchor)
        ) {
          eve.selected = true;
        } else {
          eve.selected = false;
        }

        if (anchor) eve.scalingHandlers.mousedown(mouse, anchor);
      });
  }

  function mouseUpHandler(e) {
    const mouse = getMouseCoords(e);
    const events = eventMiddleware(mouse, "mouseup");

    //dragging:
    events.forEach((event) => {
      event.dragginghandlers && event.dragginghandlers.mouseup(mouse);
    });

    // dragging anchor points:
    eventQueue
      .filter(({ selectable }) => selectable)
      .forEach((eve) => {
        const anchor = eve.isInsideOneOfTheAnchors(mouse, ctx);

        if (eve.selected && anchor) eve.scalingHandlers.mouseup(mouse);
      });
  }

  canvas.addEventListener("click", clickHanlder);
  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);

  renderLoop();
}
