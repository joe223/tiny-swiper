import { UserOptions, optionFormatter, Options } from './options'
import { EventHub, LIFE_CYCLES } from './eventHub'
import { State } from './state/index'
import { Sensor } from './sensor/index'
import { Env } from './env/index'
import { Renderer } from './render/index'
import { Operations } from './state/operations'
import { Element } from './env/element'

export type SwiperInstance = {
    on: (evtName: string, cb: Function) => void
    off: (evtName: string, cb: Function) => void
    update: () => void
    destroy: () => void
    slideTo: (index: number, duration?: number) => void
    options: Options
    env: Env
    state: State
    updateSize: () => void

    // mount plugin instance
    [key: string]: any
}

export type SwiperPlugin = (instance: SwiperInstance, options: Options) => void

export type Swiper = {
    (el: HTMLElement | string, userOptions?: UserOptions): SwiperInstance
    new (el: HTMLElement | string, userOptions?: UserOptions): SwiperInstance
    use: (plugins: Array<SwiperPlugin>) => void
    plugins: Array<SwiperPlugin>
}

const Swiper: Swiper = <Swiper> function (
    el: HTMLElement | string,
    userOptions: UserOptions
): SwiperInstance {
    const options = optionFormatter(userOptions)
    const eventHub = EventHub()
    const element = Element(
        el,
        options
    )
    const env = Env(element, options)
    const state = State()
    const {
        on,
        off,
        emit
    } = eventHub
    const instance = {
        on,
        off,
        env,
        state,
        options
    } as SwiperInstance

    (options.plugins || Swiper.plugins || [])
        .forEach((plugin: SwiperPlugin) => plugin(
            instance,
            options
        ))

    emit(LIFE_CYCLES.BEFORE_INIT, instance)

    // Initialize internal module
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
        emit(LIFE_CYCLES.BEFORE_DESTROY, instance)
        sensor.detach()
        renderer.destroy()
        emit(LIFE_CYCLES.AFTER_DESTROY, instance)
        eventHub.clear()
    }

    function updateSize (): void {
        env.update(Element(
            el,
            options
        ))
        operations.update()
    }

    function update (): void {
        renderer.destroy()
        env.update(Element(
            el,
            options
        ))
        renderer.init()
        operations.update()
    }

    const {
        slideTo
    } = operations

    Object.assign(instance, {
        update,
        destroy,
        slideTo,
        updateSize
    })

    renderer.init()
    sensor.attach()
    slideTo(
        options.initialSlide,
        0
    )
    emit(LIFE_CYCLES.AFTER_INIT, instance)

    return instance
}

Swiper.use = (plugins: Array<SwiperPlugin>): void => {
    Swiper.plugins = plugins
}

export default Swiper
