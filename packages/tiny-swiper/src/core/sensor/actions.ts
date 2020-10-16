import { Position } from '../state/trace'
import { Options } from '../options'
import { Env } from '../env/index'
import { State } from '../state/index'
import { Operations } from '../state/operations'
import { Animation } from '../render/animation'

export type Actions = {
    preheat (
        originPosition: Position,
        originTransform: number
    ): void
    move (position: Position): void
    stop (): void
}

export function Actions (
    options: Options,
    env: Env,
    state: State,
    operations: Operations
) {
    const {
        initLayout,
        initStatus,
        render,
        scrollPixel,
        slideTo,
        getOffsetSteps
    } = operations
    const animation = Animation()

    function preheat (
        originPosition: Position,
        originTransform: number
    ): void {
        const { tracker } = state

        animation.stop()
        tracker.clear()
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
        const {
            touchRatio,
            touchAngle,
            isHorizontal
        } = options

        if (!state.isStart || state.isScrolling) return

        tracker.push(position)

        const vector = tracker.vector()
        const displacement = tracker.getOffset()

        // Ignore this move action if there is no displacement of screen touch point.
        // In case of minimal mouse move event. (Moving mouse extreme slowly will get the zero offset.)
        if (!displacement.x && !displacement.y) return

        if ((isHorizontal && (vector.angle < touchAngle))
            || (!isHorizontal && (90 - vector.angle) < touchAngle)
            || state.isTouching
        ) {
            const offset = vector[isHorizontal ? 'x' : 'y'] * touchRatio

            state.isTouching = true
            scrollPixel(offset)
            render()
        } else {
            state.isScrolling = true
            tracker.clear()
        }
    }

    function stop (): void {
        const {
            index,
            tracker
        } = state
        const {
            measure
        } = env

        state.isStart = false

        if (!options.freeMode || tracker.getLogs().length < 2) {
            const duration = tracker.getDuration()
            const trans = tracker.getOffset()[options.isHorizontal ? 'x' : 'y']
            const jump = Math.ceil(Math.abs(trans) / measure.boxSize)
            const longSwipeIndex = getOffsetSteps(trans)

            if (duration > options.longSwipesMs) {
                slideTo(index + longSwipeIndex * (trans > 0 ? -1 : 1))
            } else {
                // short swipe
                slideTo(trans > 0 ? index - jump : index + jump)
            }

            tracker.clear()
            initStatus()
        } else {
            const vector = tracker.vector()

            let velocity = vector[options.isHorizontal ? 'velocityX' : 'velocityY']

            animation.run((duration: number) => {
                const offset = velocity * duration

                velocity *= 0.98

                if (Math.abs(offset) < 0.004) {
                    animation.stop()
                    tracker.clear()
                    initStatus()
                } else {
                    scrollPixel(offset)
                    render(0)
                }
            })
        }
    }

    return {
        preheat,
        move,
        stop
    }
}
