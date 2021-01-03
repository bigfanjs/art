export default function getPolygonCentroid(pts) {
  const points = pts.split(" ").map((point) => {
    const [xx, yy] = point.split(",");

    return { x: parseFloat(xx), y: parseFloat(yy) };
  });

  let first = points[0],
    last = points[points.length - 1];

  if (first.x !== last.x || first.y !== last.y) points.push(first);

  let twicearea = 0,
    x = 0,
    y = 0,
    nPts = points.length,
    p1,
    p2,
    f;

  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = points[i];
    p2 = points[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }

  f = twicearea * 3;
  return { x: x / f, y: y / f };
}
