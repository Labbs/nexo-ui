"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageCellRenderer = void 0;

var React = _interopRequireWildcard(require("react"));

var _imageOverlayEditor = _interopRequireDefault(require("../../data-grid-overlay-editor/private/image-overlay-editor"));

var _dataGridLib = require("../data-grid-lib");

var _dataGridTypes = require("../data-grid-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const imageCellRenderer = {
  getAccessibilityString: c => c.data.join(", "),
  kind: _dataGridTypes.GridCellKind.Image,
  needsHover: false,
  useLabel: false,
  needsHoverPosition: false,
  render: a => {
    var _a$cell$displayData;

    return (0, _dataGridLib.drawImage)(a, (_a$cell$displayData = a.cell.displayData) !== null && _a$cell$displayData !== void 0 ? _a$cell$displayData : a.cell.data);
  },
  measure: (_ctx, cell) => cell.data.length * 50,
  onDelete: c => ({ ...c,
    data: []
  }),
  getEditor: () => p => {
    const {
      onKeyDown,
      value,
      onFinishedEditing,
      imageEditorOverride
    } = p;
    const ImageEditor = imageEditorOverride !== null && imageEditorOverride !== void 0 ? imageEditorOverride : _imageOverlayEditor.default;
    return React.createElement(ImageEditor, {
      urls: value.data,
      canWrite: value.allowAdd,
      onCancel: onFinishedEditing,
      onChange: newImage => {
        onFinishedEditing({ ...value,
          data: [newImage]
        });
      },
      onKeyDown: onKeyDown
    });
  }
};
exports.imageCellRenderer = imageCellRenderer;