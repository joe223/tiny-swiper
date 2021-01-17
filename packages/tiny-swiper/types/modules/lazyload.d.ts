import { SwiperPlugin } from '../core/index';
export declare type SwiperPluginLazyloadOptions = {
    loadPrevNext: boolean;
    loadPrevNextAmount: number;
    loadOnTransitionStart: boolean;
    elementClass: string;
    loadingClass: string;
    loadedClass: string;
    preloaderClass: string;
};
export declare type SwiperPluginLazyloadPartialOptions = Partial<SwiperPluginLazyloadOptions> | boolean;
export declare type SwiperPluginLazyloadHTMLElement = HTMLImageElement & {
    isLoaded: boolean;
};
export declare type SwiperPluginLazyloadInstance = {
    load(index: number): void;
    loadRange(index: number, range: number): void;
};
declare const _default: SwiperPlugin;
/**
 * TinySwiper plugin for image lazy loading.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default _default;
