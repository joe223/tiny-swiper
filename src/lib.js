export function addClassName (el, list = []) {
    if (!Array.isArray(list)) list = [list]

    el.className = `${el.className} ${list.join(' ')}`
}

export function removeClassName (el, list = []) {
    if (!Array.isArray(list)) list = [list]

    el.className = el.className.replace(
        new RegExp(`${list.map(item => `((\\s+|^)${item}(\\s+|$))`).join('|')}`), ' ')
}

export function detectTouch () {
    return Boolean(
        'ontouchstart' in window ||
        window.navigator.maxTouchPoints > 0 ||
        window.navigator.msMaxTouchPoints > 0 ||
        window.DocumentTouch && document instanceof DocumentTouch
    )
}
