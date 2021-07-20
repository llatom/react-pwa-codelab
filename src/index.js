import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./root";
import "./styles/css.css";
import "./styles/less.less";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function (reg) {
    console.log(" service worker registration")
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });

  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) {
      return
    }
    refreshing = true;
    window.location.reload();
  });
}

ReactDOM.render(<Root />, document.getElementById("app-root"));

if (module.hot) {
  module.hot.accept();
}
