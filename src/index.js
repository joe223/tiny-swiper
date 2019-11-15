import {
    addClassName,
    removeClassName,
    detectTouch,
    getTranslate
} from './lib.js'

const formEls = [
    'INPUT',
    'SELECT',
    'OPTION',
    'TEXTAREA',
    'BUTTON',
    'VIDEO'
]
const hooks = [
    'before-init',
    'after-init',
    'before-slide',
    'after-slide',
    'before-destroy',
    'after-destroy'
]

/**
 * Swiper Class
 */
export default class Swiper {
    constructor (el, config) {
        config = Swiper.formatConfig(config)
        this.index = 0
        this.scrolling = false
        this.config = config
        this.supportTouch = detectTouch()
        if (typeof el === 'string') {
            el = document.body.querySelector(el)
        }
        this.$el = el
        this.$wrapper = el.querySelector(`.${config.wrapperClass}`)
        this.eventHub = {}
        this.initPlugins(config.plugins)
        this.emit('before-init', this)
        this.initListener()
        this.initTouchStatus()
        this.initWheelStatus()
        this.update()
        this.attachListener()
        this.emit('after-init', this)
        this.scroll(config.initialSlide)
    }

    initPlugins (plugins) {
        (plugins || []).forEach(plugin => plugin(this))
    }

    on (evtName, cb) {
        const { eventHub } = this

        if (!eventHub[evtName]) {
            eventHub[evtName] = [cb]
        } else {
            eventHub[evtName].push(cb)
        }
    }

    off (evtName, cb) {
        const { eventHub } = this

        if (eventHub[evtName]) {
            const index = eventHub[evtName].indexOf(cb)

            index > -1 && eventHub[evtName].splice(index, 1)
        }
    }

    emit (evtName, ...data) {
        const { eventHub } = this

        if (eventHub[evtName]) {
            eventHub[evtName].forEach(cb => cb(...data))
        }
    }

    initListener () {
        const {
            $wrapper,
            config,
            supportTouch
        } = this

        this.listeners = {
            handleTouchStart: e => {
                for (let i = 0; i < config.excludeElements.length; i++) {
                    if (config.excludeElements[i].contains(e.target)) return
                }

                this.initTouchStatus()
                const { touchStatus } = this
                const shouldPreventDefault =
                    (config.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1)
                    || config.touchStartForcePreventDefault
                touchStatus.startOffset = getTranslate($wrapper, this.isHorizontal)
                this.transform(touchStatus.startOffset)
                $wrapper.style.transition = 'none'

                touchStatus.isTouchStart = true
                touchStatus.touchStartTime = Date.now()

                touchStatus.touchTracks.push({
                    x: supportTouch ? e.touches[0].pageX : e.pageX,
                    y: supportTouch ? e.touches[0].pageY : e.pageY,
                })

                if (shouldPreventDefault && !config.passiveListeners) e.preventDefault()
            },

            handleTouchMove: e => {
                const {
                    touchStatus
                } = this
                const {
                    touchTracks
                } = touchStatus

                if (!touchStatus.isTouchStart || touchStatus.isScrolling) return
                if (config.touchMoveStopPropagation) e.stopPropagation()

                const currentPosition = {
                    x: supportTouch ? e.touches[0].pageX : e.pageX,
                    y: supportTouch ? e.touches[0].pageY : e.pageY,
                }
                const diff = {
                    x: currentPosition.x - touchTracks[touchTracks.length - 1].x,
                    y: currentPosition.y - touchTracks[touchTracks.length - 1].y
                }

                touchTracks.push(currentPosition)

                const touchAngle = Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * 180 / Math.PI

                let offset = 0

                if (this.isHorizontal) {
                    if (touchAngle < config.touchAngle || touchStatus.isTouching) {
                        touchStatus.isTouching = true
                        offset = diff.x
                        e.preventDefault()
                    } else {
                        touchStatus.isScrolling = true
                    }
                } else {
                    if ((90 - touchAngle) < config.touchAngle || touchStatus.isTouching) {
                        touchStatus.isTouching = true
                        offset = diff.y
                        e.preventDefault()
                    } else {
                        touchStatus.isScrolling = true
                    }
                }

                this.scrollPixel(offset * config.touchRatio)
            },

            handleTouchEnd: e => {
                if (!this.touchStatus.isTouchStart) return

                const {
                    index,
                    slideSize,
                    touchStatus
                } = this
                const swipTime = Date.now() - touchStatus.touchStartTime
                const computedOffset = getTranslate($wrapper, this.isHorizontal) - touchStatus.startOffset

                $wrapper.style.transition = `transform ease ${config.speed}ms`

                // long swip
                if (swipTime > this.config.longSwipesMs) {
                    if (Math.abs(computedOffset) >= slideSize * config.longSwipesRatio) {
                        this.scroll(computedOffset > 0 ? index - 1 : index + 1, true)
                    } else {
                        this.scroll(index, true)
                    }
                } else {
                    // short swip
                    if (computedOffset === 0) {
                        this.scroll(index, true)
                    } else {
                        this.scroll(computedOffset > 0 ? index - 1 : index + 1, true)
                    }
                }
                this.initTouchStatus()
            },

            handleWheel: e => {
                const {
                    index,
                    wheelStatus
                } = this
                const deltaY = e.deltaY

                if ((Math.abs(deltaY) - Math.abs(wheelStatus.wheelDelta) > 0 || !wheelStatus.wheeling)
                    && Math.abs(deltaY) >= config.mousewheel.sensitivity) {
                    this.scroll(deltaY > 0 ? index - 1 : index + 1)
                }
                wheelStatus.wheelDelta = deltaY
                clearTimeout(wheelStatus.wheelingTimer)
                wheelStatus.wheeling = true
                wheelStatus.wheelingTimer = setTimeout(() => {
                    this.initWheelStatus()
                }, 200)
                e.preventDefault()
                e.stopPropagation()
            }
        }
    }

