export function addClassName (el, list = []) {
    if (!Array.isArray(list)) list = [list]

    const newClassList = list.filter(claz => !new RegExp(`\\b${claz}\\b`).test(el.className))

    el.className = `${el.className} ${newClassList.join(' ')}`
}

export function removeClassName (el, list = []) {
    if (!Array.isArray(list)) list = [list]

    el.className = el.className.replace(
        new RegExp(`${list.map(item => `(\\b${item}\\b)`).join('|')}|(\\s+)`, 'g'), ' ')
}

export function detectTouch () {
    return Boolean(
        'ontouchstart' in window ||
        window.navigator.maxTouchPoints > 0 ||
        window.navigator.msMaxTouchPoints > 0 ||
        window.DocumentTouch && document instanceof DocumentTouch
    )
}
