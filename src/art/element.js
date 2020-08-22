import primitives from "./primitives";
import { isPointInRect, isPointInCircle } from "./isPointInside";

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
    this.path = primitive(ctx, {
      ...this.props,
      ...(this.update && offsets ? this.update.props : {}),
    });

    if (shouldrestore) ctx.restore();
  },
  setPos: function setPos(x, y) {
    this.props.x = this.props.x + x;
    this.props.y = this.props.y + y;

    return this;
  },
  onClick: function onClick(canvas, handler) {
    canvas.removeEventListener("click", handler, false);
    canvas.addEventListener("click", handler, false);
  },
  makeDrag: function (canvas, ctx) {
    // console.log({ type: this.type });

    if (this.type === "rect") {
      const mousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (
          mouse.x >= this.props.x &&
          mouse.y >= this.props.y &&
          mouse.x < this.props.x + this.props.width &&
          mouse.y < this.props.y + this.props.height
        ) {
          this.draggable = true;
          this.mouse = mouse;
        }
      };
      const mouseup = () => (this.draggable = false);
      const mousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (this.draggable) {
          const diffx = mouse.x - this.mouse.x;
          const diffy = mouse.y - this.mouse.y;

          this.mouse = mouse;

          this.props.x = this.props.x + diffx;
          this.props.y = this.props.y + diffy;
        }
      };

      canvas.addEventListener("mousedown", mousedown, false);
      canvas.addEventListener("mouseup", mouseup, false);
      canvas.addEventListener("mousemove", mousemove, false);

      this.eventHandlers = [
        { name: "mousedown", handler: mousedown },
        { name: "mouseup", handler: mouseup },
        { name: "mousemove", handler: mousemove },
      ];
    } else if (this.type === "arc") {
      const mousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const diffX = mouse.x - this.props.x;
        const diffY = mouse.y - this.props.y;
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist <= this.props.radius) {
          this.draggable = true;
          this.mouse = mouse;
        }
      };
      const mouseup = () => (this.draggable = false);
      const mousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (this.draggable) {
          const diffx = mouse.x - this.mouse.x;
          const diffy = mouse.y - this.mouse.y;

          this.mouse = mouse;

          this.props.x = this.props.x + diffx;
          this.props.y = this.props.y + diffy;
        }
      };

      canvas.addEventListener("mousedown", mousedown, false);
      canvas.addEventListener("mouseup", mouseup, false);
      canvas.addEventListener("mousemove", mousemove, false);

      this.eventHandlers = [
        { name: "mousedown", handler: mousedown },
        { name: "mouseup", handler: mouseup },
        { name: "mousemove", handler: mousemove },
      ];
    } else {
      const mousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (ctx.isPointInPath(this.path, mouse.x, mouse.y)) {
          // console.log({ path: this.path, mouse, type: this.type });
          this.draggable = true;
          this.mouse = mouse;
        }
      };
      const mouseup = () => (this.draggable = false);
      const mousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (this.draggable) {
          const diffx = mouse.x - this.mouse.x;
          const diffy = mouse.y - this.mouse.y;

          this.mouse = mouse;

          this.props.x = this.props.x + diffx;
          this.props.y = this.props.y + diffy;
        }
      };

      canvas.addEventListener("mousedown", mousedown, false);
      canvas.addEventListener("mouseup", mouseup, false);
      canvas.addEventListener("mousemove", mousemove, false);

      this.eventHandlers = [
        { name: "mousedown", handler: mousedown },
        { name: "mouseup", handler: mouseup },
        { name: "mousemove", handler: mousemove },
      ];
    }
  },
  endDrag: function (canvas) {
    this.eventHandlers.forEach(({ name, handler }) => {
      canvas.removeEventListener(name, handler);
    });
  },
  checkBoundries: function checkBoundries(point) {
    let isPointInPath;

    switch (this.type) {
      case "rect":
        isPointInPath = this.props ? isPointInRect(this.props, point) : false;
        break;
      case "arc":
        isPointInPath = this.props ? isPointInCircle(this.props, point) : false;
        break;
      default:
        return;
    }

    return isPointInPath;
  },
};

export default Element;
