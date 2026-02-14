import type { GridColumn } from "..";
import type { Theme } from "../common/styles";
import { HeaderIconMap } from "./sprites";
declare type HeaderIcon = keyof HeaderIconMap;
export declare type SpriteMap = Record<string | HeaderIcon, HeaderIconMap["headerArray"]>;
export declare type SpriteVariant = "normal" | "selected" | "special";
export declare class SpriteManager {
    private colorMap;
    private spriteCanvas;
    private spriteList;
    private headerIcons;
    constructor(headerIcons: SpriteMap | undefined);
    drawSprite(sprite: HeaderIcon | string, variant: SpriteVariant, ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: Theme, alpha?: number): void;
    buildSpriteMap(theme: Theme, cols: readonly GridColumn[]): Promise<boolean>;
}
export {};
