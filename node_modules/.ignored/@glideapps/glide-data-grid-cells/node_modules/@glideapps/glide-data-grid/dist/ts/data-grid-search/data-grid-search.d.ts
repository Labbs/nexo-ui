import * as React from "react";
import { GridCell, Rectangle } from "../data-grid/data-grid-types";
import { ScrollingDataGridProps } from "../scrolling-data-grid/scrolling-data-grid";
export interface DataGridSearchProps extends Omit<ScrollingDataGridProps, "prelightCells"> {
    readonly getCellsForSelection?: (selection: Rectangle) => readonly (readonly GridCell[])[];
    readonly onSearchResultsChanged?: (results: readonly (readonly [number, number])[], navIndex: number) => void;
    readonly searchColOffset: number;
    readonly showSearch?: boolean;
    readonly onSearchClose?: () => void;
}
declare const DataGridSearch: React.FunctionComponent<DataGridSearchProps>;
export default DataGridSearch;
