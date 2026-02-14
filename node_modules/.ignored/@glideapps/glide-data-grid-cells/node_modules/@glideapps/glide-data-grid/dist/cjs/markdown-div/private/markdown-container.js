"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MarkdownContainer = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MarkdownContainer = _styledComponents.default.div.withConfig({
  displayName: "markdown-container__MarkdownContainer",
  componentId: "sc-rncfxa-0"
})(["word-break:break-word;-webkit-touch-callout:default;padding-top:6px;> *{margin:0;}& *:last-child{margin-bottom:0;}& p img{width:100%;}"]);

exports.MarkdownContainer = MarkdownContainer;