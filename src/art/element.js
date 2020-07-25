import primitives from "./primitives";

const Element = {
  props: null,
  type: null,
  update: null,
  transform: null,
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

    // console.log({ props: this.update.props });

    // console.log({ update: this.update });

    // draw
    primitive(ctx, {
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
};

export default Element;
