import primitives from "./primitives";

const Element = {
  props: null,
  type: null,
  update: null,
  transform: null,
  draw: function (ctx) {
    const primitive = primitives[this.type];
    const offset = this.update && this.update.offset;

    let shouldrestore = false;

    if (this.transform || this.update) {
      ctx.save();
      shouldrestore = true;

      const { x, y, ...transform } = this.transform || {};
      const transforms = {
        ...(x && y ? { translate: { x, y } } : {}),
        ...transform,
      };

      let arr =
        this.update && this.update.props ? Object.keys(this.update.props) : [];

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

            if (this.update && !offset && this.update.props) {
              this.update.props.scale && (scale = this.update.props.scale);
            }

            ctx.scale(value, value + scale);
          }
          if (key === "translate") {
            let x = 0;
            let y = 0;

            if (this.update && !offset && this.update.props) {
              this.update.props.x && (x = this.update.props.x);
              this.update.props.y && (y = this.update.props.y);
            }

            ctx.translate(value.x + x, value.y + y);
          } else {
            let val = 0;

            if (this.update && !offset && this.update.props) {
              this.update.props[key] && (val = this.update.props[key]);
            }

            ctx[key](value + val);
          }
        }
      });
    }

    primitive(ctx, {
      ...this.props,
      ...(this.update && offset ? this.update.props : {}),
    });

    if (shouldrestore) ctx.restore();
  },
  setPos: function setPos(x, y) {
    this.props.x = this.props.x + x;
    this.props.y = this.props.y + y;

    return this;
  },
};

export default Element;