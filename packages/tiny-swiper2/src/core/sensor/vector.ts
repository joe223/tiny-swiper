import { Track } from './trace'

const delta = 180 / Math.PI

export type Vector = {
    /**
     * offset in the x-axis
     */
    x: number,

    /**
     * offset in the y-axis
     */
    y: number,

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
    track: Track,
    index: number
): Vector {
    const trace = track.logs[index]
    const formerTrace = track.logs[index - 1]
    const diff = {
        x: trace.x - formerTrace.x,
        y: trace.y - formerTrace.y
    }
    const duration = trace.time - formerTrace.time
    const velocityX = diff.x / duration
    const velocityY = diff.y / duration
    const angle = Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * delta

    return {
        ...diff,
        angle,
        velocityX,
        velocityY
    }
}