    attachListener () {
        const {
            $el,
            config,
            supportTouch
        } = this
        const {
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            handleWheel
        } = this.listeners

        if (supportTouch) {
            $el.addEventListener('touchstart', handleTouchStart, {
                passive: config.passiveListeners,
                capture: false
            }, false)
            $el.addEventListener('touchmove', handleTouchMove)
            $el.addEventListener('touchend', handleTouchEnd)
            $el.addEventListener('touchcancel', handleTouchEnd)
        } else {
            $el.addEventListener('mousedown', handleTouchStart)
            document.addEventListener('mousemove', handleTouchMove)
            document.addEventListener('mouseup', handleTouchEnd)
        }

        if (config.mousewheel) {
            $el.addEventListener('wheel', handleWheel)
        }
    }

    detachListener () {
        const {
            $el
        } = this
        const {
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            handleWheel
        } = this.listeners

        $el.removeEventListener('touchstart', handleTouchStart)
        $el.removeEventListener('touchmove', handleTouchMove)
        $el.removeEventListener('touchend', handleTouchEnd)
        $el.removeEventListener('touchcancel', handleTouchEnd)
        $el.removeEventListener('mousedown', handleTouchStart)
        document.removeEventListener('mousemove', handleTouchMove)
        document.removeEventListener('mouseup', handleTouchEnd)

        $el.removeEventListener('wheel', handleWheel)
    }

    static formatConfig (config = {}) {
        const defaultConfig = {
            direction: 'horizontal',
            touchRatio: 1,
            touchAngle: 45,
            longSwipesRatio: 0.5,
            initialSlide: 0,
            loop: false,
            mousewheel: false,
            pagination: false,
            passiveListeners: true,
            resistance: true,
            resistanceRatio: 0.85,
            speed: 300,
            longSwipesMs: 300,
            intermittent: 0,
            spaceBetween: 0,
            slidePrevClass: 'swiper-slide-prev',
            slideNextClass: 'swiper-slide-next',
            slideActiveClass: 'swiper-slide-active',
            slideClass: 'swiper-slide',
            wrapperClass: 'swiper-wrapper',
            touchStartPreventDefault: true,
            touchStartForcePreventDefault: false,
            touchMoveStopPropagation: false,
            excludeElements: []
        }
        if (config.mousewheel) {
            config.mousewheel = {
                invert: false,
                sensitivity: 1,
                ...config.mousewheel
            }
        }

        return {
            ...defaultConfig,
            ...config
        }
    }

