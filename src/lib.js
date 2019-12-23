export function addClass (el, list = []) {
    if (!Array.isArray(list)) list = [list]

    list.forEach(clz => (!el.classList.contains(clz) && el.classList.add(clz)))
}

export function removeClass (el, list = []) {
    if (!Array.isArray(list)) list = [list]

    list.forEach(clz => (el.classList.contains(clz) && el.classList.remove(clz)))
}

export function attachListener (el, evtName, handler, opts) {
    el.addEventListener(evtName, handler, opts)
}

export function detachListener (el, evtName, handler) {
    el.removeEventListener(evtName, handler)
}

export function removeAttr (el, attr) {
    el.removeAttribute(attr)
}

export function detectTouch () {
    return Boolean(
        'ontouchstart' in window
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0
        || window.DocumentTouch && document instanceof DocumentTouch
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
