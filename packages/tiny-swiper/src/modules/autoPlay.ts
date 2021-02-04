import {
    attachListener,
    detachListener
} from '../core/render/dom'
import { SwiperInstance, SwiperPlugin } from '../core/index'
import { Options } from '../core/options'
import { LIFE_CYCLES } from '../core/eventHub'

export type SwiperPluginAutoPlayOptions = {
    delay: number
    disableOnInteraction: boolean
    reverseDirection: boolean
    stopOnLastSlide: boolean
    waitForTransition: boolean
}

export type SwiperPluginAutoPlayPartialOptions = Partial<SwiperPluginAutoPlayOptions> | boolean

export type SwiperPluginAutoPlayInstance = {}

/**
 * TinySwiper plugin for auto paly.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default <SwiperPlugin>function SwiperPluginAutoPlay (
    instance: SwiperInstance & {
        autoplay?: SwiperPluginAutoPlayInstance
    },
    options: Options
): void {
    const isEnable = Boolean(options.autoplay)

    if (!isEnable) return

    const autoPlayOptions = <SwiperPluginAutoPlayOptions>Object.assign({
        delay: 3000,
        disableOnInteraction: true,
        reverseDirection: false,
        stopOnLastSlide: false,
        waitForTransition: true
    }, options.autoplay)
    const hook = autoPlayOptions.waitForTransition
        ? LIFE_CYCLES.AFTER_SLIDE
        : LIFE_CYCLES.BEFORE_SLIDE
    const {
        touchable
    } = instance.env
    const {
        $el
    } = instance.env.element
    const autoPlayState = {
        pause: false,
        timeoutId: void 0
    }

    function play () {
        const {
            state,
            env
        } = instance

        if (!(autoPlayOptions.stopOnLastSlide && state.index >= env.limitation.maxIndex)
            && !autoPlayState.pause
            && !autoPlayState.timeoutId
        ) {
            autoPlayState.timeoutId = <any>setTimeout(() => {
                const newIndex = autoPlayOptions.reverseDirection
                    ? state.index - 1 : state.index + 1
                const computedIndex = newIndex > env.limitation.maxIndex
                    ? env.limitation.minIndex
                    : newIndex < env.limitation.minIndex
                        ? env.limitation.maxIndex
                        : newIndex

                instance.slideTo(computedIndex)
                autoPlayState.timeoutId = void 0
            }, autoPlayOptions.delay)
        }
    }

    function onTouchStart () {
        clearTimeout(autoPlayState.timeoutId)
        autoPlayState.pause = true
        autoPlayState.timeoutId = void 0
    }

    function onTouchEnd () {
        autoPlayState.pause = false
        play()
    }

    instance.on(
        hook,
        play
    )

    instance.on(LIFE_CYCLES.AFTER_INIT, () => {
        if (touchable) {
            attachListener($el, 'touchstart', onTouchStart)
            attachListener($el, 'touchend', onTouchEnd)
            attachListener($el, 'touchcancel', onTouchEnd)
        } else {
            attachListener($el, 'mousedown', onTouchStart)
            attachListener(document, 'mouseup', onTouchEnd)
        }
    })

    instance.on(LIFE_CYCLES.AFTER_DESTROY, () => {
        if (touchable) {
            detachListener($el, 'touchstart', onTouchStart)
            detachListener($el, 'touchend', onTouchEnd)
            detachListener($el, 'touchcancel', onTouchEnd)
        } else {
            detachListener($el, 'mousedown', onTouchStart)
            detachListener(document, 'mouseup', onTouchEnd)
        }
    })
}
