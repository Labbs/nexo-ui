import * as React from "react";
export declare function useEventListener<K extends keyof HTMLElementEventMap>(eventName: K, handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, element: HTMLElement | Window | null, passive: boolean, capture?: boolean): void;
export declare function degreesToRadians(degrees: number): number;
export interface SpriteProps {
    fgColor: string;
    bgColor: string;
}
export declare const disabledProps: import("styled-components").FlattenSimpleInterpolation;
export declare const EditPencil: React.FunctionComponent<Partial<SpriteProps>>;
export declare const Checkmark: React.FunctionComponent<Partial<SpriteProps>>;
export declare function useDebouncedMemo<T>(factory: () => T, deps: React.DependencyList | undefined, time: number): T;
export declare function direction(value: string): "rtl" | "ltr" | "neutral";
