import React from "react";
// import ReactDOM from "react-dom";
// import Art from "./canvas-renderer";
import Art from "./art/art";
import "./index.css";
// import App from "./App";
// import SolarSystem from "./SolarSystem";
// import Test from "./components/test/test2.js";
// import Test from "./components/another-usage/Web";
import Test from "./components/best-usage/Web";
// import App from "./DOMApp";
import * as serviceWorker from "./serviceWorker";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// Art.render(<SolarSystem />, document.getElementById("canvas"));
Art.render(
  <Test resolution={7} depth={6} />,
  document.getElementById("canvas")
);

serviceWorker.unregister();
