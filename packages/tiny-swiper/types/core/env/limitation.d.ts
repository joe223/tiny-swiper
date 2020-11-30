import { Options } from '../options';
import { Element } from './element';
import { Measure } from './measure';
export declare type Limitation = {
    min: number;
    max: number;
    base: number;
    expand: number;
    buffer: number;
    minIndex: number;
    maxIndex: number;
};
export declare function getExpand(options: Options): number;
export declare function Limitation(element: Element, measure: Measure, options: Options): Limitation;
