import { Options } from '../options'
import { Element } from './element'
import { Measure } from './measure'
import { Limitation } from '../env/limitation'

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
    update (): void
}

export function Env (
    el: HTMLElement | string,
    options: Options
): Env {
    const env = <Env>{}

    function update (): void {
        const element = Element(
            el,
            options
        )
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

    update()

    return env
}
