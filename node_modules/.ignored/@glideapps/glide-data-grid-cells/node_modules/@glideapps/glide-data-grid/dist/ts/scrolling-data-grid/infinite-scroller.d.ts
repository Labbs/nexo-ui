import type { Rectangle } from "..";
import * as React from "react";
interface Props {
    readonly className?: string;
    readonly draggable: boolean;
    readonly paddingRight?: number;
    readonly paddingBottom?: number;
    readonly clientHeight: number;
    readonly scrollWidth: number;
    readonly scrollHeight: number;
    readonly scrollToEnd?: boolean;
    readonly rightElementSticky?: boolean;
    readonly rightElement?: React.ReactNode;
    readonly minimap?: React.ReactNode;
    readonly style?: React.CSSProperties;
    readonly scrollRef?: React.MutableRefObject<HTMLDivElement | null>;
    readonly update: (region: Rectangle) => void;
}
export declare const ScrollRegionStyle: import("styled-components").StyledComponent<"div", import("..").Theme, {}, never>;
export declare const InfiniteScroller: React.FC<Props>;
export {};
