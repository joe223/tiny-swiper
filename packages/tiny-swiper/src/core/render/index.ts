import { Options } from '../options'
import { EngineStatus, EngineLayout } from '../engine/index'
import { removeClass, addClass, updateStyle } from './dom'
import { Element } from '../element'

type Params = {
    $el: HTMLElement
    $list: Array<HTMLElement>
    options: Options
}

export type RenderParams = {
    index: number
    status: EngineStatus
    layout: EngineLayout
    duration?: number
}

export type Renderer = {
    init (): void
    render (renderParams: RenderParams, cb?: Function): void
}

export function Renderer (
    element: Element,
    options: Options
): Renderer {
    const {
        $list,
        $wrapper
    } = element

    function render (
        {
            index,
            layout,
            status,
            duration
        }: RenderParams,
        cb: Function
    ) {
        const wrapperStyle = {
            transition: status.isStart ? 'none' : `transform ease ${duration === void 0 ? options.speed : duration}ms`,
            transform: options.isHorizontal
                ? `translate3d(${layout.transform}px, 0, 0)`
                : `translate3d(0, ${layout.transform}px, 0)`
        }
        const $current = $list[index]
        const $prev = $list[index - 1]
        const $next = $list[index + 1]

        updateStyle($wrapper, wrapperStyle)
        if (!status.isStart) {
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

    function init () {
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
    }

    return {
        init,
        render
    }
}
