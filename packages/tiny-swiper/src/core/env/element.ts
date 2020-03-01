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
    const $list = [].slice.call($el!.getElementsByClassName(options.slideClass))

    return {
        $el,
        $wrapper,
        $list
    }
}
