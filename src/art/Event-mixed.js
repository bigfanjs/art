import { eventQueue } from "./art";

export default class Event {
  props = { x: 0, y: 0 };
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

  constructor({
    checkBoundries,
    isInsideOneOfTheAnchors,
    absolute = false,
    initialTransform,
    element,
  }) {
    eventQueue.push(this);

    this.absolute = absolute;

    if (checkBoundries) {
      this.checkBoundries = (point, ctx) => {
        // don't check boundaries while dragging.
        if (this.draggable) return;

        this.isPreviousMouseIn = this.isIn;

        this.isIn = checkBoundries(point, ctx);
      };
    }

    if (isInsideOneOfTheAnchors) {
      this.isInsideOneOfTheAnchors = (point, ctx) => {
        if (this.scalable) return this.anchor;

        this.anchor = isInsideOneOfTheAnchors(point, ctx);

        return this.anchor;
      };
    }

    if (initialTransform) {
      const { x, y } = initialTransform;

      this.props.x = x;
      this.props.y = y;

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
      if (this.draggable) {
        const diffx = mouse.x - this.mouse.x;
        const diffy = mouse.y - this.mouse.y;

        this.mouse = mouse;

        this.update(diffx, diffy);
      }
    };

    this.dragginghandlers = { mousedown, mousemove, mouseup };
  }

  // TODO: end drag
  endDrag() {}

  // this starts as soon as we enable select mode for an element.
  startDraggingAnchors(element) {
    const mousedown = (mouse) => {
      this.scalable = true;
      this.mouse = mouse;

      this.bound = {
        x: element.bounding.minX + this.props.x,
        y: element.bounding.minY + this.props.y,
        width:
          Math.abs(element.bounding.maxX) + Math.abs(element.bounding.minX),
        height:
          Math.abs(element.bounding.maxY) + Math.abs(element.bounding.minY),
      };
    };

    const mouseup = () => {
      this.scalable = false;
    };

    const mousemove = (mouse, anchor) => {
      // console.log({ anchor });

      if (this.scalable) {
        const width = anchor % 2 ? this.bound.width : 0;
        const height = Math.floor(anchor / 3) ? 0 : this.bound.height;

        const diffX = mouse.x - (this.bound.x - width);
        const diffY = mouse.y - (this.bound.y - height);

        const scaleX = 1 - diffX / this.bound.width;
        const scaleY = 1 - diffY / this.bound.height;

        this.mouse = mouse;
        this.props = {
          scaleX,
          scaleY,
          x: this.props.x,
          y: this.props.y,
          rotate: 0,
        };

        this.updateScale(this);
      }
    };

    // these handlers start as soon as we click on of the anchors.
    this.scalingHandlers = { mousedown, mousemove, mouseup };
  }

  schedule(eventName, handler) {
    this[eventName] = handler;
  }

  remove() {
    eventQueue.filter((event) => event !== this);
  }
}
