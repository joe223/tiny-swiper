import {
    addClass,
    removeClass
} from '../lib.js'

/**
 * TinySwiper plugin for image lazy loading.
 *
 * @param {*} tinyswiper
 */
export default function SwiperPluginLazyload (instance) {
    const { config } = instance

    if (!config.lazyload) return

    instance.lazyload = {
        load (index) {
            const $slide = instance.$list[index]

            if (!$slide) return

            const $imgs = [].slice.call($slide.getElementsByClassName(config.lazyload.elementClass))
            const $preloaders = [].slice.call($slide.getElementsByClassName(config.lazyload.preloaderClass))

            function handleLoaded ($img) {
                $img.removeAttribute('data-src')
                addClass($img, [config.lazyload.loadedClass])
                removeClass($img, [config.lazyload.loadingClass])
                $img.onloaded = null
                $img.onerror = null
                $img.isLoaded = true

                if ($imgs.every(item => item.isLoaded)) {
                    $preloaders.forEach($preloader => {
                        $preloader.parentElement.removeChild($preloader)
                    })
                }
            }

            $imgs.forEach($img => {
                if (!$img.hasAttribute('data-src')) return

                const src = $img.getAttribute('data-src')

                addClass($img, [config.lazyload.loadingClass])
                removeClass($img, [config.lazyload.loadedClass])
                $img.src = src
                $img.onload = () => handleLoaded($img)
                $img.onerror = () => handleLoaded($img)
            })
        },

        loadRange (index, range) {
            instance.lazyload.load(index)

            if (config.lazyload.loadPrevNext && range >= 1) {
                for (let i = 1; i <= range; i++) {
                    instance.lazyload.load(index + i)
                    instance.lazyload.load(index - i)
                }
            }
        }
    }

    instance.on('before-init', () => {
        config.lazyload = {
            loadPrevNext: false,
            loadPrevNextAmount: 1,
            loadOnTransitionStart: false,
            elementClass: 'swiper-lazy',
            loadingClass: 'swiper-lazy-loading',
            loadedClass: 'swiper-lazy-loaded',
            preloaderClass: 'swiper-lazy-preloader',
            ...config.lazyload
        }
    })

    if (config.lazyload.loadOnTransitionStart) {
        instance.on('before-slide', function (oldIndex, tinyswiper, newIndex) {
            tinyswiper.lazyload.loadRange(newIndex, config.lazyload.loadPrevNextAmount)
        })
    } else {
        instance.on('after-slide', function (index, tinyswiper) {
            tinyswiper.lazyload.loadRange(index, config.lazyload.loadPrevNextAmount)
        })
    }

    instance.on('after-destroy', tinyswiper => {
        if (!tinyswiper.config.lazyload) return

        delete tinyswiper.lazyload
    })
}
