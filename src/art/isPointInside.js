export function isPointInPath(path, point, ctx) {
  ctx.isPointInPath(path, point.x, point.y);
}

export function isPointInRect(rect, point) {
  const isIn =
    point.x >= rect.x &&
    point.y >= rect.y &&
    point.x < rect.x + rect.width &&
    point.y < rect.y + rect.height;

  return isIn;
}

export function isPointInCircle(circle, point) {
  const diffX = point.x - circle.x;
  const diffY = point.y - circle.y;
  const dist = Math.sqrt(diffX * diffX + diffY * diffY);
  const isIn = dist <= circle.radius;

  return isIn;
}
