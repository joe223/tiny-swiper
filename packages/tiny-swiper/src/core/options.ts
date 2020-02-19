import { SwiperPlugin } from './index'

export type Direction = 'horizontal' | 'vertical'

export type Options = {
    direction: Direction
    touchRatio: number
    touchAngle: number
    longSwipesRatio: number
    initialSlide: number
    loop: boolean
    freeMode: boolean
    mousewheel: boolean
    pagination: boolean
    passiveListeners: boolean
    resistance: boolean
    resistanceRatio: number
    speed: number
    longSwipesMs: number
    intermittent: number
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
    excludeElements: Array<HTMLElement | string>
    isHorizontal: boolean
    plugins?: Array<SwiperPlugin>
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
    pagination: false,
    passiveListeners: true,
    resistance: true,
    resistanceRatio: 0.85,
    speed: 300,
    longSwipesMs: 300,
    intermittent: 0,
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
    excludeElements: []
}

export function optionFormatter (userOptions: UserOptions): Options {
    const options = <Options>{
        ...defaultOptions,
        ...userOptions
    }

    return {
        ...options,
        isHorizontal: options.direction === 'horizontal'
    }
}
