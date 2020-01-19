import {
    addClass,
    removeClass
} from '../lib.js'

export default function SwiperPluginPagination (instance) {
    instance.on('before-init', tinyswiper => {
        const { config } = tinyswiper

        if (config.pagination) {
            config.pagination = {
                clickable: false,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
                ...config.pagination
            }
        }
    })

    instance.on('after-init', tinyswiper => {
        const { config } = tinyswiper

        if (!config.pagination) return

        const {
            bulletClass,
            bulletActiveClass
        } = config.pagination

        const $pagination = typeof config.pagination.el === 'string'
            ? document.body.querySelector(config.pagination.el)
            : config.pagination.el
        const $pageList = []
        const $group = document.createDocumentFragment()

        config.excludeElements.push($pagination)
        tinyswiper.$pagination = $pagination
        tinyswiper.$pageList = $pageList

        tinyswiper.$list.forEach((item, index) => {
            const $page = document.createElement('div')

            addClass(
                $page,
                index === tinyswiper.index ? [bulletClass, bulletActiveClass] : bulletClass
            )
            $pageList.push($page)
            $group.appendChild($page)
        })

        $pagination.appendChild($group)

        if (config.pagination.clickable) {
            $pagination.addEventListener('click', e => {
                tinyswiper.scroll($pageList.indexOf(e.target))
                e.stopPropagation()
            })
        }
    })

    instance.on('after-destroy', tinyswiper => {
        const { config } = tinyswiper

        if (!config.pagination) return
        tinyswiper.$pagination.innerHTML = ''
        tinyswiper.$pageList = []
        tinyswiper.$pagination = null
    })

    instance.on('after-slide', (currentIndex, tinyswiper) => {
        const { bulletActiveClass } = tinyswiper.config.pagination

        tinyswiper.$pageList && tinyswiper.$pageList.forEach(($page, index) => {
            if (index === currentIndex) {
                addClass($page, bulletActiveClass)
            } else {
                removeClass($page, bulletActiveClass)
            }
        })
    })
}
