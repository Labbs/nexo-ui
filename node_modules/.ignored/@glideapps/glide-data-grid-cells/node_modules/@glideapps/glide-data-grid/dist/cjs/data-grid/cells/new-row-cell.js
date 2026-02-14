"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newRowCellRenderer = void 0;

var _dataGridLib = require("../data-grid-lib");

var _dataGridTypes = require("../data-grid-types");

const newRowCellRenderer = {
  getAccessibilityString: () => "",
  kind: _dataGridTypes.InnerGridCellKind.NewRow,
  needsHover: true,
  needsHoverPosition: false,
  measure: () => 200,
  render: a => (0, _dataGridLib.drawNewRowCell)(a, a.cell.hint, a.cell.icon)
};
exports.newRowCellRenderer = newRowCellRenderer;