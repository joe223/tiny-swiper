import { Tracker } from './trace';
export interface State {
    tracker: Tracker;
    index: number;
    startTransform: number;
    isStart: boolean;
    isScrolling: boolean;
    isTouching: boolean;
    transforms: number;
    progress: number;
}
export declare function State(): State;
