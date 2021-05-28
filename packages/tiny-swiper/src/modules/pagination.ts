import {
    addClass,
    removeClass,
    stringToElement
} from '../core/render/dom'
import { SwiperInstance, SwiperPlugin } from '../core/index'
import { Options } from '../core/options'

export type SwiperPluginPaginationOptions = {
    el: string
    clickable: boolean
    clickableClass: 'swiper-pagination-clickable'
    bulletClass: string | 'swiper-pagination-bullet'
    bulletActiveClass: string | 'swiper-pagination-bullet-active'
    renderBullet: Function
}

export type SwiperPluginPaginationPartialOptions = Partial<SwiperPluginPaginationOptions>

export type SwiperPluginPaginationInstance = {
    $pageList: HTMLElement[]
    $pagination: HTMLElement | null
}

export default <SwiperPlugin>function SwiperPluginPagination (
    instance: SwiperInstance & {
        pagination?: SwiperPluginPaginationInstance
    },
    options: Options & {
        pagination?: SwiperPluginPaginationPartialOptions
    }
) {
    const isEnable = Boolean(options.pagination)
    const paginationOptions = <SwiperPluginPaginationOptions>Object.assign({
        clickable: false,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        clickableClass: 'swiper-pagination-clickable'
    }, options.pagination)
    const paginationInstance = {
        $pageList: [],
        $pagination: null
    } as unknown as SwiperPluginPaginationInstance

    if (!isEnable) return

    instance.on('after-init', () => {
        const {
            bulletClass,
            bulletActiveClass,
            clickableClass,
            renderBullet
        } = <SwiperPluginPaginationOptions>paginationOptions
        const {
            element
        } = instance.env
        const {
            $list
        } = element

        const $pagination = (typeof paginationOptions.el === 'string'
            ? document.body.querySelector(paginationOptions.el)
            : paginationOptions.el) as HTMLElement
        const $pageList: Array<HTMLElement> = []
        const $group = document.createDocumentFragment()
        const dotCount = $list.length - Math.ceil(options.slidesPerView) + 1

        options.excludeElements.push($pagination as HTMLElement)

        paginationInstance.$pagination = $pagination
        paginationInstance.$pageList = $pageList

        for (let index = 0; index < dotCount; index++) {
            const $page = renderBullet ? stringToElement(renderBullet(index, bulletClass)) : document.createElement('div')

            addClass(
                $page,
                index === instance.state.index ? [bulletClass, bulletActiveClass] : bulletClass
            )
            $pageList.push($page)
            $group.appendChild($page)
        }

        $pagination.appendChild($group)

        if (paginationOptions.clickable) {
            addClass($pagination, clickableClass)

            $pagination.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement
                if (!target) return
                e.preventDefault()
                const bulletElement = target.closest(`.${bulletClass}`)
                instance.slideTo($pageList.indexOf(bulletElement as HTMLElement))
                e.stopPropagation()
            })
        }
    })

    instance.on('after-destroy', () => {
        if (!isEnable) return

        paginationInstance.$pagination!.innerHTML = ''
        paginationInstance.$pageList = []
        paginationInstance.$pagination = null
    })

    instance.on('after-slide', (
        currentIndex: number
    ) => {
        const { bulletActiveClass } = paginationOptions

        paginationInstance.$pageList && paginationInstance.$pageList.forEach(($page, index) => {
            if (index === currentIndex) {
                addClass($page, bulletActiveClass)
            } else {
                removeClass($page, bulletActiveClass)
            }
        })
    })
}
