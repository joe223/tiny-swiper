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

type mockElementParams = {
    width?: number
    height?: number
    classList?: string[]
}
export function mockElement ({
    width = 100,
    height = 100,
    classList = []
}: mockElementParams) {
    const el = document.createElement('div')

    el.style.width = `${width}px`
    el.style.height = `${height}px`
    el.classList.add(...classList)

    return el
}

export function createElementsInstance (
    listLength = 3,
    boundary = {
        width: 300,
        height: 300
    }
) {
    const $body = document.getElementsByTagName('body')[0]
    const $list = new Array(listLength)
        .fill(null)
        .map(() => mockElement({
            ...boundary,
            classList: [optionFormatter().slideClass]
        }))
    const $el = mockElement({
        ...boundary
    })
    const $wrapper = mockElement({
        classList: [optionFormatter().wrapperClass]
    })

    $wrapper.append(...$list)
    $el.appendChild($wrapper)
    $body.appendChild($el)

    return {
        $el,
        $wrapper,
        $list
    }
}

export function createOperationsInstance (
    userOptions: UserOptions = {},
    listLength = 3,
    elementsOptions?: { width: number; height: number } | undefined
) {
    const element = createElementsInstance(
        listLength,
        elementsOptions
    )
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
