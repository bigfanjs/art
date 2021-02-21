import { updateQueue } from "./art";

const Anime = {
  props: null,
  default: null,
  update: null,
  offsets: false,
  type: "anime",
  updates: [],
  attached: [],
  loop: false,
  set: function (props) {
    this.props = { ...this.props, ...props };
  },
  get: function () {
    return this.props || this.default;
  },
  map: function (callback) {
    return this.attached.map((element, index) => {
      return callback(element, index);
    });
  },
  start: function (update) {
    this.updates = [...this.updates, update];
  },
  attach: function (update) {
    if (Array.isArray(update)) {
      this.attached = [...this.attached, ...update];
    } else if (update.type === "anime") {
      this.attached = [...this.attached, update];
      // console.log("attach", this.attached);
    } else {
      throw Error("attached expects an anime instance");
    }

    return this;
  },
  create: function create(defaults, event) {
    const prototype = Object.getPrototypeOf(this);
    const anime = Object.create(prototype, {
      default: { value: defaults, writable: true },
      offsets: { value: this.offsets },
      attached: {
        value: [],
        configurable: true,
        enumerable: true,
        writable: true,
      },
      updates: {
        value: [],
        configurable: true,
        enumerable: true,
        writable: true,
      },
      event: {
        value: event,
        configurable: true,
        enumerable: true,
        writable: true,
      },
    });

    return anime;
  },
  run: function (time) {
    if (this.attached && this.attached.length && this.loop) {
      this.updates.forEach((update, i) => {
        this.props = this.attached.forEach((elem, index) => {
          const newProps = elem.props ? elem.props : elem.default;

          const props = update({
            time,
            index,
            props: newProps,
            event: this.event && (this.event.props || this.event.defaults),
            attached: elem.attached.map((att) =>
              att.props ? att.props : att.default
            ),
          });

          elem.props = { ...newProps, ...props };
        });
      });
    } else {
      this.updates.forEach((update) => {
        const newProps = this.props ? this.props : this.default;

        const props = update({
          time,
          props: newProps,
          event: this.event && (this.event.props || this.event.defaults),
          attached: this.attached.map((att) =>
            att.props ? att.props : att.default
          ),
          // attached: this.attached.map((att) =>
          //   att.props ? att.props : att.default
          // ),
        });

        this.props = { ...newProps, ...props };
      });
    }
  },
  mount: function mount() {
    updateQueue.push(this);

    if (this.attached && this.attached.length) {
      this.attached.forEach((attached) => {
        updateQueue.push(attached);
      });
    }
  },
  unmount: function unmount() {
    updateQueue.filter((update) => update !== this);
  },
};

export default Anime;
