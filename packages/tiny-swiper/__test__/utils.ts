import { optionFormatter, UserOptions } from '../src/core/options'
import { EventHub } from '../src/core/eventHub'
import { Env } from '../src/core/env/index'
import { State } from '../src/core/state/index'
import { Renderer } from '../src/core/render/index'
import { Operations } from '../src/core/state/operations'

Object.defineProperties(window.HTMLElement.prototype, {
    offsetLeft: {
        get () { return parseFloat(window.getComputedStyle(this).marginLeft) || 0 }
    },
    offsetTop: {
        get () { return parseFloat(window.getComputedStyle(this).marginTop) || 0 }
    },
    offsetHeight: {
        get () { return parseFloat(window.getComputedStyle(this).height) || 0 }
    },
    offsetWidth: {
        get () { return parseFloat(window.getComputedStyle(this).width) || 0 }
    }
})

export function mockElement (width = 100, height = 100) {
    const body = document.getElementsByTagName('body')[0]
    const el = document.createElement('div')

    body.appendChild(el)
    el.style.width = `${width}px`
    el.style.height = `${height}px`

    return el
}

export function createElementsInstance () {
    return {
        $el: mockElement(),
        $wrapper: mockElement(300, 300),
        $list: [
            mockElement(),
            mockElement(),
            mockElement()
        ]
    }
}

export function createOperationsInstance (userOptions: UserOptions = {}) {
    const element = createElementsInstance()
    const options = optionFormatter(userOptions)
    const eventHub = EventHub()
    const env = Env(element, options)
    const state = State()
    const renderer = Renderer(
        env,
        options
    )
    const operations = Operations(
        env,
        state,
        options,
        renderer,
        eventHub
    )

    return {
        env,
        state,
        options,
        renderer,
        eventHub,
        operations
    }
}
