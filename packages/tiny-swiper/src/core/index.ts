import { UserOptions, optionFormatter, Options } from './options'
import { EventHub } from './eventHub'
import { State } from './state/index'
import { Element } from './env/element'
import { Sensor } from './sensor'
import { Env } from './env/index'
import { Limitation } from './env/limitation'
import { Measure } from './env/measure'
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
// export type Swiper = (el: HTMLElement | string, userOptions: UserOptions) => SwiperInstance

export interface Swiper {
    (el: HTMLElement | string, userOptions: UserOptions): SwiperInstance
    use: (plugins: Array<SwiperPlugin>) => void
    plugins: Array<SwiperPlugin>
}

const Swiper: Swiper = <Swiper> function (el: HTMLElement | string, userOptions: UserOptions): SwiperInstance {
    const options = optionFormatter(userOptions)
    const eventHub = EventHub()
    const env = Env(el, options)
    const state = State()

    const renderer = Renderer(
        env,
        options
    )
    const operations = Operations(
        env,
        state,
        options,
        renderer,
        eventHub
    )
    const sensor = Sensor(
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

    function updateSize (): void {
        env.update()
        operations.update()
        renderer.updateSize()
    }

    function update (): void {
        renderer.destroy()
        env.update()
        renderer.init()

        updateSize()
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
        env,
        state,
        options,
        on,
        off,
        update,
        destroy,
        slideTo,
        updateSize
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
