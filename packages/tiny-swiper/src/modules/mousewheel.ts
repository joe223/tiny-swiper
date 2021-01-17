import {
    attachListener,
    detachListener
} from '../core/render/dom'
import { SwiperInstance, SwiperPlugin } from '../core/index'
import { Options } from '../core/options'

export type SwiperPluginMousewheelOptions = {
    invert: boolean
    sensitivity: number
    interval: number
}

export type SwiperPluginMousewheelPartialOptions = Partial<SwiperPluginMousewheelOptions>

export type SwiperPluginMousewheelInstance = {
    $el?: HTMLElement
}

export default <SwiperPlugin>function SwiperPluginMousewheel (
    instance: SwiperInstance & {
        mousewheel?: SwiperPluginMousewheelInstance
    },
    options: Options & {
        mousewheel?: SwiperPluginMousewheelPartialOptions
    }
) {
    const isEnable = Boolean(options.mousewheel)
    const mousewheelOptions = <SwiperPluginMousewheelOptions>Object.assign({
        invert: false,
        sensitivity: 1,
        interval: 400
    }, options.mousewheel)
    const mousewheelInstance = {
        $el: null
    } as unknown as SwiperPluginMousewheelInstance
    const wheelStatus = {
        wheeling: false,
        wheelDelta: 0,
        wheelingTimer: 0
    }
    const handler = (e: WheelEvent) => {
        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)

        if (options.isHorizontal !== isHorizontal) return

        const delta = isHorizontal
            ? e.deltaX
            : e.deltaY
        const {
            index
        } = instance.state

        if ((Math.abs(delta) - Math.abs(wheelStatus.wheelDelta) > 0)
            && !wheelStatus.wheeling
            && Math.abs(delta) >= mousewheelOptions.sensitivity
        ) {
            const step = mousewheelOptions.invert ? 1 : -1

            instance.slideTo(delta > 0
                ? index - step
                : index + step
            )
            wheelStatus.wheeling = true
            wheelStatus.wheelingTimer = setTimeout(() => {
                wheelStatus.wheeling = false
            }, mousewheelOptions.interval) as unknown as number
        }
        wheelStatus.wheelDelta = delta
        e.preventDefault()
        e.stopPropagation()
    }

    instance.on('after-init', () => {
        if (!isEnable) return

        const {
            element
        } = instance.env
        const {
            $el
        } = element

        mousewheelInstance.$el = $el

        attachListener($el, 'wheel', <EventListener>handler)
    })

    instance.on('after-destroy', () => {
        if (!isEnable) return

        detachListener(<HTMLElement>mousewheelInstance.$el, 'wheel', <EventListener>handler)

        delete mousewheelInstance.$el
    })
}
