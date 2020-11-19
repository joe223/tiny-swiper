// eslint-disable-next-line import/no-named-default
import { default as Swiper, SwiperPlugin } from './core/index'

import SwiperPluginLazyload from './modules/lazyload'
import SwiperPluginPagination from './modules/pagination'
import SwiperPluginKeyboardControl from './modules/keyboardControl'

export {
    SwiperPluginLazyload,
    SwiperPluginPagination,
    SwiperPluginKeyboardControl
}

export default Swiper
