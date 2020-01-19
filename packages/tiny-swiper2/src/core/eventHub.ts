export class EventHub {
    private eventHub: {
        [key: string]: Array<Function>
    }

    constructor () {
        this.eventHub = {}
    }

    on (evtName: string, cb: Function) {
        const { eventHub } = this

        if (!eventHub[evtName]) {
            eventHub[evtName] = [cb]
        } else {
            eventHub[evtName].push(cb)
        }
    }

    off (evtName: string, cb: Function) {
        const { eventHub } = this

        if (eventHub[evtName]) {
            const index = eventHub[evtName].indexOf(cb)

            index > -1 && eventHub[evtName].splice(index, 1)
        }
    }

    emit (evtName: string, ...data: Array<any>) {
        const { eventHub } = this

        if (eventHub[evtName]) {
            eventHub[evtName].forEach(cb => cb(...data))
        }
    }
}
