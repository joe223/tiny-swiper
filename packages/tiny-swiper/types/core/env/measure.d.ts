import { Options } from '../options';
import { Element } from './element';
export declare type Measure = {
    boxSize: number;
    viewSize: number;
    slideSize: number;
};
export declare function Measure(options: Options, element: Element): Measure;
