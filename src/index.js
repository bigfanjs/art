import React from "react";
import Art from "./art/art";
import "./index.css";
import Test from "./components/best-usage/Web";
import * as serviceWorker from "./serviceWorker";

Art.render(
  <Test resolution={14} depth={6} />,
  document.getElementById("canvas")
);

serviceWorker.unregister();
