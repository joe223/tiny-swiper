import { now } from './timing'

export type Tick = {
    run (cb: (interval: DOMHighResTimeStamp) => void): void
    stop (): void
}

export function Tick (): Tick {
    let startTime: number | undefined
    let id: number
    const nextFrame = requestAnimationFrame || webkitRequestAnimationFrame || setTimeout
    const cancelNextFrame = cancelAnimationFrame || webkitCancelAnimationFrame || clearTimeout

    function run (cb: (interval: DOMHighResTimeStamp) => void): void {
        // eslint-disable-next-line no-void
        startTime = startTime === void 0
            ? now()
            : startTime

        // Why do not use callback argument:
        // https://stackoverflow.com/questions/50895206/exact-time-of-display-requestanimationframe-usage-and-timeline
        id = nextFrame(() => {
            const timeStamp = now()
            const interval = timeStamp - <number>startTime

            startTime = timeStamp
            cb(interval)
        })
    }

    function stop (): void {
        startTime = undefined
        cancelNextFrame(id)
    }

    return {
        run,
        stop
    }
}
