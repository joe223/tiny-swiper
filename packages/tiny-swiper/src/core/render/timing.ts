type DebounceOptions = {
    trailing: boolean
}

export function now () {
    return performance ? performance.now() : Date.now()
}

export function debounce <T extends (...args: any) => any> (fn: T, threshold = 200, opt: DebounceOptions = {
    trailing: true
}): T {
    let lastCallTime: DOMHighResTimeStamp = 0
    let lastResult: ReturnType<T>
    let lastTimer: NodeJS.Timer | undefined

    return function (...args) {
        const currTime = now()

        if (currTime - lastCallTime >= threshold) {
            lastCallTime = currTime
            lastTimer = void 0
            lastResult = fn(...args)
        }

        if (opt.trailing) {
            lastTimer && clearTimeout(lastTimer)
            lastTimer = setTimeout(() => fn(...args), threshold)
        }

        return lastResult
    } as T
}
