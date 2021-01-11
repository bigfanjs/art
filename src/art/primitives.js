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

    const baseLinesTypes = [
      "top",
      "hanging",
      "bottom",
      "ideographic",
      "middle",
    ];
    const textAlignTypes = ["start", "end", "left", "center", "right"];

    const textMetrics = ctx.measureText(text);
    const baseLineType = baseLinesTypes.find((bl) => bl === baseLine) || "top";
    const textAlignType =
      textAlignTypes.find((ta) => ta === textAlign) || "left";

    let offsetX;
    let offsetY;

    const descent = y + textMetrics.actualBoundingBoxDescent; // maxy
    const ascent = y - textMetrics.actualBoundingBoxAscent; // miny
    const left = x + textMetrics.actualBoundingBoxLeft;
    const right = x - textMetrics.actualBoundingBoxRight;

    // const diffY = descent - (descent - ascent) / 2;

    // vertical aligntment
    switch (baseLineType) {
      case "middle":
        offsetY = 0;
        break;
      case "hanging":
      case "top":
        offsetY = (descent - ascent) / 2;
        break;
      case "bottom":
      case "ideographic":
        offsetY = -((descent - ascent) / 2);
        break;
      default:
        break;
    }

    // horizontal aligntment
    switch (textAlignType) {
      case "center":
        offsetX = 0;
        break;
      case "left" || "start":
        offsetX = (left - right) / 2;
        break;
      case "right" || "end":
        offsetX = -((left - right) / 2);
        break;
      default:
        break;
    }

    const diffY = textMetrics.actualBoundingBoxAscent - (descent - ascent) / 2;

    if (hover) {
      const result = boxTransformBy(
        {
          minX: x - textMetrics.actualBoundingBoxLeft - offsetX,
          minY: y - textMetrics.actualBoundingBoxAscent - offsetY, // here
          maxX: x + textMetrics.actualBoundingBoxRight - offsetX,
          maxY: y + textMetrics.actualBoundingBoxDescent - offsetY, // here
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
      ctx.fillText(text, x - offsetX, y + diffY);

      // ctx.fillText(text, x - width / 2, y - height);
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
