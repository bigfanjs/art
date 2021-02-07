import React, { createContext } from "react";
import ReactReconciler from "react-reconciler";

import Group from "./group";
import Element from "./element";
import Event from "./Event-mixed";

let globalIndex = 0;

const DPI = window.devicePixelRatio;

export const drawQueue = [];
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
            element.clearOffset(type);
            element.select = true;
          }
        }

        return element;
      }
    },
    prepareForCommit: (parent, child) => {},
    appendChildToContainer: (_, child) => drawQueue.push(child),
    appendInitialChild: (group, child) => group.add(child),
    createTextInstance: () => {},
    removeChildFromContainer: () => {},
    removeChild: (parent, child) => {
      if (child.coco && child.props.onClick) {
        canvas.removeEventListener("click", child.coco, false);
      }

      parent.followers = parent.followers.filter(
        (follower) => follower !== child
      );

      child.endDrag(canvas);
    },
    appendChild: (parent, child) => {
      parent.followers = [...parent.followers, child];
    },
    prepareUpdate: (instance, type, oldProps, newProps) => {
      let payload;

      if (oldProps.x !== newProps.x) payload = { ...payload, x: newProps.x };

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
      if (updatePayload.x) instance.setPos(updatePayload.x, 0);
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
    },
    getRootHostContext: () => {},
    resetAfterCommit: () => {},
    getChildHostContext: () => {},
    shouldSetTextContent: () => {},
    finalizeInitialChildren: () => {},
    updateFundamentalComponent: () => {},
    unmountFundamentalComponent: () => {},
    clearContainer: () => {},
    supportsMutation: true,
  };

  return ReactReconciler(canvas2DConfigs);
};

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * DPI;
  canvas.height = rect.height * DPI;

  const ctx = canvas.getContext("2d");

  // ctx.scale(DPI, DPI);

  return ctx;
}

const Art = {
  render: (element, canvas) => {
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

    // EVENT SYSTEM: (the ugliest code I've ever wrote)
    // TODO: re-design the event system.
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

    canvas.addEventListener("click", (e) => {
      const mouse = getMouseCoords(e);
      const events = eventMiddleware(mouse, "click");

      events.forEach((event) => event.click && event.click());
    });

    canvas.addEventListener("mousemove", (e) => {
      const mouse = getMouseCoords(e);

      eventQueue.forEach(({ mousemove, checkBoundries, absolute }) => {
        if (checkBoundries) checkBoundries(mouse, ctx);
        else if (absolute && mousemove) mousemove(mouse);
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
        if (eve.draggable || eve.selectable) return;

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
    });

    canvas.addEventListener("mousedown", (e) => {
      const mouse = getMouseCoords(e);
      const events = eventMiddleware(mouse, "mousedown");

      events.forEach((event) => {
        event.mousedown && event.mousedown(mouse);
        event.dragginghandlers && event.dragginghandlers.mousedown(mouse);
      });

      const inIndexes = eventQueue
        .filter(({ isIn }) => isIn)
        .map(({ index }) => index);

      const selectedElement = eventQueue.find(
        (eve) => eve.isIn && eve.selected
      );

      const isHighest = Math.max(...inIndexes);

      eventQueue.forEach((eve) => {
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
    });

    canvas.addEventListener("mouseup", (e) => {
      const mouse = getMouseCoords(e);
      const events = eventMiddleware(mouse, "mouseup");

      //dragging:
      events.forEach((event) => {
        event.dragginghandlers && event.dragginghandlers.mouseup(mouse);
      });

      // dragging anchor points:
      eventQueue.forEach((eve) => {
        const anchor = eve.isInsideOneOfTheAnchors(mouse, ctx);

        if (eve.selected && anchor) eve.scalingHandlers.mouseup(mouse);
      });
    });

    renderLoop();
  },
};

export default Art;
