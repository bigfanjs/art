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
    const array = points.split(" ").map((point) => {
      const [x, y] = point.split(",");

      return { x, y };
    });

    ctx.beginPath();

    ctx.fillStyle = color;
    ctx.moveTo(array[0].x, array[0].y);
    array.filter((_, idx) => idx !== 0).forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.closePath();

    ctx.fill();
  },
  text: (ctx, { x, y, text, size, fontFamily = "Arial", color }) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = `${size}px ${fontFamily}`;
    ctx.fillText(text, x, y);
  },
  hexagon: (ctx, { x, y, radius, color }) => {
    ctx.beginPath();
    ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));

    for (let side = 0; side < 7; side++) {
      ctx.lineTo(
        x + radius * Math.cos((side * 2 * Math.PI) / 6),
        y + radius * Math.sin((side * 2 * Math.PI) / 6)
      );
    }

    ctx.fillStyle = color;
    ctx.fill();
  },
};

export default primitives;
