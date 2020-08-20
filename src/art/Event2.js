import { isPointInRect, isPointInCircle } from "./isPointInside";
import { eventQueue } from "./art";

export default class Event {
  props = null;
  click = null;
  mousemove = null;
  mousedown = null;
  type = null;
  index = null;
  isIn = false;
  isPreviousMouseIn = false;

  constructor() {
    eventQueue.push(this);
  }

  startDrag(canvas, ctx) {
    if (this.type === "rect") {
      const mousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (isPointInRect(this.props, mouse)) {
          this.draggable = true;
          this.mouse = { ...this.mouse, px: mouse.x, py: mouse.y };
        }
      };
      const mouseup = () => (this.draggable = false);
      const mousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (this.draggable) {
          const diffx = mouse.x - this.mouse.px;
          const diffy = mouse.y - this.mouse.py;

          this.mouse = { ...this.mouse, ...mouse };

          this.props.x = this.props.x + diffx;
          this.props.y = this.props.y + diffy;
        }
      };

      canvas.addEventListener("mousedown", mousedown, false);
      canvas.addEventListener("mouseup", mouseup, false);
      canvas.addEventListener("mousemove", mousemove, false);

      this.eventHandlers = [
        { name: "mousedown", handler: mousedown },
        { name: "mouseup", handler: mouseup },
        { name: "mousemove", handler: mousemove },
      ];
    } else if (this.type === "arc") {
      const mousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const diffX = mouse.x - this.props.x;
        const diffY = mouse.y - this.props.y;
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist <= this.props.radius) {
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

      canvas.addEventListener("mousedown", mousedown, false);
      canvas.addEventListener("mouseup", mouseup, false);
      canvas.addEventListener("mousemove", mousemove, false);

      this.eventHandlers = [
        { name: "mousedown", handler: mousedown },
        { name: "mouseup", handler: mouseup },
        { name: "mousemove", handler: mousemove },
      ];
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

      canvas.addEventListener("mousedown", mousedown, false);
      canvas.addEventListener("mouseup", mouseup, false);
      canvas.addEventListener("mousemove", mousemove, false);

      this.eventHandlers = [
        { name: "mousedown", handler: mousedown },
        { name: "mouseup", handler: mouseup },
        { name: "mousemove", handler: mousemove },
      ];
    }
  }
  endDrag() {}
  checkBoundries(mouse) {
    this.isPreviousMouseIn = this.isIn;

    switch (this.type) {
      case "rect":
        this.isIn = isPointInRect(this.props, mouse);
        break;
      case "arc":
        this.isIn = isPointInCircle(this.props, mouse);
        break;
      default:
        return;
    }
  }
  onClick(handler) {
    this.click = handler;
  }
  onMouseMove(handler) {
    this.mousemove = handler;
  }
  onMouseOver(handler) {
    this.mouseover = handler;
  }
  onMouseDown(handler) {
    this.mousedown = handler;
  }
  onMouseUp() {}
}
