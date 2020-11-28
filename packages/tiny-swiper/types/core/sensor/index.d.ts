import { State } from '../state/index';
import { Env } from '../env/index';
import { Options } from '../options';
import { Operations } from '../state/operations';
export declare type Sensor = {
    attach: () => void;
    detach: () => void;
};
export declare function Sensor(env: Env, state: State, options: Options, operations: Operations): Sensor;
