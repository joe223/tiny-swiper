import { SwiperPlugin } from './index'
import { translate } from './render/layout'
import { State } from './state/index'
import { Env } from './env/index'
import { SwiperPluginLazyloadOptions } from '../modules/lazyload'
import { SwiperPluginPaginationOptions } from '../modules/pagination'
import { SwiperPluginKeyboardControlOptions } from '../modules/keyboardControl'

export type Direction = 'horizontal' | 'vertical'
export type Injections = {
    translate: (
        state: State,
        env: Env,
        options: Options,
        duration: number
    ) => void
}

export type Options = {
    direction: Direction
    touchRatio: number
    touchAngle: number
    longSwipesRatio: number
    initialSlide: number
    loop: boolean
    freeMode: boolean
    mousewheel: boolean
    passiveListeners: boolean
    resistance: boolean
    resistanceRatio: number
    speed: number
    longSwipesMs: number
    spaceBetween: number
    slidesPerView: number
    centeredSlides: boolean
    slidePrevClass: string
    slideNextClass: string
    slideActiveClass: string
    slideClass: string
    wrapperClass: string
    touchStartPreventDefault: boolean
    touchStartForcePreventDefault: boolean
    touchMoveStopPropagation: boolean
    excludeElements: Array<HTMLElement>
    isHorizontal: boolean
    plugins?: Array<SwiperPlugin>
    injections: Injections

    // Plugins
    lazyload?: SwiperPluginLazyloadOptions
    keyboard?: SwiperPluginKeyboardControlOptions
    pagination?: SwiperPluginPaginationOptions
}

export type UserOptions = Partial<Options>

const defaultOptions: UserOptions = {
    // `isHorizontal` is computed value
    direction: 'horizontal',
    touchRatio: 1,
    touchAngle: 45,
    longSwipesRatio: 0.5,
    initialSlide: 0,
    loop: false,
    freeMode: false,
    mousewheel: false,
    passiveListeners: true,
    resistance: true,
    resistanceRatio: 0.85,
    speed: 300,
    longSwipesMs: 300,
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: false,
    slidePrevClass: 'swiper-slide-prev',
    slideNextClass: 'swiper-slide-next',
    slideActiveClass: 'swiper-slide-active',
    slideClass: 'swiper-slide',
    wrapperClass: 'swiper-wrapper',
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchMoveStopPropagation: false,
    excludeElements: [],
    injections: {
        translate
    }
}

export function optionFormatter (userOptions?: UserOptions): Options {
    const options = <Options>{
        ...defaultOptions,
        ...userOptions
    }

    return {
        ...options,
        isHorizontal: options.direction === 'horizontal'
    }
}
