import * as React from "react";
import { GridCell, ProvideEditorCallback, Rectangle } from "../data-grid/data-grid-types";
import { OverlayImageEditorProps } from "./private/image-overlay-editor";
declare type ImageEditorType = React.ComponentType<OverlayImageEditorProps>;
export interface DataGridOverlayEditorProps {
    readonly target: Rectangle;
    readonly content: GridCell;
    readonly className?: string;
    readonly onFinishEditing: (newCell: GridCell | undefined, movement: readonly [-1 | 0 | 1, -1 | 0 | 1]) => void;
    readonly forceEditMode: boolean;
    readonly highlight: boolean;
    readonly imageEditorOverride?: ImageEditorType;
    readonly markdownDivCreateNode?: (content: string) => DocumentFragment;
    readonly provideEditor?: ProvideEditorCallback<GridCell>;
}
declare const DataGridOverlayEditor: React.FunctionComponent<DataGridOverlayEditorProps>;
export default DataGridOverlayEditor;
