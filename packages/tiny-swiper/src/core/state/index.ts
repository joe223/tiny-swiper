import { Tracker } from './trace'

export interface State {
    tracker: Tracker
    index: number
    startTransform: number
    isStart: boolean
    isScrolling: boolean
    isTouching: boolean
    transforms: number
    progress: number
}

export function State (): State {
    const state: State = {
        tracker: Tracker(),
        index: 0,
        startTransform: 0,
        isStart: false,
        isScrolling: false,
        isTouching: false,
        transforms: 0,
        progress: 0
    }

    return state
}
