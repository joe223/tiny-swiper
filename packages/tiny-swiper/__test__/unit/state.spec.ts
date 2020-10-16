import {
    State
} from '../../src/core/state/index'
import {
    Tracker
} from '../../src/core/state/trace'

describe('Tracker', () => {
    test('init', () => {
        const tracker = Tracker()

        expect(tracker).toHaveProperty('getDuration')
        expect(tracker).toHaveProperty('getOffset')
        expect(tracker).toHaveProperty('getLogs')
        expect(tracker).toHaveProperty('vector')
        expect(tracker).toHaveProperty('clear')
        expect(tracker).toHaveProperty('push')
    })
})

describe('State', () => {
    test('init', () => {
        const state = State()

        expect(state).toHaveProperty('index', 0)
        expect(state).toHaveProperty('startTransform', 0)
        expect(state).toHaveProperty('isStart', false)
        expect(state).toHaveProperty('isScrolling', false)
        expect(state).toHaveProperty('isTouching', false)
        expect(state).toHaveProperty('transforms', 0)
        expect(state).toHaveProperty('progress', 0)
    })
})
