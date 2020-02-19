import { UserOptions, optionFormatter, Options } from './options'
import { EventHub } from './eventHub'
import { State } from './state/index'
import { Element } from './element'
import { Sensor } from './sensor'
import { Env } from './env'
import { Limitation } from './state/limitation'
import { Measure } from './measure'
import { Renderer } from './render/index'
import { Operations } from './state/operations'

export type SwiperInstance = {
    on: (evtName: string, cb: Function) => void
    off: (evtName: string, cb: Function) => void
    update: () => void
    destroy: () => void
    slideTo: (index: number, duration: number) => void
    options: Options
}
export type SwiperPlugin = (instance: SwiperInstance, options: Options) => void
export type Swiper = {
    (el: HTMLElement | string, userOptions: UserOptions): SwiperInstance
    use: (plugins: Array<SwiperPlugin>) => void
    plugins: Array<SwiperPlugin>
}

const Swiper: Swiper = <Swiper> function (el: HTMLElement | string, userOptions: UserOptions): SwiperInstance {
    const options = optionFormatter(userOptions)
    const eventHub = EventHub()
    const env = Env()
    const element = Element(
        el,
        options
    )
    const measure = Measure(
        options,
        element
    )
    const limitation = Limitation(
        element,
        measure,
        options
    )
    const renderer = Renderer(
        element,
        options,
        eventHub
    )
    const state = State()
    const operations = Operations(
        state,
        options,
        measure,
        limitation,
        renderer,
        eventHub
    )
    const sensor = Sensor(
        element,
        env,
        state,
        options,
        operations
    )

    function destroy (): void {
        sensor.detach()
        renderer.destroy()
        eventHub.clear()
    }

    function update (): void {
        const ele = Element(
            el,
            options
        )
        const meas = Measure(
            options,
            element
        )
        const limit = Limitation(
            element,
            measure,
            options
        )

        sensor.detach()
        operations.update(
            limit,
            meas
        )
        renderer.update(ele)
        renderer.init()
        sensor.attach
    }

    function on (evtName: string, cb: Function): void {
        eventHub.on(evtName, cb)
    }

    function off (evtName: string, cb: Function): void {
        eventHub.off(evtName, cb)
    }

    function slideTo (index: number, duration: number): void {
        operations.slideTo(index, duration)
    }

    const instance = {
        state,
        on,
        off,
        update,
        destroy,
        slideTo,
        options
    }

    function load (): void {
        (options.plugins || Swiper.plugins || [])
            .forEach((plugin: SwiperPlugin) => plugin(instance, options))

        renderer.init()
        sensor.attach()
        operations.slideTo(options.initialSlide || 0, 0)
    }

    load()

    return instance
}

Swiper.use = (plugins: Array<SwiperPlugin>): void => {
    Swiper.plugins = plugins
}

export default Swiper
