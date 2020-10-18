import {
    attachListener,
    detachListener
} from '../core/render/dom'
import { SwiperInstance } from '../core/index'
import { Options } from '../core/options'

declare type SwiperPluginKeyboardControlOptions = Options & {
    keyboard: {
        enabled: boolean
        onlyInViewport: boolean
    }
}

const DIRECTION = {
    up: 'ArrowUp',
    right: 'ArrowRight',
    down: 'ArrowDown',
    left: 'ArrowLeft'
}

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
export default function SwiperPluginKeyboardControl (
    instance: SwiperInstance & {
        keyboard: {
            onKeyDown (e: Event): void
            enable (): void
            disable (): void
        }
    },
    options: SwiperPluginKeyboardControlOptions
): void {
    if (!options.keyboard) return

    const keyboard = {
        enable (): void {
            options.keyboard.enabled = true
        },
        disable (): void {
            options.keyboard.enabled = false
        },
        onKeyDown (e: KeyboardEvent): void {
            const { key } = e

            if ((options.keyboard.onlyInViewport && !isElementInView(instance.env.element.$el))
                || !options.keyboard.enabled) return

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

    instance.on('before-init', () => {
        options.keyboard = {
            enabled: true,
            onlyInViewport: true,
            ...options.keyboard
        }

        instance.keyboard = keyboard

        attachListener(window, 'keydown', keyboard.onKeyDown as EventListener)
    })

    instance.on('after-destroy', () => {
        if (!keyboard) return

        detachListener(window, 'keydown', keyboard.onKeyDown as EventListener)

        delete instance.keyboard
    })
}
