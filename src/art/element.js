import primitives from "./primitives";
import { isPointInPath, isPointInRect } from "./isPointInside";

const baseLines = ["alphabetic", "ideographic", "bottom"];

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
  draw: function (ctx) {
    const primitive = primitives[this.type];
    const offsets = this.update && this.update.offsets;

    let shouldrestore = false;

    // transform
    if (this.transform || this.update) {
      ctx.save();
      shouldrestore = true;

      let arr =
        this.update && this.update.props ? Object.keys(this.update.props) : [];

      const transformation = this.transform || {}

      // check if a transformation exists on update but not on transform, and then add it.
      for (let i = 0; i < arr.length; i++) {
        const transos = Object.keys(transformation);
        const reso = transos.find((trans) => trans === arr[i]);

        if (!reso) transformation[arr[i]] = this.update.props[arr[i]];
      }

      const { x, y, scale, scaleX, scaleY, ...transform } = transformation;
      const transforms = {
        ...(x && y && !offsets ? { translate: { x, y } } : {}),
        ...(scale || scaleX || scaleY
          ? { scale: { x: scaleX || scale || 1, y: scaleY || scale || 1 } }
          : {}),
        ...transform,
      };

      Object.keys(transforms).forEach((key) => {
        const value = transforms[key];

        if (ctx[key]) {
          if (key === "scale") {
            ctx.scale(value.x, value.y);
          }
          else if (key === "translate") {
            let x = 0;
            let y = 0;

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
    }

    // danger area -start

    mouseTransforms.

    // danger area -end

    // draw
    const { path, anchors, bounding } = primitive(
      ctx,
      {
        ...this.props,
        ...(this.update && offsets ? this.update.props : {}),
      },
      this.event.selected,
      this.image,
      this.isLoaded
    );

    this.path = path
    this.anchors = anchors;
    this.bounding = bounding;

    if (shouldrestore) ctx.restore();
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
    this.mouseTransforms = update
  },
  checkBoundries: function checkBoundries(point, ctx) {
    let isMouseIn = false;

    // TODO: need major code cleaning or even moving this section away from this method
    if (this.isPath) {
      isMouseIn = isPointInPath(this.path, point, ctx);
    } else {
      const baseLine = baseLines.find((bl) => bl === this.props.baseLine);
      const centerBL = this.props.baseLine === "middle";

      let rect;

      if (this.type === "text") {
        rect = {
          x: this.props.x,
          y:
            this.props.y -
            (baseLine ? this.path.height : centerBL ? this.path.height / 2 : 0),
          width: this.path.width,
          height: this.path.height,
        };
      } else {
        rect = {
          x: this.props.x,
          y: this.props.y,
          width: this.props.width,
          height: this.props.height,
        };
      }

      isMouseIn = isPointInRect(rect, point);
    }

    return isMouseIn;
  },
  isInsideOneOfTheAnchors: function (point, ctx) {
    return this.anchors.find((anchor) => {
      const isIn = isPointInPath(anchor, point, ctx);

      return isIn;
    });
  }
};

export default Element;
