import Swiper from './core.js'

import SwiperPluginLazyload from './modules/lazyload.js'
import SwiperPluginPagination from './modules/pagination.js'
import SwiperPluginKeyboardControl from './modules/keyboardControl.js'

const plugins = [
    SwiperPluginLazyload,
    SwiperPluginPagination,
    SwiperPluginKeyboardControl
]

Swiper.use(plugins)

export default Swiper
