"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _numberOverlayEditorStyle = require("./number-overlay-editor-style");

var _reactNumberFormat = _interopRequireDefault(require("react-number-format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getDecimalSeparator() {
  var _Intl$NumberFormat, _Intl$NumberFormat$fo, _Intl$NumberFormat$fo2;

  const numberWithDecimalSeparator = 1.1;
  const result = (_Intl$NumberFormat = Intl.NumberFormat()) === null || _Intl$NumberFormat === void 0 ? void 0 : (_Intl$NumberFormat$fo = _Intl$NumberFormat.formatToParts(numberWithDecimalSeparator)) === null || _Intl$NumberFormat$fo === void 0 ? void 0 : (_Intl$NumberFormat$fo2 = _Intl$NumberFormat$fo.find(part => part.type === "decimal")) === null || _Intl$NumberFormat$fo2 === void 0 ? void 0 : _Intl$NumberFormat$fo2.value;
  return result !== null && result !== void 0 ? result : ".";
}

function getThousandSeprator() {
  return getDecimalSeparator() === "." ? "," : ".";
}

const NumberOverlayEditor = p => {
  const {
    value,
    onChange,
    onKeyDown,
    disabled,
    highlight
  } = p;
  return React.createElement(_numberOverlayEditorStyle.NumberOverlayEditorStyle, null, React.createElement(_reactNumberFormat.default, {
    autoFocus: true,
    onFocus: e => e.target.setSelectionRange(highlight ? 0 : e.target.value.length, e.target.value.length),
    disabled: disabled === true,
    thousandSeparator: getThousandSeprator(),
    decimalSeparator: getDecimalSeparator(),
    value: value !== null && value !== void 0 ? value : "",
    onValueChange: onChange,
    onKeyDown: onKeyDown
  }));
};

var _default = NumberOverlayEditor;
exports.default = _default;