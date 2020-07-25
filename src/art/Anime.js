import { updateQueue } from "./art";

const Anime = {
  props: null,
  default: null,
  update: null,
  offsets: false,
  elements: null,
  type: "anime",
  updates: [],
  attached: [],
  set: function (props) {
    this.props = { ...this.props, ...props };
  },
  get: function () {
    return this.props || this.default;
  },
  map: function (callback) {
    return this.elements.map((element, index) => {
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
  reduce: function (callback) {
    const props = callback(this.attached.map((anime) => anime.props));

    this.props = props;
  },
  create: function create(defaults) {
    const anime = Object.create(this.prototype, {
      default: { value: defaults, writable: true },
      offsets: { value: this.configs.offsets },
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
      elements: {
        value: [],
        configurable: true,
        enumerable: true,
        writable: true,
      },
    });

    this.attached.push(anime);

    return anime;
  },
  run: function (time) {
    if (this.elements && this.elements.length) {
      this.updates.forEach((update, i) => {
        // console.log({ update });
        // if (i >= 1) debugger;
        this.props = this.elements.forEach((elem, index) => {
          const newProps = elem.props ? elem.props : elem.default;

          // if (!newProps) return;

          elem.props = update({
            time,
            index,
            props: newProps,
            attached: elem.attached.map((att) =>
              att.props ? att.props : att.default
            ),
          });
        });

        // console.log("Woa", { props: this.props });
      });
    } else {
      this.updates.forEach((update, i) => {
        // console.log({ update, props: this.props, default: this.default });

        const newProps = this.props ? this.props : this.default;

        // console.log({ newProps });

        // if (!newProps) return;

        // console.log({
        //   coolattached: this.attached.map((att) =>
        //     att.props ? att.props : att.default
        //   ),
        // });

        const props = update({
          time,
          props: newProps,
          attached: this.attached.map((att) =>
            att.props ? att.props : att.default
          ),
        });

        this.props = props;
      });
    }
  },
  mount: function mount() {
    updateQueue.push(this);
    if (this.elements && this.elements.length) {
      this.elements.forEach((element) => {
        updateQueue.push(element);
      });
    }
  },
  unmount: function unmount() {
    updateQueue.filter((update) => update !== this);
  },
};

export default Anime;
