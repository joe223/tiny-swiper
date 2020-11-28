import { Options } from '../options';
import { Element } from './element';
import { Measure } from './measure';
import { Limitation } from './limitation';
declare global {
    interface Window {
        DocumentTouch: any;
    }
    const DocumentTouch: any;
}
export declare type Env = {
    touchable: boolean;
    element: Element;
    measure: Measure;
    limitation: Limitation;
    update(element: Element): void;
};
export declare function Env(elem: Element, options: Options): Env;
