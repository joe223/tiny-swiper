import { Options } from '../options'
import { Position, Tracker } from './trace'
import { Limitation } from './limitation'
import { Env } from '../env/index'
import { Measure } from '../measure/index'
import { Renderer } from '../render/index'
import { EventHub } from '../eventHub'

export type Slide = {
    el: HTMLElement
    size: number
}

type Params = {
    limitation: Limitation
    options: Options
    env: Env
    measure: Measure
    renderer: Renderer
}

export type Engine = {
    preheat (
        position: Position,
        originTransform: number
    ): void
    move (position: Position, trailingCall?: (status: EngineStatus) => any): void
    stop (): void
    slideTo (targetIndex: number, duration?: number): void
    getStatus (): {
        index: number
    } & EngineLayout & EngineStatus
}

export type EngineStatus = {
    startTransform: number
    isStart: boolean
    isScrolling: boolean
    isTouching: boolean
}

export type EngineLayout = {
    transform: number
}

export function Engine (
    limitation: Limitation,
    options: Options,
    measure: Measure,
    renderer: Renderer,
    eventHub: EventHub
): Engine {
    const {
        boxSize
    } = measure
    const tracker = Tracker()

    let index = 0

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    let status = initStatus()

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    let layout = initLayout(0)

    function render (duration?: number): void {
        renderer.render({
            index,
            status,
            layout,
            duration
        })
    }

    function transform (trans: number): void {
        layout.transform = trans
    }

    function slideTo (targetIndex: number, duration?: number): void {
        const computedIndex = targetIndex < limitation.minIndex
            ? limitation.minIndex
            : targetIndex > limitation.maxIndex
                ? limitation.maxIndex
                : targetIndex
        const offset = -computedIndex * boxSize + limitation.base

        transform(offset > limitation.max
            ? limitation.max
            : offset < limitation.min
                ? limitation.min
                : offset)
        index = computedIndex

        render(duration)
    }

    function scrollPixel (px: number): void {
        const ratio = Number(px.toExponential().split('e')[1])
        const expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1
        const oldTransform = layout.transform

        if (options.resistance && !options.loop) {
            if (px > 0 && oldTransform >= limitation.max) {
                px -= (px * expand) ** options.resistanceRatio / expand
            } else if (px < 0 && oldTransform <= limitation.min) {
                px += ((-px * expand) ** options.resistanceRatio) / expand
            }
        }

        layout.transform += px
    }

    function initStatus (startTransform = 0): EngineStatus {
        return {
            startTransform,
            isStart: false,
            isScrolling: false,
            isTouching: false
        }
    }

    function initLayout (originTransform: number): EngineLayout {
        return {
            transform: originTransform
        }
    }

    function preheat (
        originPosition: Position,
        originTransform: number
    ): void {
        tracker.push(originPosition)
        layout = initLayout(originTransform)
        status = initStatus(originTransform)
        status.isStart = true

        render()
    }

    function move (position: Position, trailingCall?: (status: EngineStatus) => any): void {
        if (!status.isStart || status.isScrolling) return

        tracker.push(position)

        const vector = tracker.vector()

        let offset = 0

        if (options.isHorizontal) {
            if (vector.angle < options.touchAngle || status.isTouching) {
                status.isTouching = true
                offset = vector.x * options.touchRatio
            } else {
                status.isScrolling = true
            }
        } else {
            if ((90 - vector.angle) < options.touchAngle || status.isTouching) {
                status.isTouching = true
                offset = vector.y * options.touchRatio
            } else {
                status.isScrolling = true
            }
        }

        scrollPixel(offset)
        render()

        trailingCall && trailingCall(status)
    }

    function stop (): void {
        const duration = tracker.getDuration()
        const trans = layout.transform - status.startTransform
        const jump = Math.ceil(Math.abs(trans) / boxSize)
        const longSwipeIndex = Math.ceil(Math.abs(trans) / boxSize - options.longSwipesRatio)

        status.isStart = false

        // TODO: loop, limitation
        // long siwpe
        if (duration > options.longSwipesMs) {
            slideTo(index + longSwipeIndex * (trans > 0 ? -1 : 1))
        } else {
            // short swipe
            slideTo(trans > 0 ? index - jump : index + jump)
        }

        tracker.clear()
        status = initStatus()
    }

    function getStatus (): {
        index: number
    } & EngineLayout & EngineStatus {
        return {
            index,
            ...status,
            ...layout
        }
    }

    slideTo(options.initialSlide, 0)

    return {
        preheat,
        move,
        stop,
        slideTo,
        getStatus
    }
}
