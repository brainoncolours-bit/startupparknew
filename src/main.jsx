import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const redirectPath = window.sessionStorage.getItem("spa-redirect");

if (redirectPath) {
  window.sessionStorage.removeItem("spa-redirect");
  window.history.replaceState(null, "", redirectPath);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
