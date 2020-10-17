const Group = {
  x: 0,
  y: 0,
  transform: null,
  type: "group",
  hint: 0,
  update: null,
  pos: function pos() {
    if (this.update && this.update.props) {
      this.update.props.x && (this.x = this.update.props.x);
      this.update.props.y && (this.y = this.update.props.y);
    }

    return this;
  },
  setPos: function setPos(group) {
    this.x = this.x + group.x;
    this.y = this.y + group.y;
  },
  add: function add(child) {
    this.followers.push(child);
  },
  attach: function (child) {
    if (child.type === "group") {
      this.setPos(child);
      return child;
    } else {
      // if (child.type === "rect" && child.props.color === "blue")
      //   console.log({ child, group: this });
      child.setPos(this.x, this.y);
      return child;
    }
  },
  draw: function (ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.hint, this.y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.hint);
    ctx.stroke();
  },
  order: function () {
    this.followers
      .sort((a, b) => a.zIndex - b.zIndex)
      .sort((a, b) => a.event.selected - b.event.selected);
  },
};

export default Group;
