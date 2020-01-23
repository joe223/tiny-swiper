import * as detector from './detector'
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
    const swiper = {}

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
        options
    )
    const engine = Engine(
        limitation,
        options,
        env,
        measure,
        renderer,
        eventHub
    )
    const sensor = Sensor(
        element,
        env,
        engine,
        options
    )

    sensor.attach()

    function update (): void {

    }

    function destory (): void {
        sensor.detach()
    }
}
