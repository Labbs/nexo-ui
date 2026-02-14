import { Item } from "./data-grid-types";
export declare function useAnimationQueue(draw: (items: readonly Item[]) => void): (item: Item) => void;
