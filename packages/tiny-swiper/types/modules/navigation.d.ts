import { SwiperPlugin } from '../core/index';
export declare type SwiperPluginNavigationOptions = {
    nextEl: HTMLElement | string;
    prevEl: HTMLElement | string;
    disabledClass: string;
};
export declare type SwiperPluginNavigationPartialOptions = Partial<SwiperPluginNavigationOptions>;
export declare type SwiperPluginNavigationInstance = {
    nextEl?: HTMLElement;
    prevEl?: HTMLElement;
};
declare const _default: SwiperPlugin;
export default _default;
