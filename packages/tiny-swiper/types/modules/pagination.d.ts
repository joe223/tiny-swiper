import { SwiperInstance } from '../core/index';
import { Options } from '../core/options';
export declare type SwiperPluginPaginationOptions = Options & {
    pagination: {
        el: string;
        clickable: false;
        bulletClass: 'swiper-pagination-bullet';
        bulletActiveClass: 'swiper-pagination-bullet-active';
    };
};
export declare type SwiperPluginPaginationInstance = {
    $pageList: HTMLElement[];
    $pagination: HTMLElement | null;
};
export default function SwiperPluginPagination(instance: SwiperInstance & {
    pagination: SwiperPluginPaginationInstance;
}, options: SwiperPluginPaginationOptions): void;
