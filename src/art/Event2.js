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

  constructor({ checkBoundries }) {
    eventQueue.push(this);

    if (checkBoundries) {
      this.checkBoundries = (point) => {
        if (this.draggable) return;

        this.isPreviousMouseIn = this.isIn;

        this.isIn = checkBoundries(point);
      };
    }
  }

  startDrag(canvas, ctx) {
    if (this.type === "rect") {
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
    } else if (this.type === "arc") {
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
    } else {
      const mousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (ctx.isPointInPath(this.path, mouse.x, mouse.y)) {
          // console.log({ path: this.path, mouse, type: this.type });
          this.draggable = true;
          this.mouse = mouse;
        }
      };
      const mouseup = () => (this.draggable = false);
      const mousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (this.draggable) {
          const diffx = mouse.x - this.mouse.x;
          const diffy = mouse.y - this.mouse.y;

          this.mouse = mouse;

          this.props.x = this.props.x + diffx;
          this.props.y = this.props.y + diffy;
        }
      };

      this.dragginghandlers = { mousedown, mousemove, mouseup };
    }
  }
  endDrag() {}
  onClick(handler) {
    this.click = handler;
  }
  onMouseMove(handler) {
    this.mousemove = handler;
  }
  onMouseIn(handler) {
    this.mousein = handler;
  }
  onMouseOut(handler) {
    this.mouseout = handler;
  }
  onMouseDown(handler) {
    this.mousedown = handler;
  }
  onMouseUp(handler) {
    this.mouseup = handler;
  }
}
