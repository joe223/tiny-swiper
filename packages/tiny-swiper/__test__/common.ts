import Swiper, { SwiperPlugin } from '../src/core/index'
import { UserOptions } from '../src/core/options'

export const defaultStyle = `
    <style>
        html,
        body,
        .swiper-wrapper {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
        }
        .swiper-slide {
            width: 100%;
            height: 100%;
            flex-shrink: 0;
        }
        .swiper-container {
            height: 100%;
            margin-bottom: 1rem;
            overflow: hidden;
        }
        .swiper-wrapper {
            display: flex;
            flex-direction: row;
        }
    </style>`
const defaultTpl = `
    <!-- Slider main container -->
    <div class="swiper-container">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
            <!-- Slides -->
            <div class="a swiper-slide">1</div>
            <div class="b swiper-slide">2</div>
            <div class="a swiper-slide">3</div>
            <div class="b swiper-slide">4</div>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
    </div>
`

export function testPluginLifcycle (
    tpl: string,
    opt: UserOptions,
    plugin: SwiperPlugin,
    pluginName: string
) {
    document.body.innerHTML = `${tpl}`

    const fn = jest.fn(<SwiperPlugin>((...p) => plugin(...p)))
    const $el = <HTMLElement>document.body.querySelector('div')
    const swiperInstance = Swiper($el, {
        ...opt,
        plugins: [fn]
    })

    swiperInstance.slideTo(swiperInstance.state.index + 1)
    swiperInstance.updateSize()
    swiperInstance.update()
    swiperInstance.destroy()

    test(`Plugin ${pluginName} mounted`, () => {
        expect(fn).toBeCalledTimes(1)
    })
}
