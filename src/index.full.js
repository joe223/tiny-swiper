import Swiper from './core.js'

import TinySwiperPluginLazyload from './modules/lazyload.js'
import TinySwiperPluginPagination from './modules/pagination.js'

const plugins = [
    TinySwiperPluginLazyload,
    TinySwiperPluginPagination
]

Swiper.use(plugins)

export default Swiper
