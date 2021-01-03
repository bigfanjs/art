import { polygonTransformBy } from "math2d/esm/polygonFunctions/polygonTransformBy";
import { boxTransformBy } from "math2d/esm/boxFunctions/boxTransformBy";

const primitives = {
  rect: (
    ctx,
    { x, y, width, height, color },
    { hover = false, transforms = {} }
  ) => {
    let path = new Path2D();

    ctx.beginPath();
    ctx.fillStyle = color;
    path.rect(x - width / 2, y - height / 2, width, height);

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

      // console.log({ minX: result.minX, maxX: result.maxX, x, width });

      const hoverpath = new Path2D();

      ctx.beginPath();

      hoverpath.rect(result.minX, result.minY, 100, 100);

      path = hoverpath;
    }

    if (!hover) ctx.fill(path);

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
    { hover = false }
  ) => {
    const path = new Path2D();

    ctx.beginPath();
    ctx.fillStyle = color;
    path.arc(x, y, radius, start, end, isCounterclockwise);
    if (!hover) ctx.fill(path);
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
    }

    if (!hover) {
      ctx[stroke ? "strokeStyle" : "fillStyle"] = color;
      stroke ? ctx.stroke(path) : ctx.fill(path);
    }
    path.closePath();

    return { path, points };
  },
  text: (
    ctx,
    { x, y, text, size, fontFamily = "verdana", baseLine, color },
    { hover = false }
  ) => {
    const dimensions = {};

    ctx.beginPath();
    ctx.font = `${size}px ${fontFamily}`;
    ctx.textBaseline = baseLine;

    dimensions.width = ctx.measureText(text).width;
    dimensions.height = size;

    ctx.fillStyle = color;
    if (!hover) ctx.fillText(text, x, y);

    return dimensions;
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
    { x, y, width, height, dx, dy, dw, dh },
    { image, isLoaded = false }
  ) => {
    if (isLoaded) {
      if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof width === "number" &&
        typeof height === "number" &&
        typeof dx === "number" &&
        typeof dy === "number" &&
        typeof dw === "number" &&
        typeof dh === "number"
      ) {
        ctx.drawImage(image, x, y, width, height, dx, dy, dw, dh);
      } else if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof width === "number" &&
        typeof height === "number"
      )
        ctx.drawImage(image, x, y, width, height);
      else if (typeof x === "number" && typeof y === "number")
        ctx.drawImage(image, x, y);
    }
  },
};

export default primitives;
