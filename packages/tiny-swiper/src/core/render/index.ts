import { Options } from '../options'
import { removeClass, addClass, updateStyle } from './dom'
import { Element } from '../element'
import { EventHub } from '../eventHub'
import { State } from '../state/index'
import { getExpand } from '../shared'

export type Renderer = {
    init (): void
    render (
        instance: State,
        duration?: number,
        cb?: Function
    ): void
    update (ele: Element): void
    destroy (): void
}

export function Renderer (
    element: Element,
    options: Options,
    eventHub: EventHub
): Renderer {
    function render (
        instance: State,
        duration?: number,
        cb?: Function
    ) {
        const {
            $list,
            $wrapper
        } = element
        const {
            index
        } = instance
        const wrapperStyle = {
            transition: instance.isStart
                ? 'none'
                : `transform ease ${duration === undefined ? options.speed : duration}ms`,
            transform: options.isHorizontal
                ? `translate3d(${instance.transforms}px, 0, 0)`
                : `translate3d(0, ${instance.transforms}px, 0)`
        }
        const $current = $list[index]
        const $prev = $list[index - 1]
        const $next = $list[index + 1]

        updateStyle($wrapper, wrapperStyle)
        if (!instance.isStart) {
            $list.forEach(($slide, i) => {
                removeClass($slide, [
                    options.slidePrevClass,
                    options.slideNextClass,
                    options.slideActiveClass
                ])
                if (i === index) {
                    addClass($current, options.slideActiveClass)
                }
                if (i === index - 1) {
                    addClass($prev, options.slidePrevClass)
                }
                if (i === index + 1) {
                    addClass($next, options.slideNextClass)
                }
            })
        }
    }

    function init (): void {
        const {
            $list,
            $wrapper
        } = element
        const wrapperStyle = {
            display: 'flex',
            willChange: 'transform',
            flexDirection: options.isHorizontal ? 'row' : 'column'
        }
        const itemStyle = {
            [options.isHorizontal ? 'margin-right' : 'margin-bottom']: `${options.spaceBetween}px`
        }

        updateStyle($wrapper, wrapperStyle)
        $list.forEach($slide => updateStyle($slide, itemStyle))

        if (options.loop) {
            const expand = getExpand(options, element)
            const leftExpandList = $list.slice(-expand)
                .map($slide => $slide.cloneNode(true))
            const rightExpandList = $list.slice(0, expand)
                .map($slide => $slide.cloneNode(true))

            leftExpandList.forEach(($shadowSlide, index) => {
                $wrapper.appendChild(rightExpandList[index])
                $wrapper.insertBefore(leftExpandList[index], $list[0])
            })
        }
    }

    function destroy () {
        const {
            $list,
            $wrapper
        } = element
        const arr = ['display', 'will-change', 'flex-direction']
        const itemProp = options.isHorizontal ? 'margin-right' : 'margin-bottom'

        arr.forEach((propertyName: string) => {
            $wrapper.style.removeProperty(propertyName)
        })
        $list.forEach($slide => $slide.style.removeProperty(itemProp))
    }

    function update (ele: Element): void {
        element = ele
        init()
    }

    return {
        init,
        render,
        update,
        destroy
    }
}
