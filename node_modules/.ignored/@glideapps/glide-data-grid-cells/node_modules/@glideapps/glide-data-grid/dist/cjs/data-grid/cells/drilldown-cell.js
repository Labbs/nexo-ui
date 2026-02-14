"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drilldownCellRenderer = void 0;

var React = _interopRequireWildcard(require("react"));

var _drilldownOverlayEditor = _interopRequireDefault(require("../../data-grid-overlay-editor/private/drilldown-overlay-editor"));

var _dataGridLib = require("../data-grid-lib");

var _dataGridTypes = require("../data-grid-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const drilldownCellRenderer = {
  getAccessibilityString: c => c.data.map(d => d.text).join(", "),
  kind: _dataGridTypes.GridCellKind.Drilldown,
  needsHover: false,
  useLabel: false,
  needsHoverPosition: false,
  measure: (ctx, cell) => {
    return cell.data.reduce((acc, data) => ctx.measureText(data.text).width + (data.img === undefined ? 0 : 20) + acc, 0) + 16;
  },
  render: a => (0, _dataGridLib.drawDrilldownCell)(a, a.cell.data),
  getEditor: () => p => {
    const {
      onKeyDown,
      value
    } = p;
    return React.createElement(_drilldownOverlayEditor.default, {
      drilldowns: value.data,
      onKeyDown: onKeyDown
    });
  }
};
exports.drilldownCellRenderer = drilldownCellRenderer;