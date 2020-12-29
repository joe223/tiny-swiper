import {
    attachListener,
    detachListener
} from '../core/render/dom'
import { SwiperInstance, SwiperPlugin } from '../core/index'
import { Options } from '../core/options'

export type SwiperPluginKeyboardControlOptions = {
    enabled: boolean
    onlyInViewport: boolean
}

export type SwiperPluginKeyboardControlPartialOptions = Partial<SwiperPluginKeyboardControlOptions> | boolean

export type SwiperPluginKeyboardInstance = {
    onKeyDown (e: Event): void
    enable (): void
    disable (): void
}

const DIRECTION = {
    up: 'ArrowUp',
    right: 'ArrowRight',
    down: 'ArrowDown',
    left: 'ArrowLeft'
}

// TODO: optimize
function isVisible (el: HTMLElement): boolean {
    if (!el) return false

    const style = getComputedStyle(el)
    const visible = style.visibility !== 'hidden' && style.display !== 'none'

    if (!visible) return false

    return el.parentElement && el.parentElement.nodeType === 1
        ? isVisible(el.parentElement)
        : true
}

function isElementInView (el: HTMLElement): boolean {
    const visibility = isVisible(el)
    const boundary = el.getBoundingClientRect()
    const isInView = (boundary.top >= 0 && boundary.bottom <= window.innerHeight)
        && (boundary.left >= 0 && boundary.right <= window.innerWidth)

    return isInView && visibility
}

/**
 * TinySwiper plugin for keyboard control.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default <SwiperPlugin>function SwiperPluginKeyboardControl (
    instance: SwiperInstance & {
        keyboard?: SwiperPluginKeyboardInstance
    },
    options: Options
): void {
    const isEnable = Boolean(options.keyboard)
    const keyboardOptions = <SwiperPluginKeyboardControlOptions>Object.assign({
        enabled: true,
        onlyInViewport: true
    }, options.keyboard)
    const keyboard: SwiperPluginKeyboardInstance = {
        enable (): void {
            keyboardOptions.enabled = true
        },
        disable (): void {
            keyboardOptions.enabled = false
        },
        onKeyDown (e: KeyboardEvent): void {
            const { key } = e

            if ((keyboardOptions.onlyInViewport && !isElementInView(instance.env.element.$el))
                || !keyboardOptions.enabled) return

            if (options.isHorizontal) {
                if (key === DIRECTION.left) {
                    instance.slideTo(instance.state.index - 1)
                } else if (key === DIRECTION.right) {
                    instance.slideTo(instance.state.index + 1)
                }
            } else {
                if (key === DIRECTION.down) {
                    instance.slideTo(instance.state.index - 1)
                } else if (key === DIRECTION.up) {
                    instance.slideTo(instance.state.index + 1)
                }
            }
        }
    }

    if (!isEnable) return

    instance.on('before-init', () => {
        instance.keyboard = keyboard

        attachListener(window, 'keydown', keyboard.onKeyDown as EventListener)
    })

    instance.on('after-destroy', () => {
        if (instance!.keyboard) {
            detachListener(window, 'keydown', keyboard.onKeyDown as EventListener)

            delete instance.keyboard
        }
    })
}
