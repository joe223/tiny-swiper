import {
    EventHub
} from '../../src/core/eventHub'

describe('EventHub', () => {
    test('Emit event', () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()
        const eventHub = EventHub()

        eventHub.on('event', callback1)
        eventHub.on('event', callback2)
        eventHub.emit('event')

        expect(callback1).toBeCalledTimes(1)
        expect(callback2).toBeCalledTimes(1)
    })

    test('Unsubscribe event', () => {
        const callback1 = jest.fn()
        const eventHub = EventHub()

        eventHub.on('event', callback1)
        eventHub.off('event', callback1)
        eventHub.emit('event')

        expect(callback1).toBeCalledTimes(0)
    })

    test('Irrelevant event callback won\'t be triggered', () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()
        const eventHub = EventHub()

        eventHub.on('event1', callback1)
        eventHub.on('event2', callback2)
        eventHub.emit('event1')

        expect(callback1).toBeCalledTimes(1)
        expect(callback2).toBeCalledTimes(0)
    })

    test('Clear all event subscription', () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()
        const eventHub = EventHub()

        eventHub.on('event1', callback1)
        eventHub.on('event2', callback2)
        eventHub.clear()
        eventHub.emit('event1')
        eventHub.emit('event2')

        expect(callback1).toBeCalledTimes(0)
        expect(callback2).toBeCalledTimes(0)
    })
})
