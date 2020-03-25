export type Injections = {
    inject (key: string, injection: Function): void
    get (key: string, backup: Function): Function
}

export function Injections (): Injections {
    const injections: any = {}

    function inject (key: string, injection: Function): void {
        Object.defineProperty(injections, key, {
            value: injection,
            writable: false
        })
    }

    function get (key: string, backup: Function): Function {
        return injections[key] || backup
    }

    return {
        inject,
        get
    }
}
