// import { eventQueue } from "./art";

export default class Event {
  handlers = [];
  defaults = null;
  props = null;
  canvas = undefined;
  down = false;

  constructor(defaults, canvas) {
    this.defaults = defaults;
    this.canvas = canvas;
  }

  start(name, update) {
    const handler = (event) => {
      this.props = update({ event, props: this.props || this.defaults });
    };

    this.canvas.addEventListener(name, handler, false);
    this.handlers.push(handler);
  }

  mount(canvas) {}

  unmount(canvas) {
    this.handlers.forEach(({ name, handler }) => {
      canvas.removeEventListener(name, handler, false);
    });
  }
}
