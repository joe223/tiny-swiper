import {
    Operations,
    isExceedingLimits,
    getExcess,
    getShortestWay
} from '../../src/core/state/operations'
import { Position } from '../../src/core/state/trace'
import {
    createOperationsInstance
} from '../utils'

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

describe('Helpers', () => {
    describe('isExceedingLimits', () => {
        test('within the boundary', () => {
            // Velocity larger than zero: move to the right direction
            const velocity = 1
            const {
                env
            } = createOperationsInstance({
                loop: false
            })
            const {
                limitation
            } = env

            expect(isExceedingLimits(
                velocity,
                (limitation.max + limitation.min) / 2,
                limitation
            )).toEqual(false)
        })

        test('rush out boundary', () => {
            const velocity = 1
            const {
                env
            } = createOperationsInstance({
                loop: false
            })
            const {
                limitation
            } = env

            expect(isExceedingLimits(
                velocity,
                limitation.max,
                limitation
            )).toEqual(false)

            expect(isExceedingLimits(
                velocity,
                limitation.max + 1,
                limitation
            )).toEqual(true)
        })
    })

    describe('getShortestWay', () => {
        test('return default value', () => {
            const currentIndex = 0
            const targetIndex = 3
            const defaultWay = targetIndex - currentIndex
            const {
                env
            } = createOperationsInstance({
                loop: true
            }, 3)
            const {
                limitation
            } = env

            // Should move one step to right
            expect(getShortestWay(
                currentIndex,
                targetIndex,
                limitation,
                defaultWay
            )).toEqual(0)
        })

        test('Should move one step to right', () => {
            const currentIndex = 0
            const targetIndex = 4
            const defaultWay = targetIndex - currentIndex
            const {
                env
            } = createOperationsInstance({
                loop: true
            }, 3)
            const {
                limitation
            } = env

            expect(getShortestWay(
                currentIndex,
                targetIndex,
                limitation,
                defaultWay
            )).toEqual(1)
        })

        test('Should move two steps to left', () => {
            const currentIndex = 1
            const targetIndex = 4
            const defaultWay = targetIndex - currentIndex
            const {
                env
            } = createOperationsInstance({
                loop: true
            }, 5)
            const {
                limitation
            } = env

            expect(getShortestWay(
                currentIndex,
                targetIndex,
                limitation,
                defaultWay
            )).toEqual(-2)
        })
    })

    describe('getExcess', () => {
        test('not reached border', () => {
            const {
                env
            } = createOperationsInstance()
            const {
                limitation
            } = env

            expect(getExcess(
                limitation.max,
                limitation
            )).toEqual(0)
        })

        test('out of left border', () => {
            const excess = 1
            const {
                env
            } = createOperationsInstance()
            const {
                limitation
            } = env

            expect(getExcess(
                limitation.max + excess,
                limitation
            )).toEqual(excess)
        })

        test('out of right border', () => {
            const excess = 1
            const {
                env
            } = createOperationsInstance()
            const {
                limitation
            } = env

            expect(getExcess(
                limitation.min - excess,
                limitation
            )).toEqual(-excess)
        })
    })
})
