export declare type TraceLogs = Array<Trace>;
export declare type Offset = {
    /**
     * offset x
     */
    x: number;
    /**
     * offset y
     */
    y: number;
};
export declare type Position = {
    /**
     * postion in the x-axis
     */
    x: number;
    /**
     * postion in the y-axis
     */
    y: number;
};
export declare type Trace = {
    /**
     * timestamp of current postion
     */
    time: number;
} & Position;
export declare type Tracker = {
    push(postion: Position): void;
    vector(): Vector;
    clear(): void;
    getLogs(): TraceLogs;
    getDuration(): number;
    getOffset(): Offset;
};
export declare type Vector = {
    /**
     * offset in the x-axis
     */
    x: number;
    /**
     * offset in the y-axis
     */
    y: number;
    /**
     * velocity in the x-axis
     */
    velocityX: number;
    /**
     * velocity in the y-axis
     */
    velocityY: number;
    /**
     * direction angle
     */
    angle: number;
};
export declare function Vector(logs: TraceLogs, index: number): Vector;
export declare function Tracker(): Tracker;
