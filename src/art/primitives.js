const primitives = {
  rect: (ctx, { x, y, width, height, color }) => {
    const path = new Path2D();

    ctx.beginPath();
    ctx.fillStyle = color;
    path.rect(x, y, width, height);
    ctx.fill(path);

    return path;
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
    const path = new Path2D();

    ctx.beginPath();
    ctx.fillStyle = color;
    path.arc(x, y, radius, start, end, isCounterclockwise);
    ctx.fill(path);

    return path;
  },
  polygon: (ctx, { points, color, stroke }) => {
    const path = new Path2D();
    const array = points.split(" ").map((point) => {
      const [x, y] = point.split(",");

      return { x, y };
    });

    ctx.beginPath();
    path.moveTo(array[0].x, array[0].y);
    array
      .filter((_, idx) => idx !== 0)
      .forEach(({ x, y }) => path.lineTo(x, y));

    ctx[stroke ? "strokeStyle" : "fillStyle"] = color;
    stroke ? ctx.stroke(path) : ctx.fill(path);
    path.closePath();

    return path;
  },
  text: (
    ctx,
    { x, y, text, size, fontFamily = "verdana", baseLine, color }
  ) => {
    const dimensions = {};

    ctx.beginPath();
    ctx.font = `${size}px ${fontFamily}`;
    ctx.textBaseline = baseLine;

    dimensions.width = ctx.measureText(text).width;
    dimensions.height = size;

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

    return dimensions;
  },
  hexagon: (ctx, { x, y, radius, color }) => {
    const path = new Path2D();

    ctx.beginPath();
    path.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));

    for (let side = 0; side < 7; side++) {
      path.lineTo(
        x + radius * Math.cos((side * 2 * Math.PI) / 6),
        y + radius * Math.sin((side * 2 * Math.PI) / 6)
      );
    }

    ctx.fillStyle = color;
    ctx.fill(path);
    path.closePath();

    return path;
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
