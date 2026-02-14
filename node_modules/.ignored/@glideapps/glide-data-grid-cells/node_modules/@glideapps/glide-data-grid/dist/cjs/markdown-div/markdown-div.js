"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _marked = require("marked");

var _markdownContainer = require("./private/markdown-container");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MarkdownDiv extends _react.default.PureComponent {
  constructor() {
    super(...arguments);
    this.targetElement = null;

    this.containerRefHook = element => {
      this.targetElement = element;
      this.renderMarkdownIntoDiv();
    };
  }

  renderMarkdownIntoDiv() {
    const {
      targetElement
    } = this;
    if (targetElement === null) return;
    const {
      contents,
      createNode
    } = this.props;
    const innerHTML = (0, _marked.marked)(contents);
    const childRange = document.createRange();
    childRange.selectNodeContents(targetElement);
    childRange.deleteContents();
    let newChild = createNode === null || createNode === void 0 ? void 0 : createNode(innerHTML);

    if (newChild === undefined) {
      const childDoc = document.createElement("template");
      childDoc.innerHTML = innerHTML;
      newChild = childDoc.content;
    }

    targetElement.appendChild(newChild);
    const tags = targetElement.getElementsByTagName("a");

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      tag.target = "_blank";
      tag.rel = "noreferrer noopener";
    }
  }

  render() {
    this.renderMarkdownIntoDiv();
    return _react.default.createElement(_markdownContainer.MarkdownContainer, {
      ref: this.containerRefHook
    });
  }

}

exports.default = MarkdownDiv;