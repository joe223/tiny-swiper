import { Options } from '../options'
import { Element } from './element'
import { Measure } from './measure'

export type Limitation = {
    min: number
    max: number
    base: number
    expand: number
    buffer: number
    minIndex: number
    maxIndex: number
}

export function getExpand (
    options: Options
): number {
    if (options.loop) {
        // return options.slidesPerView >= element.$list.length
        //     ? options.slidesPerView - element.$list.length + 1
        //     : 1
        return Math.ceil(options.slidesPerView)
    }
    return 0
}

export function Limitation (
    element: Element,
    measure: Measure,
    options: Options
): Limitation {
    const {
        $list
    } = element
    const {
        viewSize,
        slideSize,
        boxSize
    } = measure
    const expand = getExpand(options)
    const buffer = expand * boxSize
    const base = -buffer + (options.centeredSlides
        ? (viewSize - slideSize) / 2
        : 0)
    // [min, max] usually equal to [-x, 0]
    const max = base
    const min = options.spaceBetween + (options.loop ? slideSize : viewSize) + base - boxSize * $list.length
    const minIndex = 0
    const maxIndex = $list.length - ((options.centeredSlides || options.loop)
        ? 1
        : Math.ceil(options.slidesPerView))

    const limitation = {
        max,
        min,
        base,
        expand,
        buffer,
        minIndex,
        maxIndex
    }

    return limitation
}
