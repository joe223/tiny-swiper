import { State } from './index'
import { Limitation } from '../env/limitation'
import { EventHub, LIFE_CYCLES } from '../eventHub'
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
    initStatus (startTransform?: number): void
    initLayout (originTransform: number): void
    getOffsetSteps (offset: number): number
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
    function getOffsetSteps (offset: number): number {
        const {
            measure
        } = env
        return Math.ceil(Math.abs(offset) / measure.boxSize - options.longSwipesRatio)
    }

    function render (
        duration?: number,
        cb?: Function,
        force?: boolean
    ): void {
        renderer.render(
            state,
            duration,
            cb,
            force
        )
    }

    function transform (trans: number): void {
        const {
            min,
            max
        } = env.limitation
        const transRange = max - min + (options.loop ? env.measure.boxSize : 0)
        const len = transRange + 1

        let progress

        state.transforms = trans

        if (options.loop) {
            progress = (max - trans) % len / transRange

            state.progress = progress < 0
                ? 1 + progress
                : progress > 1
                    ? progress - 1
                    : progress
        } else {
            progress = (max - trans) / transRange

            state.progress = progress < 0
                ? 0
                : progress > 1
                    ? 1
                    : progress
        }

        eventHub.emit(LIFE_CYCLES.SCROLL, {
            ...state
        })
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

        // Slide over a cycle.
        if (state.index === computedIndex
            && getOffsetSteps(offset - state.transforms) !== 0
            && options.loop
        ) {
            const excess = getExcess(state.transforms, options, limitation)

            transform(excess > 0
                ? limitation.min - measure.boxSize + excess
                : limitation.max + measure.boxSize + excess)

            // Set initial offset for rebounding animation.
            render(0, undefined, true)
        }

        eventHub.emit(LIFE_CYCLES.BEFORE_SLIDE,
            state.index,
            state,
            computedIndex)
        state.index = computedIndex
        transform(offset)
        render(duration, () => {
            eventHub.emit(LIFE_CYCLES.AFTER_SLIDE,
                computedIndex,
                state)
        })
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
                    ? limitation.min - measure.boxSize + excess
                    : limitation.max + measure.boxSize + excess
            }
        }

        transform(newTransform)
    }

    function initStatus (startTransform = 0): void {
        state.startTransform = startTransform
        state.isStart = false
        state.isScrolling = false
        state.isTouching = false
    }

    function initLayout (originTransform: number): void {
        transform(originTransform)
    }

    function update (): void {
        slideTo(state.index, 0)
        renderer.updateSize()
    }

    return {
        update,
        render,
        transform,
        slideTo,
        scrollPixel,
        initStatus,
        initLayout,
        getOffsetSteps
    }
}
