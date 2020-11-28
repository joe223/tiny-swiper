export declare type EventHub = {
    on(evtName: string, cb: Function): void;
    off(evtName: string, cb: Function): void;
    emit(evtName: string, ...data: Array<any>): void;
    clear(): void;
};
export declare function EventHub(): EventHub;
