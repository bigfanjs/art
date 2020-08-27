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
  draw: function (ctx) {
    const primitive = primitives[this.type];
    const offsets = this.update && this.update.offsets;

    let shouldrestore = false;

    // transform
    if (this.transform || this.update) {
      ctx.save();
      shouldrestore = true;

      const { x, y, ...transform } = this.transform || {};
      const transforms = {
        ...(x && y && !offsets ? { translate: { x, y } } : {}),
        ...transform,
      };

      let arr =
        this.update && this.update.props ? Object.keys(this.update.props) : [];

      // check if a transformation exists on update but not on transform, and then add it.
      for (let i = 0; i < arr.length; i++) {
        const transos = Object.keys(transforms);
        const reso = transos.find((trans) => trans === arr[i]);

        if (!reso) transforms[arr[i]] = this.update.props[arr[i]];
      }

      Object.keys(transforms).forEach((key) => {
        const value = transforms[key];

        if (ctx[key]) {
          if (key === "scale") {
            let scale = 0;

            if (this.update && this.update.props) {
              this.update.props.scale && (scale = this.update.props.scale);
            }

            ctx.scale(value, value + scale);
          }
          if (key === "translate") {
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

    // draw
    this.path = primitive(
      ctx,
      {
        ...this.props,
        ...(this.update && offsets ? this.update.props : {}),
      },
      this.image,
      this.isLoaded
    );

    if (shouldrestore) ctx.restore();
  },
  setPos: function setPos(x, y) {
    if (this.type === "polygon") {
      const array = this.props.points.split(" ").map((point) => {
        const [xx, yy] = point.split(",");

        return { x: parseFloat(xx) + x, y: parseFloat(yy) + y };
      });

      this.props.points = array.reduce((sum, { x, y }) => {
        return `${sum} ${x},${y}`;
      }, "");
    } else {
      this.props.x = this.props.x + x;
      this.props.y = this.props.y + y;
    }

    // console.log({ newPoints: this.props.points });

    return this;
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
};

export default Element;
