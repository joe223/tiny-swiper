import { SwiperInstance } from '../core/index';
import { Options } from '../core/options';
export declare type SwiperPluginMousewheelOptions = Options & {
    mousewheel: {
        invert: false;
        sensitivity: 1;
        interval: 400;
    };
};
export declare type SwiperPluginMousewheelInstance = {
    $el: HTMLElement;
};
export default function SwiperPluginMousewheel(instance: SwiperInstance & {
    mousewheel: SwiperPluginMousewheelInstance;
}, options: SwiperPluginMousewheelOptions): void;
