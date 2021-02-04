import {
    defaultStyle,
    testPluginLifcycle
} from '../../common'
import SwiperPluginAutoPlay from '../../../src/modules/autoPlay'

describe('Plugin - AutoPlay', () => {
    testPluginLifcycle(
        `
        ${defaultStyle}
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <!-- Slides -->
                <div class="a swiper-slide">1</div>
                <div class="b swiper-slide">2</div>
                <div class="a swiper-slide">3</div>
                <div class="b swiper-slide">4</div>
            </div>
        </div>
        `,
        {
            autoplay: {
                delay: 1000
            }
        },
        SwiperPluginAutoPlay,
        'SwiperPluginAutoPlay')
})
