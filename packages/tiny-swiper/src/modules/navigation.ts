import {
    attachListener,
    detachListener
} from '../core/render/dom'
import {SwiperInstance} from '../core/index'
import {Options} from '../core/options'

export type SwiperPluginNavigationOptions = Options & {
    navigation: {
        nextEl: HTMLElement | string
        prevEl: HTMLElement | string
        disabledClass: string
    }
}

export type SwiperPluginNavigationInstance = {
    nextEl: HTMLElement
    prevEl: HTMLElement
}
export default function SwiperPluginNavigation(
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
        if (checkIsDisable(e) && !instance.options.loop) {
            return
        }
        const {
            index
        } = instance.state
        const {
            $list
        } = instance.env.element
        let currentIdx = index;

        if (type === 'next') {
            if (index < $list.length - 1) {
                instance.slideTo(index + 1);
            }
            if (currentIdx > $list.length) {
                currentIdx = index;
            }
            currentIdx++;
        }

        if (type === 'prev') {
            if (index > 0) {
                instance.slideTo(index - 1);
            }
            if (currentIdx < -1) {
                currentIdx = index;
            }
            currentIdx--;
        }
        // console.log(instance.options.loop, currentIdx, type)
        checkSwiperDisabledClass(currentIdx, $list.length - 1, type);
    }

    const checkSwiperDisabledClass = (
        index: number, last: number, type: string) => {
        const target = type === 'prev' ? -1 : last + 1;
        const slideToNum = type === 'prev' ? last : 0;
        if (navigation.nextEl.classList.contains(options.navigation.disabledClass)
            && type === 'prev') {
            navigation.nextEl.classList.remove(options.navigation.disabledClass);
        }

        if (navigation.prevEl.classList.contains(options.navigation.disabledClass)
            && type === 'next') {
            navigation.prevEl.classList.remove(options.navigation.disabledClass);
        }
        if (instance.options.loop) {
            if (index === target) {
                instance.slideTo(slideToNum);
            }
        } else {
            if (instance.state.index === 0) {
                navigation.prevEl.classList.add(options.navigation.disabledClass);
            }
            if (instance.state.index === last) {
                navigation.nextEl.classList.add(options.navigation.disabledClass);
            }
        }
    }

    const checkIsDisable = (e: HTMLElement) => {
        if (e.classList.contains(options.navigation.disabledClass)) {
            return true
        }
        return false
    }

    const checkButtonDefaultStatus = () => {
        const {
            index
        } = instance.state
        const {
            $list
        } = instance.env.element
        if (index === 0 ) {
            navigation.prevEl.classList.add(options.navigation.disabledClass);
        }
        if ($list.length === 1) {
            navigation.nextEl.classList.add(options.navigation.disabledClass);
        }
    }

    instance.on('before-init', () => {
        if (options.navigation) {
            options.navigation = Object.assign({
                disabledClass: 'swiper-button-disabled'
            }, options.navigation)
        }
    })

    instance.on('after-init', () => {
        if (!options.navigation) return

        navigation.nextEl = (typeof options.navigation.nextEl === 'string')
            ? document.body.querySelector(options.navigation.nextEl) as HTMLElement
            : options.navigation.nextEl
        navigation.prevEl = (typeof options.navigation.prevEl === 'string')
            ? document.body.querySelector(options.navigation.prevEl) as HTMLElement
            : options.navigation.prevEl
        if (!instance.options.loop) {
            checkButtonDefaultStatus();
        }
        attachListener(navigation.nextEl, 'click', <EventListener>nextClickHandler)
        attachListener(navigation.prevEl, 'click', <EventListener>prevClickHandler)
    })

    instance.on('after-destroy', () => {
        if (!options.navigation) return

        delete navigation.nextEl;
        delete navigation.prevEl;

        detachListener(navigation.nextEl, 'click', <EventListener>nextClickHandler)
        detachListener(navigation.prevEl, 'click', <EventListener>prevClickHandler)
    })
}
