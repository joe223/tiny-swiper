import { Options } from '../options'
import { Element } from './element'

export type Measure = {
    boxSize: number
    viewSize: number
    slideSize: number
}

export function Measure (
    options: Options,
    element: Element
): Measure {
    const {
        $el
    } = element
    const viewSize = options.isHorizontal ? $el.offsetWidth : $el.offsetHeight
    const slideSize = (viewSize - (Math.ceil(options.slidesPerView - 1)) * options.spaceBetween) / options.slidesPerView
    const boxSize = slideSize + options.spaceBetween

    return {
        boxSize,
        viewSize,
        slideSize
    }
}
