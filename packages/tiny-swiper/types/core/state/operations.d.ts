import { State } from './index';
import { Limitation } from '../env/limitation';
import { EventHub } from '../eventHub';
import { Renderer } from '../render/index';
import { Options } from '../options';
import { Env } from '../env/index';
export interface Operations {
    update(): void;
    render(duration?: number): void;
    transform(trans: number): void;
    slideTo(targetIndex: number, duration?: number): void;
    scrollPixel(px: number): void;
    initStatus(startTransform?: number): void;
    initLayout(originTransform: number): void;
    getOffsetSteps(offset: number): number;
}
export declare function isExceedingLimits(velocity: number, transform: number, options: Options, limitation: Limitation): boolean;
/**
 * Get transform exceed value
 * Return zero if is not reached border.
 *
 * @param transform
 * @param options
 * @param limitation
 */
export declare function getExcess(transform: number, options: Options, limitation: Limitation): number;
export declare function Operations(env: Env, state: State, options: Options, renderer: Renderer, eventHub: EventHub): Operations;
