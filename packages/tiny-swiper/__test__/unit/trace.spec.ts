import {
    Tracker,
    Position
} from '../../src/core/state/trace'

function createTrackerInstance (): Tracker {
    const tracker = Tracker()

    tracker.push({
        x: 0,
        y: 0,
        time: 0
    } as Position)
    tracker.push({
        x: 1,
        y: 1,
        time: 5
    } as Position)
    tracker.push({
        x: 3,
        y: 4,
        time: 10
    } as Position)

    return tracker
}

describe('Trace', () => {
    test('init', () => {
        const tracker = createTrackerInstance()

        expect(tracker.getDuration()).toEqual(10)
        expect(tracker.getOffset()).toEqual({
            x: 3,
            y: 4
        })
        expect(tracker.vector()).toEqual({
            x: 2,
            y: 3,
            velocityX: 0.4,
            velocityY: 0.6,
            angle: Math.atan2(3, 2) * 180 / Math.PI
        })
    })

    test('clear', () => {
        const tracker = createTrackerInstance()

        expect(tracker.getLogs()).toEqual([
            {
                x: 0,
                y: 0,
                time: 0
            },
            {
                x: 1,
                y: 1,
                time: 5
            },
            {
                x: 3,
                y: 4,
                time: 10
            }
        ])
        tracker.clear()
        expect(tracker.getLogs()).toEqual([])
    })

    test('click action (only one log data)', () => {
        const tracker = Tracker()

        tracker.push({
            x: 0,
            y: 0,
            time: 0
        } as Position)

        expect(tracker.getDuration()).toEqual(0)
        expect(tracker.getOffset()).toEqual({
            x: 0,
            y: 0
        })
        expect(tracker.vector()).toEqual({
            x: 0,
            y: 0,
            velocityX: 0,
            velocityY: 0,
            angle: 0
        })
    })
})
