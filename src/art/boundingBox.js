import { polygonGetBounds } from "math2d/esm/polygonFunctions/polygonGetBounds";
import { boxTransformBy } from "math2d/esm/boxFunctions/boxTransformBy";

const anchorWidth = 16;
const anchorHeight = 16;

const halfWidth = anchorWidth / 2;
const halfHeight = anchorHeight / 2;

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

function boundingForArc(
  ctx,
  { x, y, radius, transforms },
  { hover = false } = {}
) {
  const anchors = [];
  let bounding;

  const transformsProps = transforms.props ?? {};

  bounding = boxTransformBy(
    {
      minX: x - radius,
      minY: y - radius,
      maxX: x - radius + radius * 2,
      maxY: y - radius + radius * 2,
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

function boundingForText(
  ctx,
  { x, y, text, size, baseLine, fontFamily, transforms },
  { hover = false } = {}
) {
  const anchors = [];
  // const baseLinesTypes = ["alphabetic", "ideographic", "bottom"];
  // const baseLineType = baseLinesTypes.find((bl) => bl === baseLine);
  // const isCenterBaseLine = baseLine === "middle";
  // const height = size;

  ctx.textBaseline = baseLine;
  ctx.font = `${size}px ${fontFamily}`;

  const textMetrics = ctx.measureText(text);
  const width = textMetrics.width;
  // const Y = y - (baseLineType ? height : isCenterBaseLine ? height / 2 : 0);

  let bounding;
  const actualHeight =
    textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
  const height = actualHeight;

  const transformsProps = transforms.props ?? {};

  bounding = boxTransformBy(
    {
      minX: x - width / 2,
      minY: y - height / 2,
      maxX: x + width / 2,
      maxY: y + height / 2,
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
  text: boundingForText,
};

export default boundingBoxes;
