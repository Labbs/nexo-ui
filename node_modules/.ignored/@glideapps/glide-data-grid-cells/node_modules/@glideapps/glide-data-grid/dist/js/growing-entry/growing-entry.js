function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";
import { GrowingEntryStyle, ShadowBox, InputBox } from "./growing-entry-style";
import { assert } from "../common/support";

const GrowingEntry = props => {
  const {
    placeholder,
    value,
    onKeyDown,
    highlight,
    ...rest
  } = props;
  const {
    onChange,
    className
  } = rest;
  const inputRef = React.useRef(null);
  const useText = value !== null && value !== void 0 ? value : "";
  assert(onChange !== undefined, "GrowingEntry must be a controlled input area");
  React.useEffect(() => {
    const ta = inputRef.current;
    if (ta === null) return;
    if (ta.disabled) return;
    const length = useText.toString().length;
    ta.focus();
    ta.setSelectionRange(highlight ? 0 : length, length);
  }, []);
  return React.createElement(GrowingEntryStyle, null, React.createElement(ShadowBox, {
    className: className
  }, useText + "\n"), React.createElement(InputBox, _extends({}, rest, {
    ref: inputRef,
    onKeyDown: onKeyDown,
    value: useText,
    placeholder: placeholder,
    dir: "auto"
  })));
};

export default GrowingEntry;