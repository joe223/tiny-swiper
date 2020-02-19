import { SwiperInstance } from '../core/index'
import { Options } from '../core/options'
import { Element } from '../core/element'
import { Limitation } from '../core/engine/limitation'
import { Measure } from '../core/measure/index'
import { EngineLayout } from '../core/engine/index'

export default function SwiperPluginLoop (
    instance: SwiperInstance,
    options: Options
) {
    function getExpand (element: Element): number {
        return options.slidesPerView >= element.$list.length
            ? options.slidesPerView - element.$list.length + 1
            : 1
    }

    if (!options.loop) return

    instance.on('init-limitation', (
        limitation: Limitation,
        element: Element,
        measure: Measure
    ): void => {
        const {
            $list
        } = element
        const {
            boxSize
        } = measure
        const expand = getExpand(element)
        const base = -expand * boxSize

        limitation.base += base
        limitation.max += base
        limitation.min += base
        limitation.maxIndex = $list.length - ((options.centeredSlides || options.loop) ? 1 : Math.ceil(options.slidesPerView))
    })

    instance.on('init-layout', (element: Element): void => {
        const {
            $list,
            $wrapper
        } = element
        const expand = getExpand(element)
        const leftExpandList = $list.slice(-expand)
            .map($slide => $slide.cloneNode(true))
        const rightExpandList = $list.slice(0, expand)
            .map($slide => $slide.cloneNode(true))

        leftExpandList.forEach(($shadowSlide, index) => {
            $wrapper.appendChild(rightExpandList[index])
            $wrapper.insertBefore(leftExpandList[index], $list[0])
        })
    })

    instance.on('before-slide', (
        targetIndex: number,
        layout: EngineLayout,
        limitation: Limitation,
        measure: Measure,
        transform: Function
    ): void => {
        const {
            boxSize
        } = measure
        const computedIndex = targetIndex < limitation.minIndex
            ? limitation.minIndex
            : targetIndex > limitation.maxIndex
                ? limitation.maxIndex
                : targetIndex
        const offset = -computedIndex * boxSize + limitation.base

        transform(offset > limitation.max
            ? limitation.max
            : offset < limitation.min
                ? limitation.min
                : offset)
        index = computedIndex // TODO
    })

    instance.on('after-slide', (): void => {

    })
}
