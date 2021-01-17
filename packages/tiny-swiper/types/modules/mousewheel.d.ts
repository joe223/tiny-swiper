import { SwiperPlugin } from '../core/index';
export declare type SwiperPluginMousewheelOptions = {
    invert: boolean;
    sensitivity: number;
    interval: number;
};
export declare type SwiperPluginMousewheelPartialOptions = Partial<SwiperPluginMousewheelOptions>;
export declare type SwiperPluginMousewheelInstance = {
    $el?: HTMLElement;
};
declare const _default: SwiperPlugin;
export default _default;
