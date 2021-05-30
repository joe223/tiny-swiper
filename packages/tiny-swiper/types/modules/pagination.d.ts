import { SwiperPlugin } from '../core/index';
export declare type SwiperPluginPaginationOptions = {
    el: string;
    clickable: boolean;
    clickableClass: 'swiper-pagination-clickable';
    bulletClass: string | 'swiper-pagination-bullet';
    bulletActiveClass: string | 'swiper-pagination-bullet-active';
    renderBullet: Function;
};
export declare type SwiperPluginPaginationPartialOptions = Partial<SwiperPluginPaginationOptions>;
export declare type SwiperPluginPaginationInstance = {
    $pageList: HTMLElement[];
    $pagination: HTMLElement | null;
};
declare const _default: SwiperPlugin;
export default _default;
