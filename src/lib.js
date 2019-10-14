export function addClassName (el, list = []) {
    if (!Array.isArray(list)) list = [list]

    el.className = `${el.className} ${list.join(' ')}`
}

export function removeClassName (el, list = []) {
    if (!Array.isArray(list)) list = [list]

    el.className = el.className.replace(
        new RegExp(`${list.map(item => `((\\s+|^)${item}(\\s+|$))`).join('|')}`), ' ')
}
