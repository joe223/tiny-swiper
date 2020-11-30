export declare type EventHub = {
    on(evtName: string, cb: Function): void;
    off(evtName: string, cb: Function): void;
    emit(evtName: string, ...data: Array<any>): void;
    clear(): void;
};
export declare const LIFE_CYCLES: {
    BEFORE_INIT: string;
    AFTER_INIT: string;
    BEFORE_SLIDE: string;
    SCROLL: string;
    AFTER_SLIDE: string;
    BEFORE_DESTROY: string;
    AFTER_DESTROY: string;
};
export declare function EventHub(): EventHub;
