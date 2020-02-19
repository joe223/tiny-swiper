import { Options } from '../options'
import { Element } from '../element'
import { Measure } from '../measure'
import { getExpand } from '../shared'

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
    const expand = getExpand(options, element)
    const base = -expand * boxSize + (options.centeredSlides
        ? (slideSize - viewSize) / 2
        : 0)
    // [min, max] usually equal to [-x, 0]
    const max = base
    const min = options.spaceBetween + viewSize + base - boxSize * $list.length
    const minIndex = 0
    const maxIndex = $list.length - ((options.centeredSlides || options.loop)
        ? 1
        : Math.ceil(options.slidesPerView))

    const limitation = {
        max,
        min,
        base,
        minIndex,
        maxIndex
    }

    return limitation
}
