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
  selected = false

  constructor({ checkBoundries, absolute = false }) {
    eventQueue.push(this);

    this.absolute = absolute;

    if (checkBoundries) {
      this.checkBoundries = (point, ctx) => {
        if (this.draggable) return;

        this.isPreviousMouseIn = this.isIn;

        this.isIn = checkBoundries(point, ctx);
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

  endDrag() {}

  schedule(eventName, handler) {
    this[eventName] = handler;
  }

  remove() {
    eventQueue.filter((event) => event !== this);
  }
}
