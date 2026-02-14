import _styled2 from "styled-components";
import _styled from "styled-components";
import React from "react";
import { css } from "styled-components";
import ClickOutsideContainer from "../click-outside-container/click-outside-container";
export const GroupRename = p => {
  const {
    bounds,
    group,
    onClose,
    canvasBounds,
    onFinish
  } = p;
  const [value, setValue] = React.useState(group);
  return React.createElement(_StyledClickOutsideContainer, {
    style: {
      position: "absolute",
      left: bounds.x - canvasBounds.left + 1,
      top: bounds.y - canvasBounds.top,
      width: bounds.width - 2,
      height: bounds.height
    },
    onClickOutside: onClose
  }, React.createElement(_StyledInput, {
    "data-testid": "group-rename-input",
    value: value,
    onBlur: onClose,
    onFocus: e => e.target.setSelectionRange(0, value.length),
    onChange: e => setValue(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") {
        onFinish(value);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    autoFocus: true,
    $_css: Math.max(16, bounds.height - 10)
  }));
};

var _StyledClickOutsideContainer = _styled(ClickOutsideContainer).withConfig({
  displayName: "group-rename___StyledClickOutsideContainer",
  componentId: "sc-1luhmq4-0"
})(["padding:0 8px;display:flex;align-items:center;background-color:", ";"], t => t.theme.bgHeader);

var _StyledInput = _styled("input").withConfig({
  displayName: "group-rename___StyledInput",
  componentId: "sc-1luhmq4-1"
})(["flex-grow:1;border:none;outline:none;background-color:", ";border-radius:9px;padding:0 8px;box-shadow:0 0 0 1px ", ";color:", ";min-height:", "px;font:", " ", ";"], t => t.theme.bgHeaderHasFocus, t => t.theme.borderColor, t => t.theme.textGroupHeader, p => p.$_css, t => t.theme.headerFontStyle, t => t.theme.fontFamily);