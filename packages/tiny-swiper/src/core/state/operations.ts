import { Position } from './trace'
import { State } from './index'
import { Limitation } from './limitation'
import { Measure } from '../measure'
import { EventHub } from '../eventHub'
import { Renderer } from '../render/index'
import { Options } from '../options'

export interface Operations {
    update (
        limit: Limitation,
        mes: Measure
    ): void
    render (duration?: number): void
    transform (trans: number): void
    slideTo (
        targetIndex: number,
        duration?: number
    ): void
    scrollPixel (px: number): void
    initStatus (startTransform: number): void
    initLayout (originTransform: number): void
    preheat (
        originPosition: Position,
        originTransform: number
    ): void
    move (position: Position): void
    stop (): void
}

export function Operations (
    state: State,
    options: Options,
    measure: Measure,
    limitation: Limitation,
    renderer: Renderer,
    eventHub: EventHub
): Operations {
    function update (
        limit: Limitation,
        mes: Measure
    ): void {
        limitation = limit
        measure = mes
    }

    function render (duration?: number): void {
        renderer.render(
            state,
            duration
        )
    }

    function transform (trans: number): void {
        state.transforms = trans
    }

    function slideTo (
        targetIndex: number,
        duration?: number
    ): void {
        let computedIndex

        if (options.loop) {
            computedIndex = targetIndex < limitation.minIndex
                ? limitation.maxIndex - (limitation.minIndex - targetIndex) + 1
                : targetIndex > limitation.maxIndex
                    ? limitation.minIndex + (targetIndex - limitation.maxIndex) - 1
                    : targetIndex
            const offset = -targetIndex * measure.boxSize + limitation.base

            console.log(computedIndex, targetIndex, offset)
            transform(offset)
            // TODO
        } else {
            computedIndex = targetIndex < limitation.minIndex
                ? limitation.minIndex
                : targetIndex > limitation.maxIndex
                    ? limitation.maxIndex
                    : targetIndex
            const offset = -computedIndex * measure.boxSize + limitation.base

            transform(offset > limitation.max
                ? limitation.max
                : offset < limitation.min
                    ? limitation.min
                    : offset)
        }
        state.index = computedIndex

        eventHub.emit('before-slide',
            targetIndex,
            state)

        render(duration)
    }

    function scrollPixel (px: number): void {
        const {
            transforms
        } = state
        const ratio = Number(px.toExponential().split('e')[1])
        const expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1
        const oldTransform = transforms

        // For optimizing, do not calculate `px` if options.loop === true
        if (options.resistance && !options.loop) {
            if (px > 0 && oldTransform >= limitation.max) {
                px -= (px * expand) ** options.resistanceRatio / expand
            } else if (px < 0 && oldTransform <= limitation.min) {
                px += ((-px * expand) ** options.resistanceRatio) / expand
            }
        }

        // TODO: reached limitation when loop
        state.transforms += px
    }

    function initStatus (startTransform = 0): void {
        state.startTransform = startTransform
        state.isStart = false
        state.isScrolling = false
        state.isTouching = false
    }

    function initLayout (originTransform: number): void {
        state.transforms = originTransform
    }

    function preheat (
        originPosition: Position,
        originTransform: number
    ): void {
        const { tracker } = state

        tracker.push(originPosition)
        initLayout(originTransform)
        initStatus(originTransform)
        state.isStart = true

        render()
    }

    function move (position: Position): void {
        const {
            tracker
        } = state

        if (!state.isStart || state.isScrolling) return

        tracker.push(position)

        const vector = tracker.vector()

        let offset = 0

        if (options.isHorizontal) {
            if (vector.angle < options.touchAngle || state.isTouching) {
                state.isTouching = true
                offset = vector.x * options.touchRatio
            } else {
                state.isScrolling = true
            }
        } else {
            if ((90 - vector.angle) < options.touchAngle || state.isTouching) {
                state.isTouching = true
                offset = vector.y * options.touchRatio
            } else {
                state.isScrolling = true
            }
        }

        scrollPixel(offset)
        render()
    }

    function stop (): void {
        const {
            index,
            tracker
        } = state
        const duration = tracker.getDuration()
        const trans = state.transforms - state.startTransform
        const jump = Math.ceil(Math.abs(trans) / measure.boxSize)
        const longSwipeIndex = Math.ceil(Math.abs(trans) / measure.boxSize - options.longSwipesRatio)

        state.isStart = false

        console.log(index, state.transforms, state.startTransform, longSwipeIndex)
        // long siwpe
        if (duration > options.longSwipesMs) {
            slideTo(index + longSwipeIndex * (trans > 0 ? -1 : 1))
        } else {
            // short swipe
            slideTo(trans > 0 ? index - jump : index + jump)
        }

        tracker.clear()
        initStatus()
    }

    return {
        update,
        render,
        transform,
        slideTo,
        scrollPixel,
        initStatus,
        initLayout,
        preheat,
        move,
        stop
    }
}
