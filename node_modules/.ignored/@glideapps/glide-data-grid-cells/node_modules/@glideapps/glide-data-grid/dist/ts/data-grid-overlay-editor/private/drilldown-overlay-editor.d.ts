import { DrilldownCellData } from "../../data-grid/data-grid-types";
import * as React from "react";
interface Props {
    readonly drilldowns: readonly DrilldownCellData[];
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}
declare const DrilldownOverlayEditor: React.FunctionComponent<Props>;
export default DrilldownOverlayEditor;
