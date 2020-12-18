const delta = 180 / Math.PI

export type TraceLogs = Array<Trace>

export type Offset = {
    /**
     * offset x
     */
    x: number

    /**
     * offset y
     */
    y: number
}

export type Position = {
    /**
     * postion in the x-axis
     */
    x: number

    /**
     * postion in the y-axis
     */
    y: number
}

export type Trace = {
    /**
     * timestamp of current postion
     */
    time: number
} & Position

export type Tracker = {
    push (postion: Position): void
    vector (): Vector
    clear (): void
    getLogs (): TraceLogs
    getDuration (): number
    getOffset (): Offset
}

export type Vector = {
    /**
     * offset in the x-axis
     */
    x: number

    /**
     * offset in the y-axis
     */
    y: number

    /**
     * velocity in the x-axis
     */
    velocityX: number

    /**
     * velocity in the y-axis
     */
    velocityY: number

    /**
     * direction angle
     */
    angle: number
}

export function Vector (
    logs: TraceLogs,
    index: number
): Vector {
    const trace = logs[index]
    const formerTrace = logs[index - 1] || trace // In case click action, there will be only one log data
    const diff = {
        x: trace.x - formerTrace.x,
        y: trace.y - formerTrace.y
    }
    const duration = trace.time - formerTrace.time
    const velocityX = diff.x / duration || 0
    const velocityY = diff.y / duration || 0
    const angle = Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * delta

    return {
        ...diff,
        angle,
        velocityX,
        velocityY
    }
}

export function Tracker (): Tracker {
    let logs: TraceLogs = []

    function push (position: Position): void {
        logs.push({
            time: Date.now(),
            ...position
        })
    }

    function vector (): Vector {
        return Vector(logs, logs.length - 1)
    }

    function clear () {
        logs = []
    }

    function getLogs () {
        return logs
    }

    function getDuration (): number {
        const first = logs[0]
        const last = logs[logs.length - 1]

        return first ? last.time - first.time : 0
    }

    function getOffset (): Offset {
        const first = logs[0]
        const last = logs[logs.length - 1]

        return first ? {
            x: last.x - first.x,
            y: last.y - first.y
        } : {
            x: 0,
            y: 0
        }
    }

    return {
        getDuration,
        getOffset,
        getLogs,
        vector,
        clear,
        push
    }
}
