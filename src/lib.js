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

/**
 * get Element transform
 * @param {HTMLElement} el
 * @param {Boolean} isHorizontal
 * @returns {Number}
 */
export function getTranslate (el, isHorizontal) {
    const matrix = getComputedStyle(el).transform.replace(/[a-z]|\(|\)|\s/g, '').split(',').map(parseFloat)
    let arr

    if (matrix.length === 16) {
        arr = matrix.slice(12, 14)
    } else if (matrix.length === 6) {
        arr = matrix.slice(4, 6)
    }
    return arr[isHorizontal ? 0 : 1] || 0
}
