const primitives = {
  rect: (ctx, { x, y, width, height, color }) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    ctx.fill();
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
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, start, end, isCounterclockwise);
    ctx.fill();
  },
  polygon: (ctx, { points, color }) => {
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

    ctx.fillStyle = color;
    ctx.fill(path);
    path.closePath();

    return path;
  },
  text: (ctx, { x, y, text, size, fontFamily = "Arial", color }) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = `${size}px ${fontFamily}`;
    ctx.fillText(text, x, y);
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
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  },
};

export default primitives;
