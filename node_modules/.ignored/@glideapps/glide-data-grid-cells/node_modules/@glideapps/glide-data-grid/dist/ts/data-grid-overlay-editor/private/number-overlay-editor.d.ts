import * as React from "react";
import { NumberFormatValues } from "react-number-format";
interface Props {
    value: number | undefined;
    disabled?: boolean;
    onKeyDown: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
    onChange: (values: NumberFormatValues) => void;
    highlight: boolean;
}
declare const NumberOverlayEditor: React.FunctionComponent<Props>;
export default NumberOverlayEditor;
