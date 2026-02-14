"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _growingEntryStyle = require("./growing-entry-style");

var _support = require("../common/support");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
  (0, _support.assert)(onChange !== undefined, "GrowingEntry must be a controlled input area");
  React.useEffect(() => {
    const ta = inputRef.current;
    if (ta === null) return;
    if (ta.disabled) return;
    const length = useText.toString().length;
    ta.focus();
    ta.setSelectionRange(highlight ? 0 : length, length);
  }, []);
  return React.createElement(_growingEntryStyle.GrowingEntryStyle, null, React.createElement(_growingEntryStyle.ShadowBox, {
    className: className
  }, useText + "\n"), React.createElement(_growingEntryStyle.InputBox, _extends({}, rest, {
    ref: inputRef,
    onKeyDown: onKeyDown,
    value: useText,
    placeholder: placeholder,
    dir: "auto"
  })));
};

var _default = GrowingEntry;
exports.default = _default;