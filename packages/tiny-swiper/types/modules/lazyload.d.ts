import { SwiperInstance } from '../core/index';
import { Options } from '../core/options';
export declare type SwiperPluginLazyloadOptions = {
    loadPrevNext: false;
    loadPrevNextAmount: 1;
    loadOnTransitionStart: false;
    elementClass: 'swiper-lazy';
    loadingClass: 'swiper-lazy-loading';
    loadedClass: 'swiper-lazy-loaded';
    preloaderClass: 'swiper-lazy-preloader';
};
export declare type SwiperPluginLazyloadHTMLElement = HTMLImageElement & {
    isLoaded: boolean;
};
/**
 * TinySwiper plugin for image lazy loading.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default function SwiperPluginLazyload(instance: SwiperInstance & {
    lazyload: {
        load(index: number): void;
        loadRange(index: number, range: number): void;
    };
}, options: Options): void;
