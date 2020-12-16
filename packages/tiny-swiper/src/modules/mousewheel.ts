import {
    attachListener,
    detachListener
} from '../core/render/dom'
import { SwiperInstance } from '../core/index'
import { Options } from '../core/options'

export type SwiperPluginMousewheelOptions = Options & {
    mousewheel: {
        invert: false
        sensitivity: 1
        interval: 400
    }
}

export type SwiperPluginMousewheelInstance = {
    $el: HTMLElement
}

export default function SwiperPluginMousewheel (
    instance: SwiperInstance & {
        mousewheel: SwiperPluginMousewheelInstance
    },
    options: SwiperPluginMousewheelOptions
) {
    const mousewheel = {
        $el: null
    } as unknown as SwiperPluginMousewheelInstance
    const wheelStatus = {
        wheeling: false,
        wheelDelta: 0,
        wheelingTimer: 0
    }
    const initWheelStatus = () => {
        wheelStatus.wheeling = false
        wheelStatus.wheelDelta = 0
        wheelStatus.wheelingTimer = 0
    }
    const handler = (e: WheelEvent) => {
        const delta = options.isHorizontal ? e.deltaX : e.deltaY
        const {
            index
        } = instance.state

        if ((Math.abs(delta) - Math.abs(wheelStatus.wheelDelta) > 0 || !wheelStatus.wheeling)
            && Math.abs(delta) >= options.mousewheel.sensitivity) {
            instance.slideTo(delta > 0 ? index - 1 : index + 1)
        }
        wheelStatus.wheelDelta = delta
        clearTimeout(wheelStatus.wheelingTimer)
        wheelStatus.wheeling = true
        wheelStatus.wheelingTimer = setTimeout(() => {
            initWheelStatus()
        }, options.mousewheel.interval) as unknown as number
        e.preventDefault()
        e.stopPropagation()
    }

    instance.on('before-init', () => {
        if (options.mousewheel) {
            options.mousewheel = Object.assign({
                invert: false,
                sensitivity: 1,
                interval: 400
            }, options.mousewheel)
        }
    })

    instance.on('after-init', () => {
        if (!options.mousewheel) return

        const {
            element
        } = instance.env
        const {
            $el
        } = element

        mousewheel.$el = $el

        attachListener($el, 'wheel', <EventListener>handler)
    })

    instance.on('after-destroy', () => {
        if (!options.mousewheel) return

        detachListener(mousewheel.$el, 'wheel', <EventListener>handler)
        delete mousewheel.$el
    })
}
