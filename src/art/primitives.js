import { polygonTransformBy } from "math2d/esm/polygonFunctions/polygonTransformBy";
import { boxTransformBy } from "math2d/esm/boxFunctions/boxTransformBy";

const primitives = {
  rect: (
    ctx,
    { x, y, width, height, color },
    { hover = false, transforms = {} }
  ) => {
    let path;

    if (hover) {
      const result = boxTransformBy(
        {
          minX: x - width / 2,
          minY: y - height / 2,
          maxX: x - width / 2 + width,
          maxY: y - height / 2 + height,
        },
        {
          a: transforms.scaleX, // scaleX
          b: 0,
          c: 0,
          d: transforms.scaleY, // scaleY
          e: transforms.x, // translateX
          f: transforms.y, // translateY
        }
      );

      const hoverpath = new Path2D();

      ctx.beginPath();

      hoverpath.rect(
        result.minX,
        result.minY,
        result.maxX - result.minX,
        result.maxY - result.minY
      );

      path = hoverpath;
    } else {
      let rectPath = new Path2D();

      // console.log({ x: x - width / 2, y: y - height / 2, width, height });

      ctx.beginPath();
      ctx.fillStyle = color;
      rectPath.rect(x - width / 2, y - height / 2, width, height);
      ctx.fill(rectPath);

      path = rectPath;
    }

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
    },
    { hover = false, transforms = {} }
  ) => {
    let path;

    if (hover) {
      const result = boxTransformBy(
        {
          minX: x - radius,
          minY: y - radius,
          maxX: x + radius,
          maxY: y + radius,
        },
        {
          a: transforms.scaleX, // scaleX
          b: 0,
          c: 0,
          d: transforms.scaleY, // scaleY
          e: transforms.x, // translateX
          f: transforms.y, // translateY
        }
      );

      const hoverpath = new Path2D();

      ctx.beginPath();

      const radiusX = (result.maxX - result.minX) / 2;
      const radiusY = (result.maxY - result.minY) / 2;

      hoverpath.ellipse(
        result.minX + radiusX,
        result.minY + radiusY,
        radiusX,
        radiusY,
        0,
        start,
        end
      );

      path = hoverpath;
    } else {
      const arcPath = new Path2D();

      ctx.beginPath();
      ctx.fillStyle = color;
      arcPath.ellipse(x, y, radius, radius, 0, start, end);
      ctx.fill(arcPath);

      path = arcPath;
    }

    path.closePath();

    return { path };
  },
  polygon: (ctx, { points, color, stroke }, { hover = false, transforms }) => {
    let path;

    if (hover) {
      const { x, y, scaleX = 1, scaleY = 1 } = transforms ?? {};

      const pp = points
        .replace(/,/gi, " ")
        .split(" ")
        .map((p) => parseFloat(p));

      const result = polygonTransformBy(pp, {
        a: scaleX, // scaleX
        b: 0,
        c: 0,
        d: scaleY, // scaleY
        e: x, // translateX
        f: y, // translateY
      });

      const hoverpath = new Path2D();
      const array = result.reduce((sum, item, idx) => {
        const i = Math.floor(idx / 2);

        sum[i] = [...(sum[i] || []), item];

        return sum;
      }, []);

      hoverpath.moveTo(array[0][0], array[0][1]);
      array
        .filter((_, idx) => idx !== 0)
        .forEach(([x, y]) => hoverpath.lineTo(x, y));

      hoverpath.closePath();

      path = hoverpath;
    } else {
      const polygon = new Path2D();

      const array = points.split(" ").map((point) => {
        const [x, y] = point.split(",");

        return { x, y };
      });

      // console.log(array);

      polygon.moveTo(array[0].x, array[0].y);
      array
        .filter((_, idx) => idx !== 0)
        .forEach(({ x, y }) => polygon.lineTo(x, y));

      path = polygon;
      polygon.closePath();
    }

    if (!hover) {
      ctx[stroke ? "strokeStyle" : "fillStyle"] = color;
      stroke ? ctx.stroke(path) : ctx.fill(path);
    }

    return { path, points };
  },
  text: (
    ctx,
    { x, y, text, size, fontFamily, baseLine, textAlign, color },
    { hover = false, transforms }
  ) => {
    let path;

    // console.log({ y });

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

    if (hover) {
      const result = boxTransformBy(
        {
          minY: y - TextHalfHeight,
          maxY: y + Descent + Ascent - TextHalfHeight,
          minX: x - TextHalfWidth,
          maxX: x + Right + Left - TextHalfWidth,
        },
        {
          a: transforms.scaleX, // scaleX
          b: 0,
          c: 0,
          d: transforms.scaleY, // scaleY
          e: transforms.x, // translateX
          f: transforms.y, // translateY
        }
      );

      const hoverpath = new Path2D();
      hoverpath.rect(
        result.minX,
        result.minY,
        result.maxX - result.minX,
        result.maxY - result.minY
      );

      path = hoverpath;
    } else {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillText(text, x + Left - TextHalfWidth, y + Ascent - TextHalfHeight);
    }

    return { path };
  },
  hexagon: function hexagon(
    ctx,
    { x, y, radius, color, stroke },
    { hover = false, transforms }
  ) {
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

    if (hover) {
      const { x, y, scaleX = 1, scaleY = 1 } = transforms ?? {};

      // console.log(points);
      const result = polygonTransformBy(points, {
        a: scaleX, // scaleX
        b: 0,
        c: 0,
        d: scaleY, // scaleY
        e: hover ? x : 0, // translateX
        f: hover ? y : 0, // translateY
      });

      const hoverpath = new Path2D();
      const array = result.reduce((sum, item, idx) => {
        const i = Math.floor(idx / 2);

        sum[i] = [...(sum[i] || []), item];

        return sum;
      }, []);

      hoverpath.moveTo(array[0][0], array[0][1]);
      array
        .filter((_, idx) => idx !== 0)
        .forEach(([x, y]) => hoverpath.lineTo(x, y));

      hoverpath.closePath();

      path = hoverpath;
    }

    if (!hover) {
      ctx[stroke ? "strokeStyle" : "fillStyle"] = color;
      stroke ? ctx.stroke(path) : ctx.fill(path);
    }

    path.closePath();

    return { path, points };
  },
  line: (ctx, { x1, y1, x2, y2, color }) => {
    const path = new Path2D();

    ctx.beginPath();
    ctx.strokeStyle = color;
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
    ctx.stroke(path);

    return { path };
  },
  img: (
    ctx,
    { x, y, width, height, sx, sy, sw, sh },
    { image, isLoaded = false, hover = false, transforms }
  ) => {
    let path;

    if (hover) {
      const rectWidth = width || image.width;
      const rectHeight = height || image.height;

      const result = boxTransformBy(
        {
          minX: x - rectWidth / 2,
          minY: y - rectHeight / 2,
          maxX: x - rectWidth / 2 + rectWidth,
          maxY: y - rectHeight / 2 + rectHeight,
        },
        {
          a: transforms.scaleX, // scaleX
          b: 0,
          c: 0,
          d: transforms.scaleY, // scaleY
          e: transforms.x, // translateX
          f: transforms.y, // translateY
        }
      );

      const hoverpath = new Path2D();

      ctx.beginPath();

      hoverpath.rect(
        result.minX,
        result.minY,
        result.maxX - result.minX,
        result.maxY - result.minY
      );

      path = hoverpath;
      return { path };
    }

    if (isLoaded) {
      // console.log({ x, y, width, height, sx, sy, sh, sw });

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
