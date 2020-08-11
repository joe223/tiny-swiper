import { State } from '../state/index'
import { Env } from '../env/index'
import { setStyle } from './dom'

export function layout (
    state: State,
    // eslint-disable-next-line no-shadow
    env: Env,
    duration?: number,
    force?: false
): void {
    const {
        $wrapper
    } = env.element
    const timing = duration === undefined ? options.speed : duration
    const wrapperStyle = {
        transition: state.isStart
            ? 'none'
            : `transform ease ${timing}ms`,
        transform: options.isHorizontal
            ? `translate3d(${state.transforms}px, 0, 0)`
            : `translate3d(0, ${state.transforms}px, 0)`
    }

    setStyle($wrapper, wrapperStyle)

    force && getComputedStyle($wrapper).transform
}
