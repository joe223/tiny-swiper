import { Options } from '../options'

declare global {
    interface Window {
        DocumentTouch: any
    }
    const DocumentTouch: any
}

type Params = {
    options: Options
    $el: HTMLElement
}

export type Env = {
    touchable: boolean
}

export function Env (): Env {
    return {
        touchable: Boolean(
            'ontouchstart' in window
            || navigator.maxTouchPoints > 0
            || navigator.msMaxTouchPoints > 0
            || window.DocumentTouch && document instanceof DocumentTouch
        )
    }
}
