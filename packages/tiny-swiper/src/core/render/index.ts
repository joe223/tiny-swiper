import { Options } from '../options'
import { removeClass, addClass, setStyle } from './dom'
import { State } from '../state/index'
import { Env } from '../env/index'

export type Renderer = {
    init (): void
    render (
        state: State,
        duration?: number,
        cb?: Function,
        force?: boolean
    ): void
    destroy (): void
    updateSize (): void
}

export function Renderer (
    env: Env,
    options: Options
): Renderer {
    let $leftExpandList: Array<HTMLElement> = []
    let $rightExpandList: Array<HTMLElement> = []

    function render (
        state: State,
        duration?: number,
        cb?: Function,
        force?: false
    ) {
        const {
            $list,
            $wrapper
        } = env.element
        const {
            index
        } = state
        const wrapperStyle = {
            transition: state.isStart
                ? 'none'
                : `transform ease ${duration === undefined ? options.speed : duration}ms`,
            transform: options.isHorizontal
                ? `translate3d(${state.transforms}px, 0, 0)`
                : `translate3d(0, ${state.transforms}px, 0)`
        }
        const $current = $list[index]
        const $prev = $list[index - 1]
        const $next = $list[index + 1]

        setStyle($wrapper, wrapperStyle)
        if (!state.isStart) {
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
        force && getComputedStyle($wrapper).transform
    }

    function appendExpandList (): void {
        if (!options.loop) return

        const {
            element,
            limitation
        } = env
        const {
            $list,
            $wrapper
        } = element
        const {
            expand
        } = limitation

        $leftExpandList = $list.slice(-expand)
            .map($slide => <HTMLElement>$slide.cloneNode(true))
        $rightExpandList = $list.slice(0, expand)
            .map($slide => <HTMLElement>$slide.cloneNode(true))

        $leftExpandList.forEach(($shadowSlide, index) => {
            $wrapper.appendChild($rightExpandList[index])
            $wrapper.insertBefore($leftExpandList[index], $list[0])
        })
    }

    function destroyExpandList (): void {
        const expandList = $leftExpandList.splice(0, $leftExpandList.length)
            .concat($rightExpandList.splice(0, $rightExpandList.length))

        expandList.forEach(item => env.element.$wrapper.removeChild(item))
    }

    function updateDom (): void {
        destroyExpandList()

        appendExpandList()
    }

    function updateSize (): void {
        const {
            element,
            measure
        } = env
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
            [options.isHorizontal ? 'width' : 'height']: `${measure.slideSize}px`,
            [options.isHorizontal ? 'margin-right' : 'margin-bottom']: `${options.spaceBetween}px`
        }

        setStyle($wrapper, wrapperStyle)

        $list.slice().concat($leftExpandList, $rightExpandList)
            .forEach($slide => setStyle($slide, itemStyle))
    }

    function init (): void {
        updateDom()
        updateSize()
    }

    function destroy (): void {
        const {
            $list,
            $wrapper
        } = env.element
        const arr = ['display', 'will-change', 'flex-direction']
        const itemProp = options.isHorizontal ? 'margin-right' : 'margin-bottom'

        arr.forEach((propertyName: string) => {
            $wrapper.style.removeProperty(propertyName)
        })
        $list.forEach($slide => $slide.style.removeProperty(itemProp))
        destroyExpandList()
    }

    return {
        init,
        render,
        destroy,
        updateSize
    }
}
