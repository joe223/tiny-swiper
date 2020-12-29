import {
    defaultStyle,
    testPluginLifcycle
} from '../../common'
import SwiperPluginNavigation from '../../../src/modules/navigation'

describe('Plugin - Navigation', () => {
    testPluginLifcycle(
        `
        ${defaultStyle}
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="a swiper-slide">1</div>
                <div class="b swiper-slide">2</div>
                <div class="a swiper-slide">3</div>
                <div class="b swiper-slide">4</div>
            </div>
            <button class="swiper-plugin-navigation-prevEl">prev</button>
            <button class="swiper-plugin-navigation-nextEl">next</button>
        </div>
        `,
        {
            navigation: {
                nextEl: '.swiper-plugin-navigation-nextEl',
                prevEl: '.swiper-plugin-navigation-prevEl'
            }
        },
        SwiperPluginNavigation,
        'SwiperPluginNavigation')
})
