"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadingCellRenderer = void 0;

var _dataGridTypes = require("../data-grid-types");

const loadingCellRenderer = {
  getAccessibilityString: () => "",
  kind: _dataGridTypes.GridCellKind.Loading,
  needsHover: false,
  useLabel: false,
  needsHoverPosition: false,
  measure: () => 150,
  render: () => undefined
};
exports.loadingCellRenderer = loadingCellRenderer;