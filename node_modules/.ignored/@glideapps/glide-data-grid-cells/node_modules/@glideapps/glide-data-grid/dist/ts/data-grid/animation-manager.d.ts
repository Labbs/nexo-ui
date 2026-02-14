import { Item } from "./data-grid-types";
declare type StateItem = {
    item: Item;
    hoverAmount: number;
};
export declare type HoverValues = readonly Readonly<StateItem>[];
export declare type StepCallback = (values: HoverValues) => void;
export declare function easeOutCubic(x: number): number;
export declare class AnimationManager {
    private callback;
    constructor(callback: StepCallback);
    private currentHoveredItem;
    private leavingItems;
    private lastAnimationTime;
    private areSameItems;
    private addToLeavingItems;
    /**
     * @returns the hover amount of the item, if it was leaving (0 if not).
     */
    private removeFromLeavingItems;
    private cleanUpLeavingElements;
    private shouldStep;
    private getAnimatingItems;
    private step;
    setHovered: (item: Item | undefined) => void;
}
export {};
