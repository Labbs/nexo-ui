"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markerCellRenderer = void 0;

var _dataGridLib = require("../data-grid-lib");

var _dataGridTypes = require("../data-grid-types");

const markerCellRenderer = {
  getAccessibilityString: c => c.row.toString(),
  kind: _dataGridTypes.InnerGridCellKind.Marker,
  needsHover: true,
  needsHoverPosition: false,
  renderPrep: _dataGridLib.prepMarkerRowCell,
  renderDeprep: _dataGridLib.deprepMarkerRowCell,
  measure: () => 44,
  render: a => (0, _dataGridLib.drawMarkerRowCell)(a, a.cell.row, a.cell.checked, a.cell.markerKind)
};
exports.markerCellRenderer = markerCellRenderer;