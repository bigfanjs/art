import React, { createContext } from "react";
import ReactReconciler from "react-reconciler";

import Group from "./group";
import Element from "./element";
import Event from "./Event2";

let globalIndex = 0;

export const drawQueue = [];
export const updateQueue = [];
export const eventQueue = [];

export const Context = createContext({});

const createReconciler = (canvas, ctx) => {
  const handlly = (hando, type, props) => {
    return (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      switch (type) {
        case "arc":
          const diffX = mouse.x - props.x;
          const diffY = mouse.y - props.y;
          const dist = Math.sqrt(diffX * diffX + diffY * diffY);

          if (dist <= props.radius) hando(event);
          break;
        case "rect":
          if (
            mouse.x >= props.x &&
            mouse.y >= props.y &&
            mouse.x < props.x + props.width &&
            mouse.y < props.y + props.height
          ) {
            hando(event);
          }
          break;
        default:
          return;
      }
    };
  };

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
                value: false,
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
                value: false,
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
            // console.log({ update: props.update });
            break;
          case "polygon":
            element = Object.create(Element, {
              props: {
                value: {
                  points: props.points,
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
          case "text":
            element = Object.create(Element, {
              props: {
                value: {
                  x: props.x,
                  y: props.y,
                  text: props.text,
                  size: props.size,
                  fontFamily: props.fontFamily,
                  color: props.color,
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
          default:
            return;
        }

        // if (props.onClick || props.drag) {
        //   element.event = new Event();
        // }

        // if (props.onClick) {
        //   const coco = handlly(props.onClick, type, props);

        //   canvas.addEventListener("click", coco, false);
        //   element.coco = coco;
        // }

        globalIndex = globalIndex + 1;
        element.zIndex = globalIndex;

        let event = null;

        if (
          props.onClick ||
          props.onMouseMove ||
          props.onMouseOver ||
          props.onMouseUp ||
          props.onMouseDown
        ) {
          event = new Event();

          event.props = props;
          event.type = type;
          event.index = globalIndex;

          element.event = event;
        }

        if (event) {
          props.onClick && event.onClick(props.onClick);
          props.onMouseMove && event.onMouseMove(props.onMouseMove);
          props.onMouseDown && event.onMouseDown(props.onMouseDown);
          props.onMouseOver && event.onMouseOver(props.onMouseOver);
        }

        element.type = type;
        element.update = props.update;
        element.transform = props.transform;

        // if (props.drag) element.makeDrag(canvas, ctx);

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

      if (oldProps.onMouseOver !== newProps.onMouseOver) {
        payload = { ...payload, onMouseOver: newProps.onMouseOver };
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
      if (updatePayload.onClick) instance.event.onClick(updatePayload.onClick);
      if (updatePayload.onMouseMove)
        instance.event.onMouseMove(updatePayload.onMouseMove);
      if (updatePayload.onMouseDown)
        instance.event.onMouseDown(updatePayload.onMouseDown);
      if (updatePayload.onMouseOver)
        instance.event.onMouseOver(updatePayload.onMouseOver);
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

const Art = {
  render: (element, canvas) => {
    const ctx = canvas.getContext("2d");
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

    function getMouseCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      return mouse;
    }

    function eventMiddleware(mouse, over = false) {
      !over && eventQueue.forEach((event) => event.checkBoundries(mouse));

      const indexes = eventQueue
        .filter(({ isIn }) => over || isIn)
        .map(({ index }) => index);

      const events = eventQueue.filter(
        ({ index }) => index === Math.max(...indexes)
      );

      return events;
    }

    canvas.addEventListener(
      "click",
      (e) => {
        const mouse = getMouseCoords(e);
        const events = eventMiddleware(mouse);

        events.forEach((event) => event.click && event.click());
      },
      false
    );

    canvas.addEventListener("mousemove", (e) => {
      const mouse = getMouseCoords(e);

      eventQueue.forEach((event) => event.checkBoundries(mouse));
      const indexes = eventQueue
        .filter(({ isIn }) => isIn)
        .map(({ index }) => index);

      const events = eventQueue.filter(
        ({ index }) => index === Math.max(...indexes)
      );

      // over area:
      const indexes2 = eventQueue
        .filter(({ isIn, isPreviousMouseIn }) => isIn || isPreviousMouseIn)
        .map(({ index }) => index);

      const events2 = eventQueue.filter(
        ({ index }) => index === Math.max(...indexes2)
      );

      events.forEach((event) => event.mousemove && event.mousemove(mouse));
      events2.forEach(({ mouseover, isIn, isPreviousMouseIn }) => {
        isIn !== isPreviousMouseIn && mouseover && mouseover(mouse);
      });
    });

    canvas.addEventListener("mousedown", (e) => {
      const mouse = getMouseCoords(e);
      const events = eventMiddleware(mouse);

      events.forEach((event) => event.mousedown && event.mousedown(mouse));
    });

    renderLoop();
  },
};

export default Art;
