import { Position } from './trace'
import { State } from './index'
import { Limitation } from '../env/limitation'
import { EventHub } from '../eventHub'
import { Renderer } from '../render/index'
import { Options } from '../options'
import { Env } from '../env/index'

export interface Operations {
    update (): void
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

export function isExceedingLimits (
    velocity: number,
    transform: number,
    options: Options,
    limitation: Limitation
): boolean {
    return velocity > 0 && transform > (limitation.max)
        || velocity < 0 && transform < (limitation.min)
}


/**
 * Get transform exceed value
 * Return zero if is not reached border.
 *
 * @param transform
 * @param options
 * @param limitation
 */
export function getExcess (
    transform: number,
    options: Options,
    limitation: Limitation
): number {
    const exceedLeft = transform - limitation.max
    const exceedRight = transform - limitation.min

    return exceedLeft > 0
        ? exceedLeft
        : exceedRight < 0
            ? exceedRight
            : 0
}

export function Operations (
    env: Env,
    state: State,
    options: Options,
    renderer: Renderer,
    eventHub: EventHub
): Operations {
    function update (): void {

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
        const {
            measure,
            limitation
        } = env
        const len = limitation.maxIndex - limitation.minIndex + 1
        const computedIndex = options.loop
            ? (targetIndex % len + len) % len
            : targetIndex > limitation.maxIndex
                ? limitation.maxIndex
                : targetIndex < limitation.minIndex
                    ? limitation.minIndex
                    : targetIndex
        const offset = -computedIndex * measure.boxSize + limitation.base
        console.log(targetIndex, computedIndex, len)

        transform(offset > limitation.max
            ? limitation.max
            : offset < limitation.min
                ? limitation.min
                : offset)
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
        const {
            measure,
            limitation
        } = env
        const ratio = Number(px.toExponential().split('e')[1])
        const expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1

        let newTransform = transforms

        // For optimizing, do not calculate `px` if options.loop === true
        if (options.resistance && !options.loop) {
            if (px > 0 && transforms >= limitation.max) {
                px -= (px * expand) ** options.resistanceRatio / expand
            } else if (px < 0 && transforms <= limitation.min) {
                px += ((-px * expand) ** options.resistanceRatio) / expand
            }
        }

        newTransform += px

        if (options.loop) {
            const vector = state.tracker.vector()
            const velocity = options.isHorizontal ? vector.velocityX : vector.velocityY
            const excess = getExcess(transforms, options, limitation)

            if (excess && isExceedingLimits(
                velocity,
                transforms,
                options,
                limitation
            )) {
                newTransform = excess > 0
                    ? limitation.min - measure.boxSize * options.slidesPerView + excess
                    : limitation.max + measure.boxSize * options.slidesPerView + excess
            }
        }

        // console.log(state.tracker.vector().velocityX)
        // TODO: reached limitation when loop
        state.transforms = newTransform
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
        const {
            measure
        } = env
        const duration = tracker.getDuration()
        // const trans = state.transforms - state.startTransform
        const trans = tracker.getOffset()[options.isHorizontal ? 'x' : 'y']
        const jump = Math.ceil(Math.abs(trans) / measure.boxSize)
        const longSwipeIndex = Math.ceil(Math.abs(trans) / measure.boxSize - options.longSwipesRatio)

        state.isStart = false

        // console.log(index, state.transforms, state.startTransform, longSwipeIndex)
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
