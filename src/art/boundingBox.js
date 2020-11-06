import { polygonGetBounds } from "math2d/esm/polygonFunctions/polygonGetBounds";
import { boxTransformBy } from "math2d/esm/boxFunctions/boxTransformBy";

const anchorWidth = 8;
const anchorHeight = 8;

const halfWidth = anchorWidth / 2;
const halfHeight = anchorHeight / 2; 

const matrices = {
  scaleX: (scaler) => ({ a: scaler, b: 0, c: 0, d: 1, e: 1, f: 1 }),
  scaleY: (scaler) => ({ a: scaler, b: 0, c: 0, d: 1, e: 1, f: 1 }),
};

function boundingBoxForHexagon(ctx, { points, transforms }) {
  const anchors = [];
  let bounding;

  const result = polygonGetBounds(points);
  // const { minX, minY, maxX, maxY } = result;

  let matrix;

  // if (scaleX) matrix = matrices["scaleX"](scaleX);

  bounding = boxTransformBy(result, {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 1,
    f: 1,
  });

  const { minX, minY, maxX, maxY } = bounding;

  ctx.strokeStyle = "#7a0";
  ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
  ctx.closePath();

  ctx.fillStyle = "#7a0";
  Array.from(Array(4)).forEach((_, i) => {
    const anchor = new Path2D();
    const x = i % 2 ? minX : maxX;
    const y = Math.floor(i / 2) ? minY : maxY;

    ctx.beginPath();
    ctx.fillStyle = "#7a0";
    anchor.rect(x - halfWidth, y - halfHeight, anchorWidth, anchorHeight);
    ctx.fill(anchor);
    ctx.closePath();

    anchors.push(anchor);
  });

  return { anchors, bounding };
}

function boundingForpolygon(ctx, {points}) {
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

function boundingForArc(ctx, {x, y, radius}) {
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

function boundingForRect(ctx, { x, y, width, height }) {
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

const boundingBoxes = {
  rect: boundingForRect,
  arc: boundingForArc,
  polygon: boundingForpolygon,
  hexagon: boundingBoxForHexagon,
}

export default boundingBoxes