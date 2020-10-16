import { State } from '../state/index'
import { Env } from '../env/index'
import { setStyle } from './dom'
import { Options } from '../options'

export function translate (
    state: State,
    env: Env,
    options: Options,
    duration: number
): void {
    const {
        $wrapper
    } = env.element
    const wrapperStyle = {
        transition: state.isStart
            ? 'none'
            : `transform ease ${duration}ms`,
        transform: options.isHorizontal
            ? `translate3d(${state.transforms}px, 0, 0)`
            : `translate3d(0, ${state.transforms}px, 0)`
    }

    setStyle($wrapper, wrapperStyle)
}
