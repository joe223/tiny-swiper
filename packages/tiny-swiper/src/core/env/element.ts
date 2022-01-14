import { Options } from '../options'

export type Element = {
    $el: HTMLElement
    $list: Array<HTMLElement>
    $wrapper: HTMLElement
}

export function Element (
    el: HTMLElement | string,
    options: Options
): Element {
    const $el = <HTMLElement>(typeof el === 'string' ? document.body.querySelector(el) : el)
    const $wrapper = <HTMLElement>$el!.querySelector(`.${options.wrapperClass}`)
    let $list = [].slice.call($el!.getElementsByClassName(options.slideClass))
    $list = $list.filter((slide: HTMLElement) => slide.getAttribute('data-shallow-slider') === null)

    return {
        $el,
        $wrapper,
        $list
    }
}
