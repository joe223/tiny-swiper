import {
    attachListener,
    detachListener
} from '../lib.js'

const DIRECTION = {
    up: 'ArrowUp',
    right: 'ArrowRight',
    down: 'ArrowDown',
    left: 'ArrowLeft'
}

function isVisible (el) {
    if (!el) return false

    const style = getComputedStyle(el)
    const visible = style.visibility !== 'hidden' && style.display !== 'none'

    if (!visible) return false

    return el.parentElement && el.parentElement.nodeType === 1
        ? isVisible(el.parentElement)
        : true
}

function isElementInView (el) {
    const visibility = isVisible(el)
    const boundary = el.getBoundingClientRect()
    const isInView = (boundary.top >= 0 && boundary.bottom <= window.innerHeight)
        && (boundary.left >= 0 && boundary.right <= window.innerWidth)

    return isInView && visibility
}

/**
 * TinySwiper plugin for keyboard control.
 *
 * @param {TinySwiper} instance
 */
export default function SwiperPluginKeyboardControl (instance) {
    const { config } = instance

    if (!config.keyboard) return

    instance.keyboard = {
        enable () {
            instance.config.keyboard.enabled = true
        },
        disable () {
            instance.config.keyboard.enabled = false
        },
        onKeyDown (e) {
            const { key } = e

            if ((instance.config.keyboard.onlyInViewport && !isElementInView(instance.$el))
                || !instance.config.keyboard.enabled) return

            if (instance.isHorizontal) {
                if (key === DIRECTION.left) {
                    instance.scroll(instance.index - 1)
                } else if (key === DIRECTION.right) {
                    instance.scroll(instance.index + 1)
                }
            } else {
                if (key === DIRECTION.down) {
                    instance.scroll(instance.index - 1)
                } else if (key === DIRECTION.up) {
                    instance.scroll(instance.index + 1)
                }
            }
        }
    }

    instance.on('before-init', tinyswiper => {
        config.keyboard = {
            enabled: true,
            onlyInViewport: true,
            ...config.keyboard
        }

        attachListener(window, 'keydown', tinyswiper.keyboard.onKeyDown)
    })

    instance.on('after-destroy', tinyswiper => {
        if (!tinyswiper.keyboard) return

        detachListener(window, 'keydown', tinyswiper.keyboard.onKeyDown)

        delete tinyswiper.keyboard
    })
}
