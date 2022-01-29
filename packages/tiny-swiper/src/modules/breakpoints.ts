import { debounce } from '../core/render/timing'
import { Options, UserOptions } from '../core/options'
import { SwiperInstance, SwiperPlugin } from '../core/index'
import { LIFE_CYCLES } from '../core/eventHub'
import { nextFrame } from '../core/render/nextTick'

export type SwiperPluginBreakpointsInstance = {
    update (): void
}
export type SwiperPluginBreakpointsOptions = {
    [key in number]: UserOptions
}

/**
 * TinySwiper plugin for breakpoints.
 *
 * @param {SwiperInstance} instance
 * @param {Options}
 */
export default <SwiperPlugin>function SwiperPluginBreakpoints (
    instance: SwiperInstance & {
        breakpoints?: SwiperPluginBreakpointsInstance
    },
    options: Options & {
        breakpoints?: SwiperPluginBreakpointsOptions
        breakpointsBase?: string
    }
): void {
    const isEnabled = Boolean(options.breakpoints)
    const breakpoints: SwiperPluginBreakpointsInstance = {
        update (): void {
            
            if (!options.breakpoints) return 

            for (const [breakpoint, values] of Object.entries(options.breakpoints)) {
                if ('window' === options.breakpointsBase) {
                    if (window.matchMedia(`(min-width: ${breakpoint}px)`).matches) {
                        instance.options = Object.assign(instance.options, values)
                    }
                } else if (+breakpoint <= instance.env.element.$el.offsetWidth) {
                    instance.options = Object.assign(instance.options, values)
                }
            }
            nextFrame(instance.updateSize)
        }
    }

    if (!isEnabled) return

    const resizeListener = debounce(breakpoints.update, 200) // the default timeout is 200ms

    instance.on(LIFE_CYCLES.AFTER_INIT, () => {
        instance.breakpoints = breakpoints
        window.addEventListener('resize', resizeListener, { passive: true })
    })
    instance.on(LIFE_CYCLES.BEFORE_DESTROY, () => {
        window.removeEventListener('resize', resizeListener)
    })
}
