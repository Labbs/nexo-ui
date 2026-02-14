"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CellRenderers = void 0;

var _dataGridTypes = require("../data-grid-types");

var _booleanCell = require("./boolean-cell");

var _bubbleCell = require("./bubble-cell");

var _drilldownCell = require("./drilldown-cell");

var _imageCell = require("./image-cell");

var _loadingCell = require("./loading-cell");

var _markdownCell = require("./markdown-cell");

var _markerCell = require("./marker-cell");

var _newRowCell = require("./new-row-cell");

var _numberCell = require("./number-cell");

var _protectedCell = require("./protected-cell");

var _rowIdCell = require("./row-id-cell");

var _textCell = require("./text-cell");

var _uriCell = require("./uri-cell");

const asCollapsed = x => x;

const CellRenderers = {
  [_dataGridTypes.InnerGridCellKind.Marker]: asCollapsed(_markerCell.markerCellRenderer),
  [_dataGridTypes.InnerGridCellKind.NewRow]: asCollapsed(_newRowCell.newRowCellRenderer),
  [_dataGridTypes.GridCellKind.Boolean]: asCollapsed(_booleanCell.booleanCellRenderer),
  [_dataGridTypes.GridCellKind.Bubble]: asCollapsed(_bubbleCell.bubbleCellRenderer),
  [_dataGridTypes.GridCellKind.Drilldown]: asCollapsed(_drilldownCell.drilldownCellRenderer),
  [_dataGridTypes.GridCellKind.Image]: asCollapsed(_imageCell.imageCellRenderer),
  [_dataGridTypes.GridCellKind.Loading]: asCollapsed(_loadingCell.loadingCellRenderer),
  [_dataGridTypes.GridCellKind.Markdown]: asCollapsed(_markdownCell.markdownCellRenderer),
  [_dataGridTypes.GridCellKind.Number]: asCollapsed(_numberCell.numberCellRenderer),
  [_dataGridTypes.GridCellKind.Protected]: asCollapsed(_protectedCell.protectedCellRenderer),
  [_dataGridTypes.GridCellKind.RowID]: asCollapsed(_rowIdCell.rowIDCellRenderer),
  [_dataGridTypes.GridCellKind.Text]: asCollapsed(_textCell.textCellRenderer),
  [_dataGridTypes.GridCellKind.Uri]: asCollapsed(_uriCell.uriCellRenderer)
};
exports.CellRenderers = CellRenderers;