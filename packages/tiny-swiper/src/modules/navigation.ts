import {
    attachListener,
    detachListener
} from '../core/render/dom'
import { SwiperInstance, SwiperPlugin } from '../core/index'
import { Options } from '../core/options'

export type SwiperPluginNavigationOptions = {
    nextEl: HTMLElement | string
    prevEl: HTMLElement | string
    disabledClass: string
}

export type SwiperPluginNavigationPartialOptions = Partial<SwiperPluginNavigationOptions>

export type SwiperPluginNavigationInstance = {
    nextEl?: HTMLElement
    prevEl?: HTMLElement
}

export default <SwiperPlugin>function SwiperPluginNavigation (
    instance: SwiperInstance & {
        navigation?: SwiperPluginNavigationInstance
    },
    options: Options & {
        navigation?: SwiperPluginNavigationPartialOptions
    }
) {
    const isEnable = Boolean(options.navigation)
    const navigationInstance = {
        nextEl: null,
        prevEl: null
    } as unknown as SwiperPluginNavigationInstance
    const navigationOptions = <SwiperPluginNavigationOptions>Object.assign({
        disabledClass: 'swiper-button-disabled'
    }, options.navigation)
    const nextClickHandler = (e: PointerEvent) => {
        clickHandler(e.target as HTMLElement, 'next')
    }

    const prevClickHandler = (e: PointerEvent) => {
        clickHandler(e.target as HTMLElement, 'prev')
    }

    const clickHandler = (e: HTMLElement, type: 'next' | 'prev') => {
        if (checkIsDisable(e) && !instance.options.loop) {
            return
        }
        const {
            index
        } = instance.state

        if (type === 'next') {
            instance.slideTo(index + 1)
        }

        if (type === 'prev') {
            instance.slideTo(index - 1)
        }
    }

    const checkNavBtnDisabledClass = (index: number) => {
        const {
            minIndex,
            maxIndex
        } = instance.env.limitation
        if (
            navigationInstance
            && navigationInstance!.prevEl
            && navigationInstance!.nextEl
        ) {
            if (navigationInstance.nextEl.classList.contains(navigationOptions.disabledClass)
                && index >= minIndex) {
                navigationInstance.nextEl.classList.remove(navigationOptions.disabledClass)
            }
            if (navigationInstance.prevEl.classList.contains(navigationOptions.disabledClass)
                && index <= maxIndex) {
                navigationInstance.prevEl.classList.remove(navigationOptions.disabledClass)
            }

            if (index === minIndex) {
                navigationInstance.prevEl.classList.add(navigationOptions.disabledClass)
            }
            if (index === maxIndex) {
                navigationInstance.nextEl.classList.add(navigationOptions.disabledClass)
            }
        }
    }

    const checkIsDisable = (e: HTMLElement) => {
        return e.classList.contains(navigationOptions.disabledClass)
    }

    const checkButtonDefaultStatus = () => {
        const {
            index
        } = instance.state
        const {
            $list
        } = instance.env.element
        const {
            minIndex
        } = instance.env.limitation
        if (index === minIndex
            && navigationInstance.prevEl
        ) {
            navigationInstance.prevEl.classList.add(navigationOptions.disabledClass)
        }
        if ($list.length === minIndex
            && navigationInstance.nextEl
        ) {
            navigationInstance.nextEl.classList.add(navigationOptions.disabledClass)
        }
    }

    instance.on('before-slide', (currentIndex: number, state: never, newIndex: number) => {
        if (!instance.options.loop) {
            checkNavBtnDisabledClass(newIndex)
        }
    })

    instance.on('after-init', () => {
        if (!isEnable) return

        navigationInstance.nextEl = (typeof navigationOptions.nextEl === 'string')
            ? document.body.querySelector(navigationOptions.nextEl) as HTMLElement
            : navigationOptions.nextEl
        navigationInstance.prevEl = (typeof navigationOptions.prevEl === 'string')
            ? document.body.querySelector(navigationOptions.prevEl) as HTMLElement
            : navigationOptions.prevEl

        if (!instance.options.loop) {
            checkButtonDefaultStatus()
        }
        attachListener(<HTMLElement>navigationInstance.nextEl, 'click', <EventListener> nextClickHandler)
        attachListener(<HTMLElement>navigationInstance.prevEl, 'click', <EventListener> prevClickHandler)
    })

    instance.on('after-destroy', () => {
        if (navigationInstance
            && navigationInstance.prevEl
            && navigationInstance.nextEl
        ) {
            detachListener(<HTMLElement>navigationInstance.nextEl, 'click', <EventListener> nextClickHandler)
            detachListener(<HTMLElement>navigationInstance.prevEl, 'click', <EventListener> prevClickHandler)

            delete navigationInstance.nextEl
            delete navigationInstance.prevEl
        }
    })
}
