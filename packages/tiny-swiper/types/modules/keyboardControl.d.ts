import { SwiperPlugin } from '../core/index';
export declare type SwiperPluginKeyboardControlOptions = {
    enabled: boolean;
    onlyInViewport: boolean;
};
export declare type SwiperPluginKeyboardControlPartialOptions = Partial<SwiperPluginKeyboardControlOptions> | boolean;
export declare type SwiperPluginKeyboardInstance = {
    onKeyDown(e: Event): void;
    enable(): void;
    disable(): void;
};
declare const _default: SwiperPlugin;
/**
 * TinySwiper plugin for keyboard control.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default _default;
