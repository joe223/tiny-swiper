import { State } from '../state/index'
import { Env } from '../env/index'
import { attachListener, detachListener, getTranslate } from '../render/dom'
import { Options } from '../options'
import { Position } from '../state/trace'
import { Actions } from './actions'
import { Operations } from '../state/operations'

export type Sensor = {
    attach: () => void
    detach: () => void
}

// Only support single finger touch event.
export function Sensor (
    env: Env,
    state: State,
    options: Options,
    operations: Operations
): Sensor {
    const {
        touchable
    } = env
    const formEls = [
        'INPUT',
        'SELECT',
        'OPTION',
        'TEXTAREA',
        'BUTTON',
        'VIDEO'
    ]
    const actions = Actions(options, env, state, operations)
    const {
        preheat,
        move,
        stop
    } = actions

    function getPosition (e: Event): Position {
        const touch = touchable ? (<TouchEvent>e).changedTouches[0] : <MouseEvent>e

        return {
            x: touch.pageX,
            y: touch.pageY
        }
    }

    function onTouchStart (e: Event): void {
        for (let i = 0; i < options.excludeElements.length; i++) {
            if (options.excludeElements[i].contains(e.target as Node)) return
        }

        const {
            $wrapper
        } = env.element
        const shouldPreventDefault = (options.touchStartPreventDefault && formEls.indexOf((<HTMLElement>e.target).nodeName) === -1)
            || options.touchStartForcePreventDefault

        // `preventDefault` can not be called with `passiveListeners`
        //      See: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        //      And: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
        if (!touchable && shouldPreventDefault) e.preventDefault()

        preheat(
            getPosition(e),
            getTranslate($wrapper, options.isHorizontal)
        )
    }

    function onTouchMove (e: Event): void {
        if (options.touchMoveStopPropagation) e.stopPropagation()

        move(getPosition(e))

        if (state.isTouching && e.cancelable !== false) e.preventDefault()
    }

    function onTouchEnd (): void {
        stop()
    }

    function attach (): void {
        const {
            $el
        } = env.element

        if (touchable) {
            attachListener($el, 'touchstart', onTouchStart, {
                passive: options.passiveListeners,
                capture: false
            })
            attachListener($el, 'touchmove', onTouchMove)
            attachListener($el, 'touchend', onTouchEnd)
            attachListener($el, 'touchcancel', onTouchEnd)
        } else {
            attachListener($el, 'mousedown', onTouchStart)
            attachListener(document, 'mousemove', onTouchMove)
            attachListener(document, 'mouseup', onTouchEnd)
        }
    }

    function detach (): void {
        const {
            $el
        } = env.element

        detachListener($el, 'touchstart', onTouchStart)
        detachListener($el, 'touchmove', onTouchMove)
        detachListener($el, 'touchend', onTouchEnd)
        detachListener($el, 'touchcancel', onTouchEnd)
        detachListener($el, 'mousedown', onTouchStart)
        detachListener(document, 'mousemove', onTouchMove)
        detachListener(document, 'mouseup', onTouchEnd)
    }

    return {
        attach,
        detach
    }
}
