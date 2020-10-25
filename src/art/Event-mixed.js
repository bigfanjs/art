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

  constructor({ checkBoundries, isInsideOneOfTheAnchors, absolute = false }) {
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
        if (this.scalable) return this.anchor

        this.anchor = isInsideOneOfTheAnchors(point, ctx);

        return this.anchor;
      };
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
    };

    const mouseup = () => this.scalable = false

    const mousemove = (mouse) => {
      if (this.scalable) {
        const bounding = element.bounding;

        // const diffx = mouse.x - this.mouse.x;
        // const diffy = mouse.y - this.mouse.y;

        // not working of course:
        const scaleX =
          (bounding.minX + bounding.maxX - mouse.x) / (bounding.minX - mouse.x);
        const scaleY =
          (bounding.minY + bounding.maxY - mouse.y) / (bounding.minY - mouse.y);

        console.log({ scaleX, scaleY });

        this.mouse = mouse;
        this.props = { scaleX: 1, scaleY: 1, x: 10, y: 10, rotate: 0.43 };

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
