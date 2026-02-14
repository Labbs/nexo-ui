import * as React from "react";
import { DataGridProps, DataGridRef } from "../data-grid/data-grid";
import { GridColumn } from "../data-grid/data-grid-types";
declare type Props = Omit<DataGridProps, "dragAndDropState" | "isResizing" | "isDragging" | "onMouseMoveRaw" | "allowResize">;
export interface DataGridDndProps extends Props {
    readonly onRowMoved?: (startIndex: number, endIndex: number) => void;
    readonly onColumnMoved?: (startIndex: number, endIndex: number) => void;
    readonly onColumnResized?: (column: GridColumn, newSize: number) => void;
    readonly gridRef?: React.MutableRefObject<DataGridRef | null>;
    readonly maxColumnWidth?: number;
    readonly lockColumns: number;
}
declare const DataGridDnd: React.FunctionComponent<DataGridDndProps>;
export default DataGridDnd;
