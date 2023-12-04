// eslint-disable-next-line import/no-named-default
import { default as Swiper, SwiperPlugin } from './core/index'

import SwiperPluginLazyload from './modules/lazyload'
import SwiperPluginPagination from './modules/pagination'
import SwiperPluginKeyboardControl from './modules/keyboardControl'
import SwiperPluginMousewheel from './modules/mousewheel'
import SwiperPluginNavigation from './modules/navigation'
import SwiperPluginBreakpoints from './modules/breakpoints'
import SwiperPluginAutoPlay from './modules/autoPlay'

const plugins = [
    SwiperPluginLazyload,
    SwiperPluginPagination,
    SwiperPluginKeyboardControl,
    SwiperPluginMousewheel,
    SwiperPluginNavigation,
    SwiperPluginBreakpoints,
    SwiperPluginAutoPlay
]

Swiper.use(plugins as Array<SwiperPlugin>)

export default Swiper
