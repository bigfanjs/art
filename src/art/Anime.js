import { updateQueue } from "./art";

const Anime = {
  props: null,
  update: null,
  offset: false,
  start: function (update) {
    this.update = update;
    this.props.n = 100;
  },
  run: function (time) {
    this.props = this.update({ time });
  },
  mount: function () {
    updateQueue.push(this);
  },
  unmount: function () {
    updateQueue.filter((update) => update !== this);
  },
};

export default Anime;
