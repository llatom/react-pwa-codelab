import React from "react";
import { connect } from "react-redux";
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';

/** 所需的所有资源 **/
import "./index.less";

function PresentationPageContainer(props) {
  return (
    <div className="page-features">
      <h1 className="title">构建与特性</h1>
    </div>
  );
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    actions: {},
  })
)(PresentationPageContainer);
