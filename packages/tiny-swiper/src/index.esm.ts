// eslint-disable-next-line import/no-named-default
import SwiperPluginLazyload from './modules/lazyload'
import SwiperPluginPagination from './modules/pagination'
import SwiperPluginKeyboardControl from './modules/keyboardControl'

export {
    Swiper,
    SwiperInstance,
    SwiperPlugin,
    default
} from './core/index'

export {
    LIFE_CYCLES
} from './core/eventHub'

export {
    SwiperPluginLazyload,
    SwiperPluginPagination,
    SwiperPluginKeyboardControl
}
