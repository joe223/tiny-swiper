import {
    addClass,
    removeClass
} from '../core/render/dom'
import { SwiperInstance } from '../core/index'
import { Options } from '../core/options'

export type SwiperPluginPaginationOptions = Options & {
    pagination: {
        el: string
        clickable: false
        bulletClass: 'swiper-pagination-bullet'
        bulletActiveClass: 'swiper-pagination-bullet-active'
    }
}

export type SwiperPluginPaginationInstance = {
    $pageList: HTMLElement[]
    $pagination: HTMLElement | null
}

export default function SwiperPluginPagination (
    instance: SwiperInstance & {
        pagination: SwiperPluginPaginationInstance
    },
    options: SwiperPluginPaginationOptions
) {
    const pagination = {
        $pageList: [],
        $pagination: null
    } as unknown as SwiperPluginPaginationInstance

    instance.on('before-init', () => {
        if (options.pagination) {
            options.pagination = Object.assign({
                clickable: false,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active'
            }, options.pagination)
        }
    })

    instance.on('after-init', () => {
        if (!options.pagination) return

        const {
            bulletClass,
            bulletActiveClass
        } = options.pagination
        const {
            element
        } = instance.env
        const {
            $list
        } = element

        const $pagination = (typeof options.pagination.el === 'string'
            ? document.body.querySelector(options.pagination.el)
            : options.pagination.el) as HTMLElement
        const $pageList: Array<HTMLElement> = []
        const $group = document.createDocumentFragment()
        const dotCount = $list.length - Math.ceil(options.slidesPerView) + 1

        options.excludeElements.push($pagination as HTMLElement)

        pagination.$pagination = $pagination
        pagination.$pageList = $pageList

        for (let index = 0; index < dotCount; index++) {
            const $page = document.createElement('div')

            addClass(
                $page,
                index === instance.state.index ? [bulletClass, bulletActiveClass] : bulletClass
            )
            $pageList.push($page)
            $group.appendChild($page)
        }

        $pagination.appendChild($group)

        if (options.pagination.clickable) {
            $pagination.addEventListener('click', (e: Event) => {
                instance.slideTo($pageList.indexOf(e.target as HTMLElement))
                e.stopPropagation()
            })
        }
    })

    instance.on('after-destroy', () => {
        if (!options.pagination) return

        pagination.$pagination!.innerHTML = ''
        pagination.$pageList = []
        pagination.$pagination = null
    })

    instance.on('after-slide', (
        currentIndex: number
    ) => {
        const { bulletActiveClass } = options.pagination

        pagination.$pageList && pagination.$pageList.forEach(($page, index) => {
            if (index === currentIndex) {
                addClass($page, bulletActiveClass)
            } else {
                removeClass($page, bulletActiveClass)
            }
        })
    })
}
