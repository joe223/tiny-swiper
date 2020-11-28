import {
    Actions
} from '../../src/core/sensor/actions'
import {
    createOperationsInstance
} from '../utils'

describe('Actions', () => {
    test('init', () => {
        const {
            env,
            state,
            options,
            operations
        } = createOperationsInstance()
        const actions = Actions(
            options,
            env,
            state,
            operations
        )

        expect(actions).toHaveProperty('preheat')
        expect(actions).toHaveProperty('move')
        expect(actions).toHaveProperty('stop')
    })

    test('move - disable loop', () => {
        const {
            env,
            state,
            options,
            operations
        } = createOperationsInstance({
            loop: false
        })
        const actions = Actions(
            options,
            env,
            state,
            operations
        )

        actions.preheat({
            x: 0,
            y: 0
        }, 0)

        expect(state).toHaveProperty('index', 0)
        expect(state).toHaveProperty('startTransform', 0)
        expect(state).toHaveProperty('isStart', true)
        expect(state).toHaveProperty('isScrolling', false)
        expect(state).toHaveProperty('isTouching', false)
        expect(state).toHaveProperty('transforms', 0)
        expect(state).toHaveProperty('progress', 0)
    })

    test('move - enable loop', () => {
        const {
            env,
            state,
            options,
            operations
        } = createOperationsInstance({
            loop: true
        })
        const actions = Actions(
            options,
            env,
            state,
            operations
        )

        actions.preheat({
            x: 0,
            y: 0
        }, 0)

        expect(state).toHaveProperty('index', 0)
        expect(state).toHaveProperty('startTransform', 0)
        expect(state).toHaveProperty('isStart', true)
        expect(state).toHaveProperty('isScrolling', false)
        expect(state).toHaveProperty('isTouching', false)
        expect(state).toHaveProperty('transforms', 0)
        expect(state.progress.toFixed(3)).toEqual('0.667')
    })

    test('stop', () => {
        const {
            env,
            state,
            options,
            operations
        } = createOperationsInstance({
            loop: false
        })
        const actions = Actions(
            options,
            env,
            state,
            operations
        )

        actions.preheat({
            x: 0,
            y: 0
        }, 0)
        actions.move({
            x: 0,
            y: 0
        })
        actions.stop()

        expect(state).toHaveProperty('index', 0)
        expect(state).toHaveProperty('startTransform', 0)
        expect(state).toHaveProperty('isStart', false)
        expect(state).toHaveProperty('isScrolling', false)
        expect(state).toHaveProperty('isTouching', false)
        expect(state).toHaveProperty('transforms', 0)
        expect(state).toHaveProperty('progress', 0)
    })

    test('stop - free Mode', done => {
        const {
            env,
            state,
            options,
            operations
        } = createOperationsInstance({
            loop: false,
            freeMode: true
        })

        let calledTimes = 0

        operations.scrollPixel = jest.fn(() => calledTimes++)

        const actions = Actions(
            options,
            env,
            state,
            operations
        )

        actions.preheat({
            x: 0,
            y: 0
        }, 0)

        setTimeout(() => {
            actions.move({
                x: -100,
                y: 0
            })
            actions.stop()

            setTimeout(() => {
                expect(calledTimes > 1).toBeTruthy()
                done()
            }, 100)
        }, 100)
    })
})
