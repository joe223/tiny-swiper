import * as detector from './detector'
import { UserOptions, Options, defaultOptions } from './options'
import { EventHub } from './eventHub'
import { Engine } from './engine/index'

export class Swiper extends EventHub {
    private $el: HTMLElement
    private $list: Array<HTMLElement>
    private options: Options
    private engine: Engine
    private isTouchable: boolean = detector.isTouchable()

    constructor (el: HTMLElement | string, userOptions: UserOptions) {
        super()
        this.options = {
            ...defaultOptions,
            ...userOptions
        }
        this.$el = typeof el === 'string' ? <HTMLElement>document.body.querySelector(el) : el
        this.$list = [].slice.call(this.$el.getElementsByClassName(this.config.slideClass))
        this.sensor = new Sensor()
        this.engine = new Engine({

        })
    }

    update (): void {

    }
}
