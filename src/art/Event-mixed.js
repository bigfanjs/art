import { eventQueue } from "./art";

export default class Event {
  props = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
  click = null;
  mousemove = null;
  mousedown = null;
  type = null;
  index = null;
  isIn = false;
  isPreviousMouseIn = false;
  dragginghandlers = null;
  draggable = false;
  selected = false;
  previousScaleX = 1;
  previousScaleY = 1;
  anchorTransition = { x: 0, y: 0 };

  constructor({ absolute = false, selected, element }) {
    eventQueue.push(this);

    this.absolute = absolute;

    this.checkBoundries = (point, ctx) => {
      // don't check boundaries while dragging.
      if (this.draggable) return;

      this.isPreviousMouseIn = this.isIn;

      this.isIn = element.checkBoundries(point, ctx);
    };

    this.isInsideOneOfTheAnchors = (point, ctx) => {
      if (this.scalable) return this.anchor;

      this.anchor = element.isInsideOneOfTheAnchors(point, ctx);

      return this.anchor;
    };

    if (selected) {
      const { x = 0, y = 0, scale = 1 } = element.transform || {};

      // TODO support polygons:

      this.props.x = element.props.x + x;
      this.props.y = element.props.y + y;

      this.props.scaleX = scale;
      this.props.scaleY = scale;
      this.previousScaleX = scale;
      this.previousScaleY = scale;

      element.updateScale(this);
    }
  }

  startDrag() {
    const mousedown = (mouse) => {
      this.draggable = true;
      this.mouse = mouse;
    };
    const mouseup = () => (this.draggable = false);
    const mousemove = (mouse) => {
      if (this.draggable && !this.scalable) {
        const diffx = mouse.x - this.mouse.x;
        const diffy = mouse.y - this.mouse.y;

        this.mouse = mouse;

        this.props = {
          x: this.props.x + diffx,
          y: this.props.y + diffy,
          scaleX: this.props.scaleX,
          scaleY: this.props.scaleY,
        };

        this.updateScale(this);
      }
    };

    this.dragginghandlers = { mousedown, mousemove, mouseup };
  }

  // TODO: end drag
  endDrag() {}

