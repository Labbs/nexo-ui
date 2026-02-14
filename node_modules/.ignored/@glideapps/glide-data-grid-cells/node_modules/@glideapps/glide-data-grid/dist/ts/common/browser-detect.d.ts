declare class Lazy<T> {
    private fn;
    private val;
    constructor(fn: () => T);
    get value(): T;
}
export declare const browserIsFirefox: boolean;
export declare const browserIsSafari: boolean;
export declare const browserIsOSX: Lazy<boolean>;
export {};
