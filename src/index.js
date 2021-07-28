import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./root";
import { Workbox } from "workbox-window";
import "./styles/css.css";
import "./styles/less.less";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const wb = new Workbox("/service-worker.js");
    const updateButton = document.querySelector("#app-update");
    //server worker 已经安装待激活
    wb.addEventListener("waiting", event => {
      updateButton.classList.add("show");
      updateButton.addEventListener("click", () => {
        //设置侦听，在等待状态的service worker 控制页面后立即重新加载页面
        wb.addEventListener("controlling", event => {
          window.location.reload();
        });
        wb.messageSW({ type: "SKIP_WAITING" });
      });
    });
    wb.register();
  });
}

ReactDOM.render(<Root></Root>, document.getElementById("app-root"));

if (module.hot) {
  module.hot.accept();
}
