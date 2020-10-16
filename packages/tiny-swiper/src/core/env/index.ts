import { Options } from '../options'
import { Element } from './element'
import { Measure } from './measure'
import { Limitation } from './limitation'

declare global {
    interface Window {
        DocumentTouch: any
    }
    const DocumentTouch: any
}

export type Env = {
    touchable: boolean
    element: Element
    measure: Measure
    limitation: Limitation
    update (element: Element): void
}

export function Env (
    elem: Element,
    options: Options
): Env {
    const env = <Env>{}

    function update (element: Element): void {
        const measure = Measure(
            options,
            element
        )
        const limitation = Limitation(
            element,
            measure,
            options
        )
        const touchable = Boolean(
            'ontouchstart' in window
            || navigator.maxTouchPoints > 0
            || navigator.msMaxTouchPoints > 0
            || window.DocumentTouch && document instanceof DocumentTouch
        )

        Object.assign(env, {
            touchable,
            element,
            measure,
            limitation
        })
    }

    env.update = update

    update(elem)

    return env
}