  // this starts as soon as we enable select mode for an element.
  startDraggingAnchors(element) {
    const mousedown = (mouse, anchor) => {
      this.scalable = true;
      this.mouse = mouse;

      if (element.type === "line") {
        const P1 = element.bounding.P1;
        const P2 = element.bounding.P2;

        this.bound = {
          x1: P1.x + this.props.x,
          y1: P1.y + this.props.y,
          x2: P2.x + this.props.x,
          y2: P2.y + this.props.y,

          diffX: Math.abs(P1.x - P2.x),
          diffY: Math.abs(P1.y - P2.y),
        };

        this.initialBounds = {
          diffX: this.bound.diffX / this.previousScaleX,
          diffY: this.bound.diffY / this.previousScaleY,
        };

        const diffX = Math.abs(P1.x - P2.x) / 2;
        const diffY = Math.abs(P1.y - P2.y) / 2;

        const clickedPoint = [P1, P2][anchor - 1];
        const otherPoint = [P2, P1][anchor - 1];

        const isClickedPointBiggerX = clickedPoint.x > otherPoint.x;
        const isClickedPointBiggerY = clickedPoint.y > otherPoint.y;

        this.isClickedPointBiggerX = isClickedPointBiggerX;
        this.isClickedPointBiggerY = isClickedPointBiggerY;

        this.anchorTransition = {
          x: isClickedPointBiggerX ? -diffX : diffX,
          y: isClickedPointBiggerY ? -diffY : diffY,
        };

        const initialHalfDiffX = this.initialBounds.diffX / 2;
        const initialHalfDiffY = this.initialBounds.diffY / 2;

        const { x1, y1, x2, y2 } = element.props;

        this.anchorTransitionPos = {
          x1:
            x1 + (isClickedPointBiggerX ? initialHalfDiffX : -initialHalfDiffX),
          y1:
            y1 + (isClickedPointBiggerY ? initialHalfDiffY : -initialHalfDiffY),

          x2:
            x2 + (isClickedPointBiggerX ? initialHalfDiffX : -initialHalfDiffX),
          y2:
            y2 + (isClickedPointBiggerY ? initialHalfDiffY : -initialHalfDiffY),

          x: isClickedPointBiggerX ? initialHalfDiffX : -initialHalfDiffX,
          y: isClickedPointBiggerY ? initialHalfDiffY : -initialHalfDiffY,
        };
      } else {
        // NOT line elements
        this.bound = {
          x: element.bounding.minX + this.props.x,
          y: element.bounding.minY + this.props.y,
          width:
            Math.abs(element.bounding.maxX) + Math.abs(element.bounding.minX),
          height:
            Math.abs(element.bounding.maxY) + Math.abs(element.bounding.minY),
        };

        this.initialBounds = {
          width: this.bound.width / this.previousScaleX,
          height: this.bound.height / this.previousScaleY,
        };

        const halfWidth = this.bound.width / 2;
        const halfHeight = this.bound.height / 2;

        const initialHalfWidth = this.initialBounds.width / 2;
        const initialHalfHeight = this.initialBounds.height / 2;

        this.anchorTransition = {
          x: anchor % 2 ? -halfWidth : halfWidth,
          y: Math.floor(anchor / 3) ? halfHeight : -halfHeight,
        };

        if (element.type === "polygon") {
          const newPoints =
            element.props.points &&
            element.props.points
              .split(" ")
              .map((point) => {
                const [xx, yy] = point.split(",");

                return {
                  x:
                    parseFloat(xx) +
                    (anchor % 2 ? initialHalfWidth : -initialHalfWidth),
                  y:
                    parseFloat(yy) +
                    (Math.floor(anchor / 3)
                      ? -initialHalfHeight
                      : initialHalfHeight),
                };
              })
              .reduce((sum, { x, y }) => `${sum} ${x},${y}`, "")
              .trim();

          this.anchorTransitionPos = {
            points: newPoints,
            x: anchor % 2 ? initialHalfWidth : -initialHalfWidth,
            y: Math.floor(anchor / 3) ? -initialHalfHeight : initialHalfHeight,
          };
        } else {
          this.anchorTransitionPos = {
            x: anchor % 2 ? initialHalfWidth : -initialHalfWidth,
            y: Math.floor(anchor / 3) ? -initialHalfHeight : initialHalfHeight,
          };
        }
      }
    };

    const mouseup = () => {
      this.scalable = false;

      this.previousScaleX = this.props.scaleX;
      this.previousScaleY = this.props.scaleY;

      this.props.x =
        this.props.x +
        this.anchorTransition.x +
        this.anchorTransitionPos.x * this.props.scaleX;

      this.props.y =
        this.props.y +
        this.anchorTransition.y +
        this.anchorTransitionPos.y * this.props.scaleY;

      if (element.type === "polygon") {
        const newPoints =
          element.props.points &&
          element.props.points
            .split(" ")
            .map((point) => {
              const [xx, yy] = point.split(",");

              return { x: parseFloat(xx), y: parseFloat(yy) };
            })
            .reduce((sum, { x, y }) => `${sum} ${x},${y}`, "")
            .trim();

        this.anchorTransitionPos.points = newPoints;
        this.anchorTransitionPos.x = 0;
        this.anchorTransitionPos.y = 0;
      } else if (element.type === "line") {
        const { x1, y1, x2, y2 } = element.props;

        this.anchorTransitionPos.x1 = x1;
        this.anchorTransitionPos.y1 = y1;
        this.anchorTransitionPos.x2 = x2;
        this.anchorTransitionPos.y2 = y2;

        this.anchorTransitionPos.x = 0;
        this.anchorTransitionPos.y = 0;
      } else {
        this.anchorTransitionPos.x = 0;
        this.anchorTransitionPos.y = 0;
      }

      this.anchorTransition.x = 0;
      this.anchorTransition.y = 0;

      this.updateScale(this);
    };

    const mousemove = (mouse, anchor) => {
      if (this.scalable) {
        if (element.type === "line") {
          const diffX = mouse.x - [this.bound.x1, this.bound.x2][anchor - 1];
          const diffY = mouse.y - [this.bound.y1, this.bound.y2][anchor - 1];

          const scaleX =
            this.previousScaleX -
            (this.isClickedPointBiggerX ? -diffX : diffX) /
              this.initialBounds.diffX;

          const scaleY =
            this.previousScaleY -
            (this.isClickedPointBiggerY ? -diffY : diffY) /
              this.initialBounds.diffY;

          this.mouse = mouse;

          this.props = {
            scaleX,
            scaleY,
            x: this.props.x || this.bound.x + this.bound.width / 2,
            y: this.props.y || this.bound.y + this.bound.height / 2,
            rotate: 0,
          };
        } else {
          const width = anchor % 2 ? this.bound.width : 0;
          const height = Math.floor(anchor / 3) ? 0 : this.bound.height;

          const diffX = mouse.x - (this.bound.x + width);
          const diffY = mouse.y - (this.bound.y + height);

          const scaleX =
            this.previousScaleX -
            (anchor % 2 ? diffX * -1 : diffX) / this.initialBounds.width;

          const scaleY =
            this.previousScaleY -
            (Math.floor(anchor / 3) ? diffY : diffY * -1) /
              this.initialBounds.height;

          const { x1, y1, x2, y2 } = this.bound;

          this.mouse = mouse;
          this.props = {
            scaleX,
            scaleY,
            x: this.props.x || Math.min(x1, x2) + Math.abs(x1 - x2) / 2,
            y: this.props.y || Math.min(y1, y2) + Math.abs(y1 - y2) / 2,
            rotate: 0,
          };
        }

        this.updateScale(this);
      }
    };

    // these handlers start as soon as we click on of the anchors.
    this.scalingHandlers = { mousedown, mousemove, mouseup };
  }

  // TODO: clean up scaling:
  endDraggingAnchors() {}

  schedule(eventName, handler) {
    this[eventName] = handler;
  }

  remove() {
    eventQueue.filter((event) => event !== this);
  }
}
