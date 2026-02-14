"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupRename = void 0;

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _react = _interopRequireDefault(require("react"));

var _clickOutsideContainer = _interopRequireDefault(require("../click-outside-container/click-outside-container"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const GroupRename = p => {
  const {
    bounds,
    group,
    onClose,
    canvasBounds,
    onFinish
  } = p;

  const [value, setValue] = _react.default.useState(group);

  return _react.default.createElement(_StyledClickOutsideContainer, {
    style: {
      position: "absolute",
      left: bounds.x - canvasBounds.left + 1,
      top: bounds.y - canvasBounds.top,
      width: bounds.width - 2,
      height: bounds.height
    },
    onClickOutside: onClose
  }, _react.default.createElement(_StyledInput, {
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

exports.GroupRename = GroupRename;

var _StyledClickOutsideContainer = (0, _styledComponents.default)(_clickOutsideContainer.default).withConfig({
  displayName: "group-rename___StyledClickOutsideContainer",
  componentId: "sc-1luhmq4-0"
})(["padding:0 8px;display:flex;align-items:center;background-color:", ";"], t => t.theme.bgHeader);

var _StyledInput = (0, _styledComponents.default)("input").withConfig({
  displayName: "group-rename___StyledInput",
  componentId: "sc-1luhmq4-1"
})(["flex-grow:1;border:none;outline:none;background-color:", ";border-radius:9px;padding:0 8px;box-shadow:0 0 0 1px ", ";color:", ";min-height:", "px;font:", " ", ";"], t => t.theme.bgHeaderHasFocus, t => t.theme.borderColor, t => t.theme.textGroupHeader, p => p.$_css, t => t.theme.headerFontStyle, t => t.theme.fontFamily);