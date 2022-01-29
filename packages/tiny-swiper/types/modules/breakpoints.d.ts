import { UserOptions } from '../core/options';
import { SwiperPlugin } from '../core/index';
export declare type SwiperPluginBreakpointsInstance = {
    update(): void;
};
export declare type SwiperPluginBreakpointsOptions = {
    [key in number]: UserOptions;
};
declare const _default: SwiperPlugin;
/**
 * TinySwiper plugin for breakpoints.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default _default;
