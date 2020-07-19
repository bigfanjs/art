import ReactReconciler from "react-reconciler";
import React, { createContext } from "react";

import Group from "./group";
import Element from "./element";

export const drawQueue = [];
export const updateQueue = [];
export const clickHandlerQueue = [];

export const Context = createContext({});

const createReconciler = (ctx) => {
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
            });
            break;
          default:
            return;
        }

        element.type = type;
        element.update = props.update;
        element.transform = props.transform;

        return element;
      }
    },
    prepareForCommit: (parent, child) => {},
    appendChildToContainer: (_, child) => drawQueue.push(child),
    appendInitialChild: (group, child) => group.add(child),
    createTextInstance: () => {},
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
    const reconciler = createReconciler(ctx);
    const container = reconciler.createContainer(canvas, false, false);
    const Provider = React.createElement(
      Context.Provider,
      { value: { width: canvas.width, height: canvas.height, ctx } },
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

    renderLoop();

    canvas.addEventListener("click", () => {
      clickHandlerQueue.forEach((handler) => handler());
    });
  },
};

export default Art;
