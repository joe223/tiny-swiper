import { UserOptions, Options, optionFormatter } from './options'
import { EventHub } from './eventHub'
import { Engine } from './engine/index'
import { Element } from './element'
import { Sensor } from './sensor/index'
import { Env } from './env/index'
import { Limitation } from './engine/limitation'
import { Measure } from './measure/index'
import { Renderer } from './render/index'

export type SwiperPlugin = (instance: Swiper, options: Options) => void

export default class Swiper {
    static plugins: Array<SwiperPlugin>
    public options: Options
    public eventHub: EventHub
    public env: Env

    public element!: Element
    public measure!: Measure
    public limitation!: Limitation
    public renderer!: Renderer
    public engine!: Engine
    public sensor!: Sensor

    constructor (el: HTMLElement | string, userOptions: UserOptions) {
        this.options = optionFormatter(userOptions)
        this.eventHub = EventHub()
        this.env = Env();

        (this.options.plugins || Swiper.plugins || [])
            .forEach(<any>((plugin: SwiperPlugin) => plugin(this, this.options)))

        this.load()
    }

    static use (plugins: Array<SwiperPlugin>): void {
        Swiper.plugins = plugins
    }

    load (): void {
        this.element = Element(
            this.element.$el,
            this.options
        )
        this.measure = Measure(
            this.options,
            this.element
        )
        this.limitation = Limitation(
            this.element,
            this.measure,
            this.options,
            this.eventHub
        )
        this.renderer = Renderer(
            this.element,
            this.options,
            this.eventHub
        )
        this.engine = Engine(
            this.limitation,
            this.options,
            this.measure,
            this.renderer,
            this.eventHub
        )
        this.sensor = Sensor(
            this.element,
            this.env,
            this.engine,
            this.options,
            this.eventHub
        )
        this.renderer.init()
        this.sensor.attach()
    }

    destroy (): void {
        this.sensor.detach()
        this.eventHub.clear()
    }

    update (): void {
        this.sensor.detach()
        this.load()
    }

    on (evtName: string, cb: Function): void {
        this.eventHub.on(evtName, cb)
    }

    off (evtName: string, cb: Function): void {
        this.eventHub.off(evtName, cb)
    }

    slideTo (index: number, duration: number): void {
        this.engine.slideTo(index, duration)
    }
}
