import { polygonGetBounds } from "math2d/esm/polygonFunctions/polygonGetBounds";
import { boxTransformBy } from "math2d/esm/boxFunctions/boxTransformBy";
import { vecTransformBy } from "math2d/esm/vecFunctions/vecTransformBy";

const anchorWidth = 16;
const anchorHeight = 16;

const halfWidth = anchorWidth / 2;
const halfHeight = anchorHeight / 2;

function boundingBoxForHexagon(ctx, { points, transforms }) {
  const anchors = [];
  const result = polygonGetBounds(points);
  const { scaleX = 1, scaleY = 1 } = transforms.props ?? {};
  const bounding = boxTransformBy(result, {
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

  return { anchors, bounding };
}

function boundingForpolygon(ctx, { points, transforms }) {
  const anchors = [];
  const transformedPoints = points
    .replace(/,/gi, " ")
    .split(" ")
    .map((p) => parseFloat(p));
  const result = polygonGetBounds(transformedPoints);
  const { scaleX = 1, scaleY = 1 } = transforms.props ?? {};
  const bounding = boxTransformBy(result, {
    a: scaleX,
    b: 0,
    c: 0,
    d: scaleY,
    e: 0,
    f: 0,
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

function boundingForArc(ctx, { x, y, radius, transforms }) {
  const anchors = [];
  const { scaleX = 1, scaleY = 1 } = transforms.props ?? {};
  const bounding = boxTransformBy(
    {
      minX: x - radius,
      minY: y - radius,
      maxX: x - radius + radius * 2,
      maxY: y - radius + radius * 2,
    },
    { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 }
  );

  const { minX, minY, maxX, maxY } = bounding;
  const boundWidth = maxX - minX;
  const boundHeight = maxY - minY;

  ctx.strokeStyle = "#7a0";
  ctx.strokeRect(minX, minY, boundWidth, boundHeight);

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

function boundingForRect(ctx, { x, y, width, height, transforms }) {
  const anchors = [];
  const { scaleX = 1, scaleY = 1 } = transforms.props ?? {};
  const bounding = boxTransformBy(
    {
      minX: x - width / 2,
      minY: y - height / 2,
      maxX: x - width / 2 + width,
      maxY: y - height / 2 + height,
    },
    { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 }
  );

  const { minX, minY, maxX, maxY } = bounding;
  const boundWidth = maxX - minX;
  const boundHeight = maxY - minY;

  ctx.strokeStyle = "#7a0";
  ctx.strokeRect(minX, minY, boundWidth, boundHeight);

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

function boundingForText(
  ctx,
  { x, y, text, size, baseLine, textAlign, fontFamily, transforms }
) {
  ctx.textBaseline = baseLine;
  ctx.textAlign = textAlign;
  ctx.font = `${size}px ${fontFamily}`;

  const anchors = [];
  const textMetrics = ctx.measureText(text);
  const { scaleX = 1, scaleY = 1 } = transforms.props ?? {};
  const Descent = textMetrics.actualBoundingBoxDescent;
  const Ascent = textMetrics.actualBoundingBoxAscent;
  const TextHalfHeight = (Descent + Ascent) / 2;
  const Left = textMetrics.actualBoundingBoxLeft;
  const Right = textMetrics.actualBoundingBoxRight;
  const TextHalfWidth = (Right + Left) / 2;

  const bounding = boxTransformBy(
    {
      minY: y - TextHalfHeight,
      maxY: y + Descent + Ascent - TextHalfHeight,
      minX: x - TextHalfWidth,
      maxX: x + Right + Left - TextHalfWidth,
    },
    { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 }
  );

  const { minX, minY, maxX, maxY } = bounding;

  const boundWidth = maxX - minX;
  const boundHeight = maxY - minY;

  ctx.strokeStyle = "#7a0";
  ctx.strokeRect(minX, minY, boundWidth, boundHeight);

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

function boundingForImage(ctx, { image, x, y, width, height, transforms }) {
  const anchors = [];
  const { scaleX = 1, scaleY = 1 } = transforms.props ?? {};
  const rectWidth = width || image.width;
  const rectHeight = height || image.height;
  const bounding = boxTransformBy(
    {
      minX: x - rectWidth / 2,
      minY: y - rectHeight / 2,
      maxX: x - rectWidth / 2 + rectWidth,
      maxY: y - rectHeight / 2 + rectHeight,
    },
    { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 }
  );

  const { minX, minY, maxX, maxY } = bounding;
  const boundWidth = maxX - minX;
  const boundHeight = maxY - minY;

  ctx.strokeStyle = "#7a0";
  ctx.strokeRect(minX, minY, boundWidth, boundHeight);

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

function boundlingForLine(ctx, { x1, y1, x2, y2, transforms }) {
  const anchors = [];
  const { scaleX = 1, scaleY = 1 } = transforms?.props ?? {};
  const isAnchorTransitionActive = transforms?.isAnchorTransitionActive;

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

  const deltaX = P2.x - P1.x;
  const deltaY = P2.y - P1.y;

  const radiusX = deltaX / 2;
  const radiusY = deltaY / 2;

  [P1, P2].forEach(({ x, y }, i) => {
    const anchor = new Path2D();
    const index = i % 2 ? 1 : -1;
    const diffx = isAnchorTransitionActive ? x : radiusX * index;
    const diffy = isAnchorTransitionActive ? y : radiusY * index;
    const angle = Math.atan2(deltaY * index, deltaX * index);

    ctx.save();
    ctx.translate(diffx, diffy);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.fillStyle = "#7a0";

    anchor.rect(
      x - halfWidth - diffx,
      y - halfHeight - diffy,
      anchorWidth,
      anchorHeight
    );

    ctx.fill(anchor);
    ctx.closePath();

    anchors.push(anchor);
    ctx.restore();
  });

  return { bounding: { P1, P2 }, anchors };
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
