import { SwiperInstance } from '../core/index';
import { Options } from '../core/options';
export declare type SwiperPluginNavigationOptions = Options & {
    navigation: {
        nextEl: HTMLElement | string;
        prevEl: HTMLElement | string;
        disabledClass: string;
    };
};
export declare type SwiperPluginNavigationInstance = {
    nextEl: HTMLElement;
    prevEl: HTMLElement;
};
export default function SwiperPluginNavigation(instance: SwiperInstance & {
    navigation: SwiperPluginNavigationInstance;
}, options: SwiperPluginNavigationOptions): void;
