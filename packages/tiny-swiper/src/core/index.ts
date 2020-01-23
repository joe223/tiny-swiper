import { UserOptions, Options, optionFormatter } from './options'
import { EventHub } from './eventHub'
import { Engine } from './engine/index'
import { Element } from './element'
import { Sensor } from './sensor/index'
import { Env } from './env/index'
import { Limitation } from './engine/limitation'
import { Measure } from './measure/index'
import { Renderer } from './render/index'

function Swiper (el: HTMLElement | string, userOptions: UserOptions) {
    const options = optionFormatter(userOptions)
    const eventHub = EventHub()
    const env = Env()

    let element: Element
    let measure: Measure
    let limitation: Limitation
    let renderer: Renderer
    let engine: Engine
    let sensor: Sensor

    function load () {
        element = Element(
            el,
            options
        )
        measure = Measure(
            options,
            element
        )
        limitation = Limitation(
            element,
            measure,
            options
        )
        renderer = Renderer(
            element,
            options
        )
        engine = Engine(
            limitation,
            options,
            measure,
            renderer,
            eventHub
        )
        sensor = Sensor(
            element,
            env,
            engine,
            options
        )
        renderer.init()
        sensor.attach()
    }

    function destory (): void {
        sensor.detach()
        eventHub.clear()
    }

    function update (): void {
        sensor.detach()
        load()
    }

    function on (evtName: string, cb: Function): void {
        eventHub.on(evtName, cb)
    }

    function off (evtName: string, cb: Function): void {
        eventHub.off(evtName, cb)
    }

    function slideTo (index: number, duration: number): void {
        engine.slideTo(index, duration)
    }

    load()

    return {
        on,
        off,
        update,
        destory
    }
}

export default Swiper
