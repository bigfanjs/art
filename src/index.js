import React from "react";
import Art from "./art/art";

import "./index.css";

// import SolarSystem from "./SolarSystem";
// import SpiderWeb from "./components/spiderweb/experemantal-web";
import DragAndDrop from "./components/DragAndDrop/TestClick";

import * as serviceWorker from "./serviceWorker";

// spider web
// Art.render(
//   <SpiderWeb resolution={14} depth={6} />,
//   document.getElementById("canvas")
// );

// solar system
// Art.render(<SolarSystem />, document.getElementById("canvas"));

// drag and drop
Art.render(<DragAndDrop />, document.getElementById("canvas"));

serviceWorker.unregister();
