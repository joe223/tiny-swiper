

type Params = {
    config: any,
    $el: HTMLElement
}

export type Env = {
    touchable: boolean,
    viewSize: number
}

export function createEnv ({
    $el,
    config
}: Params): Env {
    const isHorizontal = config.direction === 'horizontal'

    return {
        touchable: Boolean(
            'ontouchstart' in window
            || navigator.maxTouchPoints > 0
            || navigator.msMaxTouchPoints > 0
            || window.DocumentTouch && document instanceof DocumentTouch),
        viewSize: isHorizontal ? $el.offsetWidth : $el.offsetHeight
    }
}
