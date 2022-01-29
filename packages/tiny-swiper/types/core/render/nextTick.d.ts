export declare type Tick = {
    run(cb: (interval: DOMHighResTimeStamp) => void): void;
    stop(): void;
};
export declare const nextFrame: typeof webkitRequestAnimationFrame | typeof setTimeout;
export declare const cancelNextFrame: typeof webkitCancelAnimationFrame | typeof clearTimeout;
export declare function Tick(): Tick;
