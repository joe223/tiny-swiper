import { Element } from './element'
import { Options } from './options'

export function getExpand (
    options: Options,
    element: Element
): number {
    return options.slidesPerView >= element.$list.length
        ? options.slidesPerView - element.$list.length + 1
        : 1
}
