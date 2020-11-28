import { SwiperInstance } from '../core/index';
import { Options } from '../core/options';
export declare type SwiperPluginKeyboardControlOptions = {
    enabled: boolean;
    onlyInViewport: boolean;
};
/**
 * TinySwiper plugin for keyboard control.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default function SwiperPluginKeyboardControl(instance: SwiperInstance & {
    keyboard: {
        onKeyDown(e: Event): void;
        enable(): void;
        disable(): void;
    };
}, options: Options): void;
