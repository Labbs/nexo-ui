import * as React from "react";
import { Rectangle } from "../../data-grid/data-grid-types";
interface Props {
    readonly targetRect: Rectangle;
    readonly markdown: string;
    readonly onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    readonly onChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
    readonly forceEditMode: boolean;
    readonly onFinish: () => void;
    readonly readonly: boolean;
    createNode?: (content: string) => DocumentFragment;
}
export declare const MarkdownOverlayEditor: React.FunctionComponent<Props>;
export {};
