/**

const pin = j >= depth ? { x, y } : {};

points.push({ x, y, px: x, py: y, pinx: pin.x, piny: pin.y });

j > 0 && constraints.push([{ x, y }, points[(points.length - 1) * (1 % j)]]);

i > 0 && j < depth && constraints.push([{ x, y }, points[j + (i - 1) * depth]]);

i >= resolution &&
  j < depth &&
  constraints.push({ x, y }, points[j + (i - resolution) * depth]);


 */
