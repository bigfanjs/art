import { polygonGetBounds } from "math2d/esm/polygonFunctions/polygonGetBounds";

import primitives from "./primitives";
import boundingBoxes from "./boundingBox";
import { isPointInPath } from "./isPointInside";

const Element = {
  props: null,
  type: null,
  update: null,
  transform: null,
  draggable: false,
  mouse: null,
  currMouse: null,
  isPath: false,
  eventHandlers: [],
  zIndex: 1,
  anchors: [],
  mouseTransforms: null,
  select: false,
  draw: function (ctx) {
    const primitive = primitives[this.type];
    const bound = boundingBoxes[this.type];
    const offsets = this.update && this.update.offsets;

    if ((this.transform || this.update) && !this.select)
      this.handleTransforms({ ctx });

    if (this.mouseTransforms) this.handleMouseTransforms({ ctx });

    // draw
    const { path, points } = primitive(
      ctx,
      {
        ...this.props,
        ...(this.update && offsets ? this.update.props : {}),
        ...(this?.mouseTransforms?.anchorTransitionPos ?? {}), // apply the opposite anchor transition
      },
      { image: this.image, isLoaded: this.isLoaded }
    );

    this.path = path;

    // reset
    if (this.mouseTransforms) ctx.restore();
    if ((this.transform || this.update) && this.select) ctx.restore();

    if (this.mouseTransforms)
      this.handleMouseTransforms({ ctx, skipScale: true });

    if (this.event?.selected) {
      const { bounding, anchors } = bound(ctx, {
        ...this.props,
        ...(this?.mouseTransforms?.anchorTransitionPos ?? {}), // apply the opposite anchor transition [TODO] we might add it directly to the props

        points,
        image: this.image,
        transforms: {
          props: {
            scaleX: this.mouseTransforms.props.scaleX,
            scaleY: this.mouseTransforms.props.scaleY,
          },
        },
      });

      this.anchors = anchors;
      this.bounding = bounding;
    }

    if (this.mouseTransforms) ctx.restore();
  },
  handleTransforms: function handleTransforms({ ctx, skipScale = false }) {
    ctx.save();

    const offsets = this.update && this.update.offsets;
    let arr =
      this.update && this.update.props ? Object.keys(this.update.props) : [];

    const transformation = this.transform || {};

    // check if a transformation exists on update but not on transform, and then add it.
    for (let i = 0; i < arr.length; i++) {
      const transos = Object.keys(transformation);
      const reso = transos.find((trans) => trans === arr[i]);

      if (!reso) transformation[arr[i]] = this.update.props[arr[i]];
    }

    const {
      x = 0,
      y = 0,
      scale,
      scaleX,
      scaleY,
      ...transform
    } = transformation;

    const transforms = {
      ...((x || y) && !offsets ? { translate: { x, y } } : {}),

      ...(!skipScale
        ? typeof scaleX === "number" && typeof scaleY === "number"
          ? { scale: { x: scaleX, y: scaleY } }
          : typeof scale === "number"
          ? { scale: { x: scale, y: scale } }
          : {}
        : {}),

      ...transform,
    };

    Object.keys(transforms).forEach((key) => {
      const value = transforms[key];

      if (ctx[key]) {
        if (key === "scale") {
          ctx.scale(value.x, value.y);
        } else if (key === "translate") {
          let x = 0;
          let y = 0;

          // this could be a problem when I don't pass transform prop but I have update!
          if (this.update && this.update.props) {
            this.update.props.x && (x = this.update.props.x);
            this.update.props.y && (y = this.update.props.y);
          }

          ctx.translate(value.x + x, value.y + y);
        } else {
          let val = 0;

          if (this.update && this.update.props) {
            this.update.props[key] && (val = this.update.props[key]);
          }

          ctx[key](value + val);
        }
      }
    });
  },
  handleMouseTransforms: function handleMouseTransforms({
    ctx,
    skipScale = false,
  }) {
    ctx.save();

    const offsets = this.update && this.update.offsets;
    const transformation = this.mouseTransforms.props || {};
    const anchorTransition = this.mouseTransforms.anchorTransition || {};

    const { x, y, scale, scaleX, scaleY, ...transform } = transformation;
    const transforms = {
      ...(x && y && !offsets ? { translate: { x, y } } : {}),

      ...(!skipScale
        ? typeof scaleX === "number" && typeof scaleY === "number"
          ? { scale: { x: scaleX, y: scaleY } }
          : typeof scale === "number"
          ? { x: scale, y: scale }
          : {}
        : {}),

      ...transform,
    };

    Object.keys(transforms).forEach((key) => {
      const value = transforms[key];

      if (ctx[key]) {
        if (key === "translate") {
          let x = anchorTransition.x || 0;
          let y = anchorTransition.y || 0;

          ctx.translate(value.x + x, value.y + y);
        } else if (key === "scale") {
          ctx.scale(value.x, value.y);
        } else {
          let val = 0;

          if (this.update && this.update.props) {
            this.update.props[key] && (val = this.update.props[key]);
          }

          ctx[key](value + val);
        }
      }
    });
  },
  setPos: function setPos(x, y) {
    if (this.type === "polygon") {
      this.props.points =
        this.props.points &&
        this.props.points
          .split(" ")
          .map((point) => {
            const [xx, yy] = point.split(",");

            return { x: parseFloat(xx) + x, y: parseFloat(yy) + y };
          })
          .reduce((sum, { x, y }) => `${sum} ${x},${y}`, "")
          .trim();
    } else {
      this.props.x = this.props.x + x;
      this.props.y = this.props.y + y;
    }

    return this;
  },
  updateScale: function (update) {
    this.mouseTransforms = update;
  },
  checkBoundries: function checkBoundries(point, ctx) {
    if ((this.transform || this.update) && !this.select)
      this.handleTransforms({ ctx });

    if (this.mouseTransforms) this.handleMouseTransforms({ ctx });

    const isMouseIn = isPointInPath(this.path, point, ctx);

    if ((this.transform || this.update) && !this.select) ctx.restore();
    if (this.mouseTransforms) ctx.restore();

    return isMouseIn;
  },
  isInsideOneOfTheAnchors: function (point, ctx) {
    if (this.mouseTransforms)
      this.handleMouseTransforms({ ctx, skipScale: true });

    const selectedAnchor = this.anchors.find((anchor) => {
      const isIn = isPointInPath(anchor, point, ctx);

      return isIn;
    });

    if (this.mouseTransforms) ctx.restore();

    const index = this.anchors.findIndex((anchor) => anchor === selectedAnchor);

    return index < 0 ? false : index + 1;
  },
  clearOffset: function () {
    const { x, y } = this.props;

    if (x > 0 && y > 0) this.setPos(-x, -y);
  },
  setOffsets: function () {
    const points = this.props.points
      .replace(/,/gi, " ")
      .split(" ")
      .map((p) => parseFloat(p));

    const { minX, minY, maxX, maxY } = polygonGetBounds(points);

    const width = maxX - minX;
    const height = maxY - minY;

    this.props.x = minX + width / 2;
    this.props.y = minY + height / 2;
  },
};

export default Element;
