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

/**
 * Detect whether slides is rush out boundary.
 * @param velocity - Velocity larger than zero means that slides move to the right direction
 * @param transform
 * @param limitation
 */
export function isExceedingLimits (
    velocity: number,
    transform: number,
    limitation: Limitation
): boolean {
    return velocity > 0 && transform > (limitation.max)
        || velocity < 0 && transform < (limitation.min)
}

/**
 * Return the shortest way to target Index.
 *      Negative number indicate the left direction, Index's value is decreasing.
 *      Positive number means index should increase.
 * @param currentIndex
 * @param targetIndex
 * @param limitation
 * @param defaultWay
 */
export function getShortestWay (
    currentIndex: number,
    targetIndex: number,
    limitation: Limitation,
    defaultWay: number
): number {
    const {
        maxIndex,
        minIndex
    } = limitation

    // Source expression show below:
    // const shortcut = defaultWay > 0
    //     ? minIndex - currentIndex + (targetIndex - maxIndex) - 1
    //     : maxIndex - currentIndex + (targetIndex - minIndex) + 1

    const shortcut = (defaultWay > 0 ? 1 : -1) * (minIndex - maxIndex - 1)
        + targetIndex - currentIndex

    return Math.abs(defaultWay) > Math.abs(shortcut)
        ? shortcut
        : defaultWay
}

/**
 * Get transform exceed value
 * Return zero if is not reached border.
 *
 * @param transform
 * @param limitation
 */
export function getExcess (
    transform: number,
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

/**
 * The Set of state operations.
 * Every external Render/Sensor/DomHandler are called by this Internal state machine.
 * That gives us the possibility to run Tiny-Swiper in different platform.
 *
 * @param env
 * @param state
 * @param options
 * @param renderer
 * @param eventHub
 * @constructor
 */
export function Operations (
    env: Env,
    state: State,
    options: Options,
    renderer: Renderer,
    eventHub: EventHub
): Operations {

    /**
     * Calculate the steps amount (boxSize) of offset.
     *  eg: offset = 100, boxSize: 50, steps may equal to 2.
     * @param offset
     */
    function getOffsetSteps (offset: number): number {
        const {
            measure
        } = env
        return Math.ceil(Math.abs(offset) / measure.boxSize - options.longSwipesRatio)
    }

    /**
     * Call renderer's render function with default params.
     * @param duration
     * @param cb
     * @param force
     */
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

    /**
     * Update Swiper transform attr.
     * @param trans
     */
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

    /**
     * Update Swiper transform state with certain Index.
     * @param targetIndex
     * @param duration
     */
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
        const newTransform = -computedIndex * measure.boxSize + limitation.base

        // Slide to wrapper's boundary while touch end.
        //  Math.abs(excess) ≥ 0
        // Old condition: state.index === computedIndex
        if (getOffsetSteps(newTransform - state.transforms) !== 0
            && options.loop
        ) {
            const excess = getExcess(state.transforms, limitation)
            const defaultWay = computedIndex - state.index
            const shortcut = getShortestWay(
                state.index,
                computedIndex,
                limitation,
                defaultWay
            )

            if (shortcut !== defaultWay && !excess) {
                transform(shortcut < 0
                    ? limitation.min - measure.boxSize
                    : limitation.max + measure.boxSize)
            } else if (state.index === computedIndex) {
                transform(excess > 0
                    ? limitation.min - measure.boxSize + excess
                    : limitation.max + measure.boxSize + excess)
            }
            // Set initial offset for rebounding animation.
            render(0, undefined, true)
        }

        eventHub.emit(LIFE_CYCLES.BEFORE_SLIDE,
            state.index,
            state,
            computedIndex)
        state.index = computedIndex
        transform(newTransform)
        render(duration, () => {
            eventHub.emit(LIFE_CYCLES.AFTER_SLIDE,
                computedIndex,
                state)
        })
    }

    /**
     * Scroll pixel by pixel while user dragging.
     * @param px
     */
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
            const excess = getExcess(transforms, limitation)

            if (excess && isExceedingLimits(
                velocity,
                transforms,
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
