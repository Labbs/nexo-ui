import * as React from "react";
import { BubblesOverlayEditorStyle } from "./bubbles-overlay-editor-style";

const BubblesOverlayEditor = p => {
  const {
    bubbles,
    onKeyDown
  } = p;
  return React.createElement(BubblesOverlayEditorStyle, null, bubbles.map((b, i) => React.createElement("div", {
    key: i,
    className: "boe-bubble"
  }, b)), React.createElement("textarea", {
    autoFocus: true,
    onKeyDown: onKeyDown
  }));
};

export default BubblesOverlayEditor;