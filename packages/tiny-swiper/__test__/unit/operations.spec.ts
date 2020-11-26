import { Operations } from '../../src/core/state/operations'
import { Position } from '../../src/core/state/trace'
import {
    createOperationsInstance
} from '../../utils'

describe('Operations', () => {
    test('init', () => {
        const {
            state,
            operations
        } = createOperationsInstance()

        operations.initLayout(10)
        operations.initStatus(10)
        expect(state.transforms).toEqual(10)
    })

    describe('scrollPixel', () => {
        test('disable loop', () => {
            const {
                env,
                state,
                operations
            } = createOperationsInstance({
                loop: false,
                resistance: false,
                direction: 'horizontal'
            })
            const {
                element
            } = env

            operations.scrollPixel(element.$list.length * 2 * element.$el.offsetWidth)
            expect(state.transforms).toEqual(element.$list.length * 2 * element.$el.offsetWidth)
        })

        test('enable loop', () => {
            const {
                env,
                state,
                operations
            } = createOperationsInstance({
                loop: true,
                resistance: false,
                direction: 'horizontal'
            })
            const {
                limitation
            } = env

            state.tracker.push({
                x: 0,
                y: 0,
                time: 0
            } as Position)
            state.tracker.push({
                x: 10,
                y: 0,
                time: 20
            } as Position)
            operations.scrollPixel(10)
            expect(state.transforms).toEqual(limitation.min)
            operations.scrollPixel(10)
            expect(state.transforms).toEqual(limitation.min + 10)
        })

        test('enable resistance with resistanceRatio equal 0', () => {
            const {
                env,
                state,
                operations
            } = createOperationsInstance({
                loop: false,
                resistance: true,
                resistanceRatio: 0,
                direction: 'horizontal'
            })
            const {
                limitation
            } = env

            state.transforms = limitation.min
            operations.scrollPixel(-10)
            expect(state.transforms).toEqual(limitation.min - 9)
        })

        test('enable resistance with resistanceRatio equal 1', () => {
            const {
                state,
                operations
            } = createOperationsInstance({
                loop: false,
                resistance: true,
                resistanceRatio: 1,
                direction: 'horizontal'
            })

            operations.scrollPixel(10)
            expect(state.transforms).toEqual(0)
        })
    })

    describe('slideTo', () => {
        test('within range', () => {
            const {
                env,
                state,
                operations
            } = createOperationsInstance({
                loop: false,
                resistance: false,
                direction: 'horizontal'
            })

            const {
                measure,
                limitation
            } = env

            operations.slideTo(0)
            expect(state.transforms).toEqual(0)
            operations.slideTo(2)
            expect(state.transforms).toEqual(-measure.boxSize * 2)
            expect(state.transforms).toEqual(limitation.min)
        })

        test('out of range', () => {
            const {
                env,
                state,
                operations
            } = createOperationsInstance({
                loop: true,
                resistance: false,
                direction: 'horizontal'
            })

            const {
                measure,
                limitation
            } = env

            operations.slideTo(3)
            expect(state.transforms).toEqual(-measure.boxSize * 1)
            expect(state.transforms).toEqual(limitation.max)

            operations.slideTo(-1)
            expect(state.transforms).toEqual(-measure.boxSize * 3)
            expect(state.transforms).toEqual(limitation.min)

            operations.slideTo(5)
            expect(state.transforms).toEqual(-measure.boxSize * 3)
            expect(state.transforms).toEqual(limitation.min)
        })
    })
})
