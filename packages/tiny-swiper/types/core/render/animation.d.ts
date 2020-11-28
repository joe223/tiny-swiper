export declare type Animation = {
    run(task: (interval: DOMHighResTimeStamp) => void): void;
    stop(): void;
};
export declare function Animation(): Animation;
