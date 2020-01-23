import { Engine } from '../engine/index'
import { Env } from '../env/index'
import { attachListener, detachListener, getTranslate } from '../render/dom'
import { Element } from '../element'
import { Options } from '../options'
import { Position } from '../engine/trace'

export type Sensor = {
    attach: () => void
    detach: () => void
}

// Only support single finger touch event.
export function Sensor (
    element: Element,
    env: Env,
    engine: Engine,
    options: Options
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
        $el,
        $wrapper
    } = element
    const {
        preheat,
        move,
        stop
    } = engine
    const {
        touchable
    } = env

    function getPostion (e: Event): Position {
        const touch = touchable ? (<TouchEvent>e).changedTouches[0] : <MouseEvent>e

        return {
            x: touch.pageX,
            y: touch.pageY
        }
    }

    function onTouchStart (e: Event): void {
        const shouldPreventDefault = (options.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1)
            || options.touchStartForcePreventDefault

        if (shouldPreventDefault && !options.passiveListeners) e.preventDefault()

        preheat(
            getPostion(e),
            getTranslate($wrapper, options.isHorizontal)
        )
    }

    function onTouchMove (e: Event): void {
        if (options.touchMoveStopPropagation) e.stopPropagation()

        move(getPostion(e), status => (status.isTouching && e.preventDefault()))
    }

    function onTouchEnd (e: Event): void {
        onTouchMove(e)
        stop()
    }

    function attach (): void {
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
