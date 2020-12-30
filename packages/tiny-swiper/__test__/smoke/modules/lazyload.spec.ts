import {
    defaultStyle,
    testPluginLifcycle
} from '../../common'
import SwiperPluginLazyload from '../../../src/modules/lazyload'

describe('Plugin - SwiperPluginLazyload', () => {
    testPluginLifcycle(
        `
        ${defaultStyle}
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img data-src="https://user-images.githubusercontent.com/10026019/96359483-eb1e9e00-1145-11eb-8f56-8851a4d5b996.png" 
                        class="swiper-lazy">
                    <div class="swiper-lazy-preloader"></div>
                </div>
                <div class="swiper-slide">
                    <img data-src="https://user-images.githubusercontent.com/10026019/96359484-eeb22500-1145-11eb-8a1c-f6012b469811.png" 
                        class="swiper-lazy">
                    <div class="swiper-lazy-preloader"></div>
                </div>
                <div class="swiper-slide">
                    <img data-src="https://user-images.githubusercontent.com/10026019/96359486-f07be880-1145-11eb-91e1-d539cfb97485.png" 
                        class="swiper-lazy">
                    <div class="swiper-lazy-preloader"></div>
                </div>
                <div class="swiper-slide">
                    <img data-src="https://user-images.githubusercontent.com/10026019/96359487-f245ac00-1145-11eb-898a-3edca14d2f78.png" 
                        class="swiper-lazy">
                    <div class="swiper-lazy-preloader"></div>
                </div>
            </div>
        </div>
        `,
        {
            lazyload: {
                loadPrevNext: false,
                loadPrevNextAmount: 1,
                loadOnTransitionStart: true,
                elementClass: 'swiper-lazy',
                loadingClass: 'swiper-lazy-loading',
                loadedClass: 'swiper-lazy-loaded',
                preloaderClass: 'swiper-lazy-preloader'
            }
        },
        SwiperPluginLazyload,
        'SwiperPluginLazyload')
})
