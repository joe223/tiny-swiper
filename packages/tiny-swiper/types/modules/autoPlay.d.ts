import { SwiperPlugin } from '../core/index';
export declare type SwiperPluginAutoPlayOptions = {
    delay: number;
    disableOnInteraction: boolean;
    reverseDirection: boolean;
    stopOnLastSlide: boolean;
    waitForTransition: boolean;
};
export declare type SwiperPluginAutoPlayPartialOptions = Partial<SwiperPluginAutoPlayOptions> | boolean;
export declare type SwiperPluginAutoPlayInstance = {};
declare const _default: SwiperPlugin;
/**
 * TinySwiper plugin for auto paly.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default _default;
