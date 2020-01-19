import { Vector } from './vector'

export type Offset = {
    x: number, // offset x
    y: number, // offset y
}

export type Position = {
    /**
     * postion in the x-axis
     */
    x: number,
    /**
     * postion in the y-axis
     */
    y: number
}

export type Trace = {
    /**
     * timestamp of current postion
     */
    time: number  // timestamp
} & Position

export type Track = {
    logs: Array<Trace>,
    push (postion: Position): void
    vector (index: number): Vector
}

export function Track (initPostion: Position): Track {
    return {
        logs: [
            {
                ...initPostion,
                time: Date.now()
            }
        ],

        push (postion: Position): void {
            this.logs.push({
                ...postion,
                time: Date.now()
            })
        },

        vector (index: number): Vector {
            return Vector(this, index)
        }
    }
}
