import { polygonGetBounds } from "math2d/esm/polygonFunctions/polygonGetBounds";

const anchorWidth = 8;
const anchorHeight = 8;

const halfWidth = anchorWidth / 2;
const halfHeight = anchorHeight / 2; 

const primitives = {
  rect: (ctx, { x, y, width, height, color }, highlight) => {
    const path = new Path2D();
    const anchors = []

    ctx.beginPath();
    ctx.fillStyle = color;
    path.rect(x, y, width, height);
    ctx.fill(path);

    if (highlight) {
      ctx.strokeStyle = "#7a0";
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "#7a0";
      Array.from(Array(4)).forEach((_, i) => {
        const anchorX = i % 2 ? x : x + width;
        const anchorY = Math.floor(i / 2) ? y : y + height;

        ctx.fillRect(
          anchorX - halfWidth,
          anchorY - halfHeight,
          anchorWidth,
          anchorHeight
        );
      });
    }

    return { path, anchors };
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
    highlight
  ) => {
    const path = new Path2D();
    const anchors = [];

    ctx.beginPath();
    ctx.fillStyle = color;
    path.arc(x, y, radius, start, end, isCounterclockwise);
    ctx.fill(path);

    if (highlight) {
      ctx.strokeStyle = "#7a0";
      ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);

      ctx.fillStyle = "#7a0";
      Array.from(Array(4)).forEach((_, i) => {
        const anchorX = i % 2 ? x - radius : x + radius;
        const anchorY = Math.floor(i / 2) ? y - radius : y + radius;

        ctx.fillRect(
          anchorX - halfWidth,
          anchorY - halfHeight,
          anchorWidth,
          anchorHeight
        );
      });
    }

    return { path, anchors };
  },
  polygon: (ctx, { points, color, stroke }, highlight) => {
    const path = new Path2D();
    const array = points.split(" ").map((point) => {
      const [x, y] = point.split(",");

      return { x, y };
    });
    const anchors = [];

    ctx.beginPath();
    path.moveTo(array[0].x, array[0].y);
    array
      .filter((_, idx) => idx !== 0)
      .forEach(({ x, y }) => path.lineTo(x, y));

    ctx[stroke ? "strokeStyle" : "fillStyle"] = color;
    stroke ? ctx.stroke(path) : ctx.fill(path);
    path.closePath();

    if (highlight) {
      const array = points.split(",").join(" ").split(" ");

      const result = polygonGetBounds(array);
      const { minX, minY, maxX, maxY } = result;

      ctx.strokeStyle = "#7a0";
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

      ctx.fillStyle = "#7a0";
      Array.from(Array(4)).forEach((_, i) => {
        const x = i % 2 ? minX : maxX
        const y = Math.floor(i / 2) ? minY : maxY

        ctx.fillRect(
          x - halfWidth,
          y - halfHeight,
          anchorWidth,
          anchorHeight
        );
      })
    }

    return { path, anchors };
  },
  text: (
    ctx,
    { x, y, text, size, fontFamily = "verdana", baseLine, color }
  ) => {
    const dimensions = {};
    const anchors = [];

    ctx.beginPath();
    ctx.font = `${size}px ${fontFamily}`;
    ctx.textBaseline = baseLine;

    dimensions.width = ctx.measureText(text).width;
    dimensions.height = size;

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

    return dimensions;
  },
  hexagon: (ctx, { x, y, radius, color }, highlight) => {
    const path = new Path2D();
    const points = [];
    const anchors = []
    let bounding

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

    ctx.fillStyle = color;
    ctx.fill(path);
    path.closePath();

    if (highlight) {
      const result = polygonGetBounds(points);
      const { minX, minY, maxX, maxY } = result;

      bounding = result;

      ctx.strokeStyle = "#7a0";
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      ctx.closePath()

      ctx.fillStyle = "#7a0";
      Array.from(Array(4)).forEach((_, i) => {
        const anchor = new Path2D();
        const x = i % 2 ? minX : maxX;
        const y = Math.floor(i / 2) ? minY : maxY;

        ctx.beginPath();
        ctx.fillStyle = "#7a0";
        anchor.rect(x - halfWidth, y - halfHeight, anchorWidth, anchorHeight);
        ctx.fill(anchor);
        ctx.closePath()

        anchors.push(anchor);
      });
    }

    return { path, anchors, bounding };
  },
  line: (ctx, { x1, y1, x2, y2, color }) => {
    const path = new Path2D();

    ctx.beginPath();
    ctx.strokeStyle = color;
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
    ctx.stroke(path);

    return path;
  },
  img: (
    ctx,
    { x, y, width, height, dx, dy, dw, dh },
    highlight,
    image,
    isLoaded = false
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
