import {
    attachListener,
    detachListener
} from '../core/render/dom'
import { SwiperInstance } from '../core/index'
import { Options } from '../core/options'

export type SwiperPluginNavigationOptions = Options & {
    navigation: {
        nextEl: HTMLElement | string
        prevEl: HTMLElement | string
        hideOnClick: boolean
        disabledClass: string
        hiddenClass: string
        lockClass: string
    }
}

export type SwiperPluginNavigationInstance = {
    nextEl: HTMLElement
    prevEl: HTMLElement
}
export default function SwiperPluginNavigation (
    instance: SwiperInstance & {
        navigation: SwiperPluginNavigationInstance
    },
    options: SwiperPluginNavigationOptions
) {
    const navigation = {
        nextEl: null,
        prevEl: null
    } as unknown as SwiperPluginNavigationInstance

    const nextClickHandler = (e: PointerEvent) => {
        clickHandler(e.target as HTMLElement, 'next');
    };

    const prevClickHandler = (e: PointerEvent) => {
        clickHandler(e.target as HTMLElement, 'prev');

    };

    const clickHandler = (e: HTMLElement, type: 'next' | 'prev') => {
        if (checkIsDisable(e)) {
            return
        }
        const {
            index
        } = instance.state
        const {
            $list
        } = instance.env.element

        if (type === 'next') {
            if (index < $list.length - 1) {
                instance.slideTo(index + 1);
            }
        }

        if (type === 'prev') {
            if (index > 0) {
                instance.slideTo(index - 1);
            }
        }
    }

    const checkIsDisable = (e: HTMLElement) => {
        if (e.classList.contains(options.navigation.disabledClass)
        || e.classList.contains(options.navigation.lockClass)) {
            return true
        }
        return false
    }

    instance.on('before-init', () => {
        if ( options.navigation ) {
            options.navigation = Object.assign({
                hideOnClick: false,
                disabledClass: 'swiper-button-disabled',
                hiddenClass: 'swiper-button-hidden',
                lockClass: 'swiper-button-lock'
            }, options.navigation)
        }
    })

    instance.on('after-init', () => {
        if ( !options.navigation ) return

        navigation.nextEl = (typeof options.navigation.nextEl === 'string')
            ? document.body.querySelector(options.navigation.nextEl) as HTMLElement
            : options.navigation.nextEl
        navigation.prevEl = (typeof options.navigation.prevEl === 'string')
            ? document.body.querySelector(options.navigation.prevEl) as HTMLElement
            : options.navigation.prevEl

        attachListener(navigation.nextEl, 'click', <EventListener> nextClickHandler)
        attachListener(navigation.prevEl, 'click', <EventListener> prevClickHandler)
    })

    instance.on('after-destroy', () => {
        if ( !options.navigation ) return

        delete navigation.nextEl;
        delete navigation.prevEl;

        detachListener(navigation.nextEl, 'click', <EventListener> nextClickHandler)
        detachListener(navigation.prevEl, 'click', <EventListener> prevClickHandler)
    })
}
