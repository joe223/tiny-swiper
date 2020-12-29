import {
    defaultStyle,
    testPluginLifcycle
} from '../../common'
import SwiperPluginPagination from '../../../src/modules/pagination'

describe('Plugin - Pagination', () => {
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
            <div class="swiper-pagination"></div>
        </div>
        `,
        {
            pagination: {
                el: '.swiper-pagination'
            }
        },
        SwiperPluginPagination,
        'SwiperPluginPagination')
})
