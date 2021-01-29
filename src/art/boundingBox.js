import { polygonGetBounds } from "math2d/esm/polygonFunctions/polygonGetBounds";
import { boxTransformBy } from "math2d/esm/boxFunctions/boxTransformBy";
import { vecTransformBy } from "math2d/esm/vecFunctions/vecTransformBy";

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

  const { scaleX = 1, scaleY = 1 } = transforms.props ?? {};

  // console.log({ x, y });

  bounding = boxTransformBy(result, {
    a: scaleX, // scaleX
    b: 0,
    c: 0,
    d: scaleY, // scaleY
    e: 0, // translateX
    f: 0, // translateY
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
  { x, y, text, size, baseLine, textAlign, fontFamily, transforms },
  { hover = false } = {}
) {
  const anchors = [];

  ctx.textBaseline = baseLine;
  ctx.textAlign = textAlign;
  ctx.font = `${size}px ${fontFamily}`;

  const textMetrics = ctx.measureText(text);

  let bounding;

  const transformsProps = transforms.props ?? {};

  const Descent = textMetrics.actualBoundingBoxDescent;
  const Ascent = textMetrics.actualBoundingBoxAscent;
  const TextHalfHeight = (Descent + Ascent) / 2;

  const Left = textMetrics.actualBoundingBoxLeft;
  const Right = textMetrics.actualBoundingBoxRight;
  const TextHalfWidth = (Right + Left) / 2;

  bounding = boxTransformBy(
    {
      minY: y - TextHalfHeight,
      maxY: y + Descent + Ascent - TextHalfHeight,
      minX: x - TextHalfWidth,
      maxX: x + Right + Left - TextHalfWidth,
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

function boundingForImage(
  ctx,
  { image, x, y, width, height, transforms },
  { hover = false } = {}
) {
  const anchors = [];
  let bounding;

  const transformsProps = transforms.props ?? {};

  const rectWidth = width || image.width;
  const rectHeight = height || image.height;

  bounding = boxTransformBy(
    {
      minX: x - rectWidth / 2,
      minY: y - rectHeight / 2,
      maxX: x - rectWidth / 2 + rectWidth,
      maxY: y - rectHeight / 2 + rectHeight,
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

function boundlingForLine(ctx, { x1, y1, x2, y2, transforms }) {
  const anchors = [];

  const { scaleX = 1, scaleY = 1 } = transforms?.props ?? {};

  const P1 = vecTransformBy(
    { x: x1, y: y1 },
    { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 }
  );

  const P2 = vecTransformBy(
    { x: x2, y: y2 },
    { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 }
  );

  const strokeHighlight = new Path2D();

  ctx.strokeStyle = "#7a0";
  strokeHighlight.moveTo(P1.x, P1.y);
  strokeHighlight.lineTo(P2.x, P2.y);
  ctx.stroke(strokeHighlight);
  ctx.closePath();

  ctx.fillStyle = "#7a0";

  Array.from(Array(4)).forEach((_, i) => {
    const anchor = new Path2D();
    const x = i % 2 ? P1.x : P2.x;
    const y = Math.floor(i / 2) ? P1.y : P2.y;

    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.fillStyle = "#7a0";
      anchor.rect(x - halfWidth, y - halfHeight, anchorWidth, anchorHeight);
      ctx.fill(anchor);
      ctx.closePath();
    }

    anchors.push(anchor);
  });

  return {
    bounding: { minX: P1.x, minY: P1.y, maxX: P2.x, maxY: P2.y },
    anchors,
  };
}

const boundingBoxes = {
  rect: boundingForRect,
  arc: boundingForArc,
  polygon: boundingForpolygon,
  hexagon: boundingBoxForHexagon,
  text: boundingForText,
  img: boundingForImage,
  line: boundlingForLine,
};

export default boundingBoxes;
