/** Footer 页面底部 **/
import React from "react";
import "./index.less";

export default function Footer() {
  return (
    <div className="footer">
      © 2021-{new Date().getFullYear()}{" "}
      <a
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        github.com
      </a>
      , Inc.
    </div>
  );
}
