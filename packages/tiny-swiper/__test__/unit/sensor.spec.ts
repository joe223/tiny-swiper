import {
    Sensor
} from '../../src/core/sensor/index'
import { createOperationsInstance } from '../utils'

describe('Sensor', () => {
    test('init', () => {
        const {
            env,
            state,
            options,
            operations
        } = createOperationsInstance()
        const sensor = Sensor(
            env,
            state,
            options,
            operations
        )

        expect(sensor).toHaveProperty('attach')
        expect(sensor).toHaveProperty('detach')
    })

    test('attach and detach - touchable equal true', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        window.ontouchstart = (): void => {}

        const {
            env,
            state,
            options,
            operations
        } = createOperationsInstance()
        const sensor = Sensor(
            env,
            state,
            options,
            operations
        )
        const {
            $el
        } = env.element
        const addEvents: string[] = []
        const removeEvents: string[] = []

        $el.addEventListener = jest.fn(eventName => addEvents.push(eventName))
        $el.removeEventListener = jest.fn(eventName => removeEvents.push(eventName))

        sensor.attach()
        expect(addEvents).toEqual([
            'touchstart',
            'touchmove',
            'touchend',
            'touchcancel'
        ])

        sensor.detach()
        expect(removeEvents).toEqual([
            'touchstart',
            'touchmove',
            'touchend',
            'touchcancel',
            'mousedown'
        ])

        delete window.ontouchstart
    })

    test('attach and detach - touchable equal false', () => {
        const {
            env,
            state,
            options,
            operations
        } = createOperationsInstance()
        const sensor = Sensor(
            env,
            state,
            options,
            operations
        )
        const {
            $el
        } = env.element
        const addDocumentEvents: string[] = []
        const addContainerEvents: string[] = []
        const removeDocumentEvents: string[] = []

        document.addEventListener = jest.fn(eventName => addDocumentEvents.push(eventName))
        document.removeEventListener = jest.fn(eventName => removeDocumentEvents.push(eventName))
        $el.addEventListener = jest.fn(eventName => addContainerEvents.push(eventName))

        env.touchable = false

        sensor.attach()
        expect(addContainerEvents).toEqual([
            'mousedown'
        ])
        expect(addDocumentEvents).toEqual([
            'mousemove',
            'mouseup'
        ])

        sensor.detach()
        expect(removeDocumentEvents).toEqual([
            'mousemove',
            'mouseup'
        ])
    })
})
