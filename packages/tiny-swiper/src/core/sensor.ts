import { State } from './state/index'
import { Env } from './env/index'
import { attachListener, detachListener, getTranslate } from './render/dom'
import { Options } from './options'
import { Position } from './state/trace'
import { Operations } from './state/operations'

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
    const formEls = [
        'INPUT',
        'SELECT',
        'OPTION',
        'TEXTAREA',
        'BUTTON',
        'VIDEO'
    ]
    const {
        preheat,
        move,
        stop
    } = operations
    const {
        touchable
    } = env

    function getPosition (e: Event): Position {
        const touch = touchable ? (<TouchEvent>e).changedTouches[0] : <MouseEvent>e

        return {
            x: touch.pageX,
            y: touch.pageY
        }
    }

    function onTouchStart (e: Event): void {
        const {
            $wrapper
        } = env.element
        const shouldPreventDefault = (options.touchStartPreventDefault && formEls.indexOf((<HTMLElement>e.target).nodeName) === -1)
            || options.touchStartForcePreventDefault

        if (shouldPreventDefault && !options.passiveListeners) e.preventDefault()

        preheat(
            getPosition(e),
            getTranslate($wrapper, options.isHorizontal)
        )
    }

    function onTouchMove (e: Event): void {
        if (options.touchMoveStopPropagation) e.stopPropagation()

        move(getPosition(e))
        state.isTouching && e.preventDefault()
    }

    function onTouchEnd (e: Event): void {
        onTouchMove(e)
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
