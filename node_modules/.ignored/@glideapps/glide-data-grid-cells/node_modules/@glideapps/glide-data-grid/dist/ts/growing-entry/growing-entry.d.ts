import * as React from "react";
interface Props extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    readonly placeholder?: string;
    readonly highlight: boolean;
}
declare const GrowingEntry: React.FunctionComponent<Props>;
export default GrowingEntry;
