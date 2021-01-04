import { polygonGetBounds } from "math2d/esm/polygonFunctions/polygonGetBounds";
import { boxTransformBy } from "math2d/esm/boxFunctions/boxTransformBy";

const anchorWidth = 8;
const anchorHeight = 8;

const halfWidth = anchorWidth / 2;
const halfHeight = anchorHeight / 2;

// const matrices = {
//   scaleX: (scaler) => ({ a: scaler, b: 0, c: 0, d: 1, e: 1, f: 1 }),
//   scaleY: (scaler) => ({ a: scaler, b: 0, c: 0, d: 1, e: 1, f: 1 }),
// };

function boundingBoxForHexagon(
  ctx,
  { points, transforms },
  { hover = false } = {}
) {
  const anchors = [];
  let bounding;

  let transformedPoints = points;

  const result = polygonGetBounds(transformedPoints);

  const { x, y, scaleX = 1, scaleY = 1 } = transforms.props ?? {};

  bounding = boxTransformBy(result, {
    a: scaleX, // scaleX
    b: 0,
    c: 0,
    d: scaleY, // scaleY
    e: hover ? x : 0, // translateX
    f: hover ? y : 0, // translateY
  });

  const { minX, minY, maxX, maxY } = bounding;

  if (!hover) {
    ctx.strokeStyle = "#7a0";
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.closePath();
  }

  ctx.fillStyle = "#7a0";

  Array.from(Array(4)).forEach((_, i) => {
    const anchor = new Path2D();
    const x = i % 2 ? minX : maxX;
    const y = Math.floor(i / 2) ? minY : maxY;

    ctx.beginPath();
    ctx.fillStyle = "#7a0";
    anchor.rect(x - halfWidth, y - halfHeight, anchorWidth, anchorHeight);
    if (!hover) ctx.fill(anchor);
    ctx.closePath();

    anchors.push(anchor);
  });

  // what we return here is only for the mouse
  return { anchors, bounding };
}

function boundingForpolygon(
  ctx,
  { points, transforms },
  { hover = false } = {}
) {
  const anchors = [];
  let bounding;

  let transformedPoints = points
    .replace(/,/gi, " ")
    .split(" ")
    .map((p) => parseFloat(p));

  const result = polygonGetBounds(transformedPoints);

  const { x, y, scaleX = 1, scaleY = 1 } = transforms.props ?? {};

  bounding = boxTransformBy(result, {
    a: scaleX, // scaleX
    b: 0,
    c: 0,
    d: scaleY, // scaleY
    e: hover ? x : 0, // translateX
    f: hover ? y : 0, // translateY
  });

  const { minX, minY, maxX, maxY } = bounding;

  if (!hover) {
    ctx.strokeStyle = "#7a0";
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.closePath();
  }

  ctx.fillStyle = "#7a0";

  Array.from(Array(4)).forEach((_, i) => {
    const anchor = new Path2D();
    const x = i % 2 ? minX : maxX;
    const y = Math.floor(i / 2) ? minY : maxY;

    ctx.beginPath();
    ctx.fillStyle = "#7a0";
    anchor.rect(x - halfWidth, y - halfHeight, anchorWidth, anchorHeight);
    if (!hover) ctx.fill(anchor);
    ctx.closePath();

    anchors.push(anchor);
  });

  // what we return here is only for the mouse
  return { anchors, bounding };
}

function boundingForArc(ctx, { x, y, radius }, { hover = false }) {
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

function boundingForRect(
  ctx,
  { x, y, width, height, transforms },
  { hover = false } = {}
) {
  const anchors = [];
  let bounding;

  const transformsProps = transforms.props ?? {};

  bounding = boxTransformBy(
    {
      minX: x - width / 2,
      minY: y - height / 2,
      maxX: x - width / 2 + width,
      maxY: y - height / 2 + height,
    },
    {
      a: transformsProps.scaleX, // scaleX
      b: 0,
      c: 0,
      d: transformsProps.scaleY, // scaleY
      e: hover ? transformsProps.x : 0, // translateX
      f: hover ? transformsProps.y : 0, // translateY
    }
  );

  const { minX, minY, maxX, maxY } = bounding;

  const boundWidth = maxX - minX;
  const boundHeight = maxY - minY;

  if (!hover) {
    ctx.strokeStyle = "#7a0";
    ctx.strokeRect(minX, minY, boundWidth, boundHeight);
  }

  Array.from(Array(4)).forEach((_, i) => {
    const anchor = new Path2D();
    const x = i % 2 ? minX : maxX;
    const y = Math.floor(i / 2) ? minY : maxY;

    ctx.beginPath();
    ctx.fillStyle = "#7a0";

    anchor.rect(x - halfWidth, y - halfHeight, anchorWidth, anchorHeight);

    if (!hover) ctx.fill(anchor);
    ctx.closePath();

    anchors.push(anchor);
  });

  return { anchors, bounding };
}

const boundingBoxes = {
  rect: boundingForRect,
  arc: boundingForArc,
  polygon: boundingForpolygon,
  hexagon: boundingBoxForHexagon,
};

export default boundingBoxes;