    transform (offset) {
        this.$wrapper.style.transform = this.isHorizontal ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`
    }

    scroll (index = 0, force = false) {
        if (this.scrolling && !force) return

        this.emit('before-slide', this.index, this)

        const {
            config,
            minIndex,
            maxIndex
        } = this

        index = index < minIndex ? minIndex : index > maxIndex ? maxIndex : index

        const offset = index * this.boxSize

        this.scrolling = true
        this.transform(-offset)

        const $current = this.$list[index]
        const $prev = this.$list[index - 1]
        const $next = this.$list[index + 1]

        if ($current) {
            addClassName($current, config.slideActiveClass)
            removeClassName($current, [
                config.slidePrevClass,
                config.slideNextClass
            ])
        }
        if ($prev) {
            addClassName($prev, config.slidePrevClass)
            removeClassName($prev, [
                config.slideActiveClass,
                config.slideNextClass
            ])
        }
        if ($next) {
            addClassName($next, config.slideNextClass)
            removeClassName($next, [
                config.slideActiveClass,
                config.slidePrevClass
            ])
        }
        this.index = index
        setTimeout(() => {
            this.scrolling = false
            this.emit('after-slide', index, this)
        }, this.config.speed + this.config.intermittent)
    }

    scrollPixel (px) {
        if (this.config.resistance) {
            // if (px > 0 && this.index === 0) {
            //     px = px ** this.config.resistanceRatio
            // } else if (px < 0 && this.index === this.maxIndex) {
            //     px = -1 * (Math.abs(px) ** this.config.resistanceRatio)
            // }
            if ((px > 0 && this.index === 0) || (px < 0 && this.index === this.maxIndex)) {
                px = px * Math.pow(this.config.resistanceRatio, 2)
            }
        }

        const oldTransform = getTranslate(this.$wrapper, this.isHorizontal)

        this.transform(oldTransform + px)
    }

    initTouchStatus () {
        this.touchStatus = {
            touchTracks: [],
            startOffset: 0,
            touchStartTime: 0,
            isTouchStart: false,
            isScrolling: false,
            isTouching: false
        }
    }

    initWheelStatus () {
        this.wheelStatus = {
            wheeling: false,
            wheelDelta: 0,
            wheelingTimer: false
        }
    }

    update () {
        const {
            $el,
            $wrapper,
            index,
            config
        } = this
        const wrapperStyle = $wrapper.style
        const isHorizontal = config.direction === 'horizontal'

        this.isHorizontal = isHorizontal
        this.$list = [].slice.call($el.getElementsByClassName(config.slideClass))
        this.minIndex = 0
        this.maxIndex = this.$list.length - 1
        this.slideSize = isHorizontal ? $el.offsetWidth : $el.offsetHeight
        this.boxSize = this.slideSize + config.spaceBetween
        this.$list.forEach(item => {
            item.style[isHorizontal ? 'width' : 'height'] = `${this.slideSize}px`
            item.style[isHorizontal ? 'margin-right' : 'margin-bottom'] = `${config.spaceBetween}px`
        })
        $el.style.overflow = 'hidden'
        wrapperStyle.willChange = 'transform'
        wrapperStyle.transition = `transform ease ${this.config.speed}ms`
        wrapperStyle[isHorizontal ? 'width' : 'height'] = `${this.boxSize * this.$list.length}px`
        wrapperStyle.display = 'flex'
        wrapperStyle.flexDirection = isHorizontal ? 'row' : 'column'
        this.transform(-index * this.boxSize)
    }

    destroy () {
        const {
            $el,
            $wrapper,
            config
        } = this
        const {
            slideActiveClass
        } = config

        this.emit('before-destroy', this)
        this.$list.forEach(item => {
            item.removeAttribute('style')
            removeClassName(item, [slideActiveClass])
        })
        $wrapper.removeAttribute('style')
        $el.removeAttribute('style')
        this.detachListener()
        this.emit('after-destroy', this)
        this.$el = null
        this.$list = []
        this.$wrapper = null
        this.eventHub = {}
        this.config = Swiper.formatConfig()
    }
}
