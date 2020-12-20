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
/**
 * Detect whether slides is rush out boundary.
 * @param velocity - Velocity larger than zero means that slides move to the right direction
 * @param transform
 * @param limitation
 */
export declare function isExceedingLimits(velocity: number, transform: number, limitation: Limitation): boolean;
/**
 * Return the shortest way to target Index.
 *      Negative number indicate the left direction, Index's value is decreasing.
 *      Positive number means index should increase.
 * @param currentIndex
 * @param targetIndex
 * @param limitation
 * @param defaultWay
 */
export declare function getShortestWay(currentIndex: number, targetIndex: number, limitation: Limitation, defaultWay: number): number;
/**
 * Get transform exceed value
 * Return zero if is not reached border.
 *
 * @param transform
 * @param limitation
 */
export declare function getExcess(transform: number, limitation: Limitation): number;
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
