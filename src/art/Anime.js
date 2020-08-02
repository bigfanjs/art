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
  start: function (attached, update) {
    const newUpdate =
      typeof attached !== "function" ? { attached, update } : attached;

    // console.log({ attached, update, newUpdate });

    this.updates = [...this.updates, newUpdate];
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
  // reduce: function (callback) {
  //   const props = callback(this.attached.map((anime) => anime.props));

  //   this.props = props;
  // },
  create: function create(defaults) {
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
    });

    return anime;
  },
  run: function (time) {
    if (this.attached && this.attached.length && this.loop) {
      this.updates.forEach((update, i) => {
        this.props = this.attached.forEach((elem, index) => {
          const newProps = elem.props ? elem.props : elem.default;
          const isObj = typeof update === "object";
          const newUpdate = isObj ? update.update : update;
          let attached =
            isObj && update.attached
              ? [...elem.attached, update.attached]
              : elem.attached;

          const props = newUpdate({
            time,
            index,
            props: newProps,
            attached: attached.map((att) =>
              att.props ? att.props : att.default
            ),
          });

          // console.log({ props });

          elem.props = { ...elem.props, ...props };
        });

        // console.log("Woa", { props: this.props });
      });
    } else {
      this.updates.forEach((update, i) => {
        // console.log({ update, props: this.props, default: this.default });

        // console.log({ updates: this.updates, update });

        const newProps = this.props ? this.props : this.default;
        const isObj = typeof update === "object";
        const newUpdate = isObj ? update.update : update;
        let attached =
          isObj && update.attached
            ? [...this.attached, update.attached]
            : this.attached;

        // console.log({ newProps });

        // if (!newProps) return;

        // console.log({
        //   coolattached: this.attached.map((att) =>
        //     att.props ? att.props : att.default
        //   ),
        // });

        const props = newUpdate({
          time,
          props: newProps,
          attached: attached.map((att) =>
            att.props ? att.props : att.default
          ),
        });

        this.props = { ...this.props, ...props };
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
