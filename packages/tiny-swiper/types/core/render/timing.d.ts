declare type DebounceOptions = {
    trailing: boolean;
};
export declare function now(): number;
export declare function debounce<T extends (...args: any) => any>(fn: T, threshold?: number, opt?: DebounceOptions): T;
export {};
