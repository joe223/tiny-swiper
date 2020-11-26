import {
    Tick
} from '../../src/core/render/nextTick'
import {
    Animation
} from '../../src/core/render/animation'

describe('Tick', () => {
    test('init', () => {
        const tick = Tick()

        expect(tick).toHaveProperty('run')
        expect(tick).toHaveProperty('stop')
    })

    test('run', done => {
        const tick = Tick()
        const mockCallback = jest.fn()

        tick.run(mockCallback)

        setTimeout(() => {
            expect(mockCallback).toBeCalledTimes(1)
            done()
        }, 100)
    })

    test('cancel', done => {
        const tick = Tick()
        const mockCallback = jest.fn()

        tick.run(mockCallback)
        tick.stop()

        setTimeout(() => {
            expect(mockCallback).toBeCalledTimes(0)
            done()
        }, 100)
    })
})

describe('Animation', () => {
    test('init', () => {
        const animation = Animation()

        expect(animation).toHaveProperty('run')
        expect(animation).toHaveProperty('stop')
    })

    test('run', done => {
        let calledTimes = 0
        const animation = Animation()
        const mockCallback = jest.fn(e => calledTimes++)

        animation.run(mockCallback)
        expect(mockCallback).toBeCalledTimes(0)

        setTimeout(() => {
            animation.stop()
            expect(calledTimes > 1).toBeTruthy()
            done()
        }, 100)
    })

    test('cancel', done => {
        const animation = Animation()
        const mockCallback = jest.fn()

        animation.run(mockCallback)
        animation.stop()

        setTimeout(() => {
            expect(mockCallback).toBeCalledTimes(0)
            done()
        }, 100)
    })
})
