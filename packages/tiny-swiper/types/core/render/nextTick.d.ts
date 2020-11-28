export declare type Tick = {
    run(cb: (interval: DOMHighResTimeStamp) => void): void;
    stop(): void;
};
export declare function Tick(): Tick;
