import Swiper from './core.js'

import SwiperPluginLazyload from './modules/lazyload.js'
import SwiperPluginPagination from './modules/pagination.js'

const plugins = [
    SwiperPluginLazyload,
    SwiperPluginPagination
]

Swiper.use(plugins)

export default Swiper
