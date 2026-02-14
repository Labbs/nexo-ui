import * as React from "react";
import { NumberOverlayEditorStyle } from "./number-overlay-editor-style";
import NumberFormat from "react-number-format";

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
  return React.createElement(NumberOverlayEditorStyle, null, React.createElement(NumberFormat, {
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

export default NumberOverlayEditor;