import { Options } from '../options'
import {
    removeClass, addClass, setStyle, setAttr
} from './dom'
import { State } from '../state/index'
import { Env } from '../env/index'

const shallowTag = 'data-shallow-slider'
const sliderTag = 'data-slider'

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
    function render (
        state: State,
        duration?: number,
        cb?: Function,
        force?: false
    ) {
        const {
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

        setStyle($wrapper, wrapperStyle)

        if (!state.isStart) {
            $wrapper.querySelectorAll(`[${sliderTag}]`).forEach($slide => {
                // eslint-disable-next-line no-bitwise
                const tagNumber = ~~<string>$slide.getAttribute(sliderTag)

                removeClass(<HTMLElement>$slide, [
                    options.slidePrevClass,
                    options.slideNextClass,
                    options.slideActiveClass
                ])

                if (tagNumber === index) {
                    addClass(<HTMLElement>$slide, options.slideActiveClass)
                }
                if (tagNumber === index - 1) {
                    addClass(<HTMLElement>$slide, options.slidePrevClass)
                }
                if (tagNumber === index + 1) {
                    addClass(<HTMLElement>$slide, options.slideNextClass)
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
        const $leftExpandList = $list.slice(-expand)
            .map($slide => <HTMLElement>$slide.cloneNode(true))
        const $rightExpandList = $list.slice(0, expand)
            .map($slide => <HTMLElement>$slide.cloneNode(true))

        $leftExpandList.forEach(($shadowSlide, index) => {
            $wrapper.appendChild(setAttr($rightExpandList[index], shallowTag))
            $wrapper.insertBefore(setAttr($leftExpandList[index], shallowTag), $list[0])
        })
    }

    function destroyExpandList (): void {
        env.element.$wrapper
            .querySelectorAll(`[${shallowTag}]`)
            .forEach(item => env.element.$wrapper.removeChild(item))
    }

    function updateDom (): void {
        env.element.$list.forEach((el, index) => setAttr(el, sliderTag, <any>index))

        destroyExpandList()
        appendExpandList()
    }

    function updateSize (): void {
        const {
            element,
            measure
        } = env
        const {
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
        $wrapper.querySelectorAll(`[${sliderTag}]`)
            .forEach($slide => setStyle(<HTMLElement>$slide, itemStyle))
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
