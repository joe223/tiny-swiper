declare global {
    interface Window {
        DocumentTouch: any
    }
    var DocumentTouch: any
}

export function isTouchable (): boolean {
    return Boolean(
        'ontouchstart' in window
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0
        || window.DocumentTouch && document instanceof DocumentTouch),
}
