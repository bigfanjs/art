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

  // if (hover) {
  //   const { x, y } = transforms.props;

  //   transformedPoints =
  //     points &&
  //     points.map((point, idx) => {
  //       return idx % 2 ? point + y : point + x;
  //     });
  // }

  const result = polygonGetBounds(transformedPoints);
  // const { minX, minY, maxX, maxY } = result;

  // let matrix;

  // if (scaleX) matrix = matrices["scaleX"](scaleX);

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

function boundingForpolygon(ctx, { points }, { hover = false }) {
  const array = points.split(",").join(" ").split(" ");

  const result = polygonGetBounds(array);
  const { minX, minY, maxX, maxY } = result;

  ctx.strokeStyle = "#7a0";
  ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
  ctx.fillStyle = "#7a0";

  Array.from(Array(4)).forEach((_, i) => {
    const x = i % 2 ? minX : maxX;
    const y = Math.floor(i / 2) ? minY : maxY;

    ctx.fillRect(x - halfWidth, y - halfHeight, anchorWidth, anchorHeight);
  });
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

function boundingForRect(ctx, { x, y, width, height }, { hover = false }) {
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
};

export default boundingBoxes;
