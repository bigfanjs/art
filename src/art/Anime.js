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
  map: function (callback) {
    return this.elements.map((element, index) => {
      return callback(element, index);
    });
  },
  start: function (update) {
    this.updates.push(update);
  },
  attach: function (update) {
    if (Array.isArray(update)) {
      this.attached = [...this.attached, ...update];
    } else if (update.type === "Anime") {
      this.attached.push(update);
    } else {
      throw Error("attached expects an anime instance");
    }

    return this;
  },
  reduce: function (callback) {
    const props = callback(this.default.map((anime) => anime.props));

    this.props = props;
  },
  run: function (time) {
    if (this.elements) {
      this.updates.forEach((update) => {
        this.props = this.elements.forEach((elem, index) => {
          elem.props = update({
            time,
            index,
            props: elem.props ? elem.props : elem.default,
          });
        });
      });
    } else {
      this.updates.forEach((update) => {
        this.props = update({
          time,
          props: this.props ? this.props : this.default,
        });
      });
    }
  },
  mount: function () {
    updateQueue.push(this);
  },
  unmount: function () {
    updateQueue.filter((update) => update !== this);
  },
};

export default Anime;
