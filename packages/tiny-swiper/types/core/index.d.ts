import { UserOptions, Options } from './options';
import { State } from './state/index';
import { Env } from './env/index';
export declare type SwiperInstance = {
    on: (evtName: string, cb: Function) => void;
    off: (evtName: string, cb: Function) => void;
    update: () => void;
    destroy: () => void;
    slideTo: (index: number, duration?: number) => void;
    options: Options;
    env: Env;
    state: State;
    updateSize: () => void;
    [key: string]: any;
};
export declare type SwiperPlugin = (instance: SwiperInstance, options: Options) => void;
export declare type Swiper = {
    (el: HTMLElement | string, userOptions?: UserOptions): SwiperInstance;
    new (el: HTMLElement | string, userOptions?: UserOptions): SwiperInstance;
    use: (plugins: Array<SwiperPlugin>) => void;
    plugins: Array<SwiperPlugin>;
};
declare const Swiper: Swiper;
export default Swiper;
