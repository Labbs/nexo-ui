"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MarkdownOverlayEditor = void 0;

var React = _interopRequireWildcard(require("react"));

var _markdownDiv = _interopRequireDefault(require("../../markdown-div/markdown-div"));

var _growingEntry = _interopRequireDefault(require("../../growing-entry/growing-entry"));

var _markdownOverlayEditorStyle = require("./markdown-overlay-editor-style");

var _utils = require("../../common/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const MarkdownOverlayEditor = p => {
  const {
    markdown,
    onChange,
    onKeyDown,
    forceEditMode,
    createNode,
    targetRect,
    readonly,
    onFinish
  } = p;
  const [editMode, setEditMode] = React.useState(markdown === "" || forceEditMode);
  const onEditClick = React.useCallback(() => {
    setEditMode(e => !e);
  }, []);
  const addLeftPad = markdown ? "ml-6" : "";

  if (editMode) {
    return React.createElement(_markdownOverlayEditorStyle.MarkdownOverlayEditorStyle, {
      targetRect: targetRect
    }, React.createElement(_growingEntry.default, {
      autoFocus: true,
      highlight: false,
      onKeyDown: onKeyDown,
      value: markdown,
      onChange: onChange
    }), React.createElement("div", {
      className: `edit-icon checkmark-hover ${addLeftPad}`,
      onClick: () => onFinish()
    }, React.createElement(_utils.Checkmark, null)));
  }

  return React.createElement(_markdownOverlayEditorStyle.MarkdownOverlayEditorStyle, {
    targetRect: targetRect
  }, React.createElement(_markdownDiv.default, {
    contents: markdown,
    createNode: createNode
  }), !readonly && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "spacer"
  }), React.createElement("div", {
    className: `edit-icon edit-hover ${addLeftPad}`,
    onClick: onEditClick
  }, React.createElement(_utils.EditPencil, null))), React.createElement("textarea", {
    className: "md-edit-textarea",
    autoFocus: true,
    onKeyDown: onKeyDown
  }));
};

exports.MarkdownOverlayEditor = MarkdownOverlayEditor;