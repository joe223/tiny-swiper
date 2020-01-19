import { Options } from '../options'
import { Vector } from '../sensor/vector'

export type Limitation = {
    min: number,
    max: number
}

export type Slide = {
    el: Element,
    size: number
}

type Params = {
    limitation: Limitation,
    viewSize: number,
    slides: Array<Slide>,
    options: Options
}
export class Engine {
    index!: number
    limitation!: Limitation
    slides!: Array<Slide>

    constructor (params: Params) {
        this.init(params)
    }

    init ({
        limitation,
        slides,
        options
    }: Params): void {
        this.limitation = limitation
        this.slides = slides
    }
    preheat (): void {

    }

    move (): void {

    }

    stop (vector?: Vector): void {

    }
}
