import { Position } from '../state/trace';
import { Options } from '../options';
import { Env } from '../env/index';
import { State } from '../state/index';
import { Operations } from '../state/operations';
export declare type Actions = {
    preheat(originPosition: Position, originTransform: number): void;
    move(position: Position): void;
    stop(): void;
};
export declare function Actions(options: Options, env: Env, state: State, operations: Operations): {
    preheat: (originPosition: Position, originTransform: number) => void;
    move: (position: Position) => void;
    stop: () => void;
};
