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
export declare function getShortestWay(currentIndex: number, targetIndex: number, limitation: Limitation, defaultWay: number): number;
/**
 * Get transform exceed value
 * Return zero if is not reached border.
 *
 * @param transform
 * @param options
 * @param limitation
 */
export declare function getExcess(transform: number, options: Options, limitation: Limitation): number;
/**
 * The Set of state operations.
 * Every external Render/Sensor/DomHandler are called by this Internal state machine.
 * That gives us the possibility to run Tiny-Swiper in different platform.
 *
 * @param env
 * @param state
 * @param options
 * @param renderer
 * @param eventHub
 * @constructor
 */
export declare function Operations(env: Env, state: State, options: Options, renderer: Renderer, eventHub: EventHub): Operations;
