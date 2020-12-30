import {
    defaultStyle,
    testPluginLifcycle
} from '../../common'
import SwiperPluginMousewheel from '../../../src/modules/mousewheel'

describe('Plugin - SwiperPluginMousewheel', () => {
    testPluginLifcycle(
        `
        ${defaultStyle}
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="a swiper-slide">1</div>
                <div class="b swiper-slide">2</div>
                <div class="a swiper-slide">3</div>
                <div class="b swiper-slide">4</div>>
            </div>
        </div>
        `,
        {
            mousewheel: {
                invert: true
            }
        },
        SwiperPluginMousewheel,
        'SwiperPluginMousewheel')
})
