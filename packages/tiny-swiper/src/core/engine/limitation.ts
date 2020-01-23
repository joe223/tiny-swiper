import { Slide } from './index'
import { Options } from '../options'
import { Element } from '../element'
import { Measure } from '../measure/index'

export type Limitation = {
    min: number
    max: number
    base: number
    minIndex: number
    maxIndex: number
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
    const base = options.centeredSlides ? (slideSize - viewSize) / 2 : 0
    // [min, max] usually equal to [-x, 0]
    const max = base
    const min = options.spaceBetween + viewSize + base - boxSize * $list.length
    const minIndex = 0
    const maxIndex = $list.length - (options.centeredSlides ? 1 : Math.ceil(options.slidesPerView))

    return {
        max,
        min,
        base,
        minIndex,
        maxIndex
    }
}
