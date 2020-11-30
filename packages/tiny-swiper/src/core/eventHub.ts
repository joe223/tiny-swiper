export type EventHub = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    on (evtName: string, cb: Function): void
    off (evtName: string, cb: Function): void
    emit (evtName: string, ...data: Array<any>): void
    clear (): void
}

export const LIFE_CYCLES = {
    BEFORE_INIT: 'before-init',
    AFTER_INIT: 'after-init',
    BEFORE_SLIDE: 'before-slide',
    SCROLL: 'scroll',
    AFTER_SLIDE: 'after-slide',
    BEFORE_DESTROY: 'before-destroy',
    AFTER_DESTROY: 'after-destroy'
}

export function EventHub (): EventHub {
    let hub: {
        [key: string]: Array<Function>
    } = {}

    function on (evtName: string, cb: Function): void {
        if (!hub[evtName]) {
            hub[evtName] = [cb]
        } else {
            hub[evtName].push(cb)
        }
    }

    function off (evtName: string, cb: Function): void {
        if (hub[evtName]) {
            const index = hub[evtName].indexOf(cb)

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            index > -1 && hub[evtName].splice(index, 1)
        }
    }

    function emit (evtName: string, ...data: Array<any>): void {
        if (hub[evtName]) {
            hub[evtName].forEach(cb => cb(...data))
        }
    }

    function clear (): void {
        hub = {}
    }

    return {
        on,
        off,
        emit,
        clear
    }
}
