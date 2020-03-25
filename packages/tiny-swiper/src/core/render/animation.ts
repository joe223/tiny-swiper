import { Tick } from './nextTick'

export type Animation = {
    run (task: (interval: DOMHighResTimeStamp) => void): void
    stop (): void
}

export function Animation (): Animation {
    const tick = Tick()

    function run (task: (interval: DOMHighResTimeStamp) => void): void {
        tick.run((interval: DOMHighResTimeStamp) => {
            run(task)
            task(interval)
        })
    }

    function stop (): void {
        tick.stop()
    }

    return {
        run,
        stop
    }
}
