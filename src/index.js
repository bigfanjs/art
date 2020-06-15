import React from "react";
// import ReactDOM from "react-dom";
// import Art from "./canvas-renderer";
import Art from "./art/art";
import "./index.css";
// import App from "./App";
import SolarSystem from "./SolarSystem";
// import App from "./DOMApp";
import * as serviceWorker from "./serviceWorker";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

Art.render(<SolarSystem />, document.getElementById("canvas"));

serviceWorker.unregister();
