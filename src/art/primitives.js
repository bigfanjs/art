import { polygonTransformBy } from "math2d/esm/polygonFunctions/polygonTransformBy";
import { vecTransformBy } from "math2d/esm/vecFunctions/vecTransformBy";

const primitives = {
  rect: (ctx, { x, y, width, height, color }) => {
    let path;
    let rectPath = new Path2D();

    ctx.beginPath();
    ctx.fillStyle = color;
    rectPath.rect(x - width / 2, y - height / 2, width, height);
    ctx.fill(rectPath);

    path = rectPath;

    path.closePath();

    return { path };
  },
  arc: (
    ctx,
    {
      x,
      y,
      radius,
      start = 0,
      end = Math.PI * 2,
      isCounterclockwise = false,
      color,
    }
  ) => {
    let path;

    const arcPath = new Path2D();

    ctx.beginPath();
    ctx.fillStyle = color;
    arcPath.ellipse(x, y, radius, radius, 0, start, end);
    ctx.fill(arcPath);

    path = arcPath;

    path.closePath();

    return { path };
  },
  polygon: (ctx, { points, color, stroke }, { transforms }) => {
    const { scaleX = 1, scaleY = 1 } = transforms ?? {};

    const pp = points
      .replace(/,/gi, " ")
      .split(" ")
      .map((p) => parseFloat(p));

    const result = polygonTransformBy(pp, {
      a: scaleX, // scaleX
      b: 0,
      c: 0,
      d: scaleY, // scaleY
      e: 0,
      f: 0,
    });

    const path = new Path2D();

    const array = result.reduce((sum, item, idx) => {
      const i = Math.floor(idx / 2);

      sum[i] = [...(sum[i] || []), item];

      return sum;
    }, []);

    path.moveTo(array[0][0], array[0][1]);
    array.filter((_, idx) => idx !== 0).forEach(([x, y]) => path.lineTo(x, y));

    path.closePath();

    ctx[stroke ? "strokeStyle" : "fillStyle"] = color;
    stroke ? ctx.stroke(path) : ctx.fill(path);

    return { path, points };
  },
  text: (ctx, { x, y, text, size, fontFamily, baseLine, textAlign, color }) => {
    let path;

    ctx.textBaseline = baseLine;
    ctx.textAlign = textAlign;
    ctx.font = `${size}px ${fontFamily}`;

    const textMetrics = ctx.measureText(text);

    const Descent = textMetrics.actualBoundingBoxDescent;
    const Ascent = textMetrics.actualBoundingBoxAscent;
    const Left = textMetrics.actualBoundingBoxLeft;
    const Right = textMetrics.actualBoundingBoxRight;
    const TextHalfHeight = (Descent + Ascent) / 2;
    const TextHalfWidth = (Right + Left) / 2;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillText(text, x + Left - TextHalfWidth, y + Ascent - TextHalfHeight);

    return { path };
  },
  hexagon: function hexagon(ctx, { x, y, radius, color, stroke }) {
    let path = new Path2D();
    const points = [];

    ctx.beginPath();

    const startPoint = [x + radius * Math.cos(0), y + radius * Math.sin(0)];

    path.moveTo(...startPoint);
    points.push(...startPoint);

    for (let side = 0; side < 7; side++) {
      const point = [
        x + radius * Math.cos((side * 2 * Math.PI) / 6),
        y + radius * Math.sin((side * 2 * Math.PI) / 6),
      ];

      path.lineTo(...point);
      points.push(...point);
    }

    ctx[stroke ? "strokeStyle" : "fillStyle"] = color;
    stroke ? ctx.stroke(path) : ctx.fill(path);

    path.closePath();

    return { path, points };
  },
  line: (ctx, { x1, y1, x2, y2, strokeWidth, color }, { transforms }) => {
    const { scaleX = 1, scaleY = 1 } = transforms ?? {};

    const P1 = vecTransformBy(
      { x: x1, y: y1 },
      { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 }
    );

    const P2 = vecTransformBy(
      { x: x2, y: y2 },
      { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 }
    );

    const path = new Path2D();

    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;

    // console.log({ P1, P2 });

    path.moveTo(P1.x, P1.y);
    path.lineTo(P2.x, P2.y);

    ctx.stroke(path);
    ctx.closePath();

    return { path };
  },
  img: (
    ctx,
    { x, y, width, height, sx, sy, sw, sh },
    { image, isLoaded = false, hover = false, transforms }
  ) => {
    let path;

    if (isLoaded) {
      if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof width === "number" &&
        typeof height === "number" &&
        typeof sx === "number" &&
        typeof sy === "number" &&
        typeof sw === "number" &&
        typeof sh === "number"
      ) {
        // console.log("ww");
        ctx.drawImage(
          image,
          sx,
          sy,
          sw,
          sh,
          x - width / 2,
          y - height / 2,
          width,
          height
        );
      } else if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof width === "number" &&
        typeof height === "number"
      )
        ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
      else if (typeof x === "number" && typeof y === "number") {
        ctx.drawImage(image, x - image.width / 2, y - image.height / 2);
      }
    }

    return { path };
  },
};

export default primitives;
