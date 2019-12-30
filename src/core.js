import {
    attachListener,
    detachListener,
    removeAttr,
    addClass,
    removeClass,
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

// eslint-disable-next-line
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
        el = typeof el === 'string' ? document.body.querySelector(el) : el

        this.index = 0
        this.scrolling = false
        this.config = config
        this.supportTouch = detectTouch()
        this.$el = el
        this.$wrapper = el.querySelector(`.${config.wrapperClass}`)
        this.eventHub = {}
        this.initPlugins(config.plugins || Swiper.plugins)
        this.emit('before-init', this)
        this.initListener()
        this.initTouchStatus()
        this.initWheelStatus()
        this.update()
        this.attachListener()
        this.emit('after-init', this)
        this.scroll(config.initialSlide)
    }

    static use (plugins) {
        Swiper.plugins = plugins
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
            slidesPerView: 1,
            centeredSlides: false,
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
            onTouchStart: e => {
                for (let i = 0; i < config.excludeElements.length; i++) {
                    if (config.excludeElements[i].contains(e.target)) return
                }

                this.initTouchStatus()
                const { touchStatus } = this
                const shouldPreventDefault = (config.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1)
                    || config.touchStartForcePreventDefault
                touchStatus.startOffset = getTranslate($wrapper, this.isHorizontal)
                this.transform(touchStatus.startOffset)
                $wrapper.style.transition = 'none'

                touchStatus.isTouchStart = true
                touchStatus.touchStartTime = Date.now()

                touchStatus.touchTracks.push({
                    x: supportTouch ? e.touches[0].pageX : e.pageX,
                    y: supportTouch ? e.touches[0].pageY : e.pageY
                })

                if (shouldPreventDefault && !config.passiveListeners) e.preventDefault()
            },

            onTouchMove: e => {
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
                    y: supportTouch ? e.touches[0].pageY : e.pageY
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

            onTouchEnd: () => {
                if (!this.touchStatus.isTouchStart) return

                const {
                    index,
                    boxSize,
                    touchStatus
                } = this
                const swipTime = Date.now() - touchStatus.touchStartTime
                const transform = getTranslate($wrapper, this.isHorizontal)
                const computedOffset = transform - touchStatus.startOffset
                const jump = Math.ceil(Math.abs(computedOffset) / boxSize)
                const longSwipeIndex = Math.ceil(Math.abs(computedOffset) / boxSize - config.longSwipesRatio)

                $wrapper.style.transition = `transform ease ${config.speed}ms`

                // long swip
                if (swipTime > this.config.longSwipesMs) {
                    this.scroll(this.index + longSwipeIndex * (computedOffset > 0 ? -1 : 1), true)
                } else {
                    // short swip
                    this.scroll(computedOffset > 0 ? index - jump : index + jump, true)
                }
                this.initTouchStatus()
            },

            onWheel: e => {
                const {
                    index,
                    wheelStatus
                } = this
                const { deltaY } = e

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
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            onWheel
        } = this.listeners

        if (supportTouch) {
            attachListener($el, 'touchstart', onTouchStart, {
                passive: config.passiveListeners,
                capture: false
            }, false)
            attachListener($el, 'touchmove', onTouchMove)
            attachListener($el, 'touchend', onTouchEnd)
            attachListener($el, 'touchcancel', onTouchEnd)
        } else {
            attachListener($el, 'mousedown', onTouchStart)
            attachListener(document, 'mousemove', onTouchMove)
            attachListener(document, 'mouseup', onTouchEnd)
        }

        if (config.mousewheel) {
            attachListener($el, 'wheel', onWheel)
        }
    }

    detachListener () {
        const {
            $el
        } = this
        const {
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            onWheel
        } = this.listeners

        detachListener($el, 'touchstart', onTouchStart)
        detachListener($el, 'touchmove', onTouchMove)
        detachListener($el, 'touchend', onTouchEnd)
        detachListener($el, 'touchcancel', onTouchEnd)
        detachListener($el, 'mousedown', onTouchStart)
        detachListener(document, 'mousemove', onTouchMove)
        detachListener(document, 'mouseup', onTouchEnd)

        detachListener($el, 'wheel', onWheel)
    }

    transform (offset) {
        this.$wrapper.style.transform = this.isHorizontal ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`
    }

    scroll (index = 0, force = false) {
        if (this.scrolling && !force) return

        const {
            config,
            minIndex,
            maxIndex,
            minTransform,
            maxTransform
        } = this
        const offset = index * this.boxSize + this.baseTransform

        index = index < minIndex ? minIndex : index > maxIndex ? maxIndex : index

        this.emit('before-slide', this.index, this, index)

        this.scrolling = true
        this.transform(-(offset > maxTransform ? maxTransform : offset < minTransform ? minTransform : offset))

        const $current = this.$list[index]
        const $prev = this.$list[index - 1]
        const $next = this.$list[index + 1]

        this.$list.forEach(($slide, i) => {
            removeClass($slide, [
                config.slidePrevClass,
                config.slideNextClass,
                config.slideActiveClass
            ])
            if (i === index) {
                addClass($current, config.slideActiveClass)
            }
            if (i === index - 1) {
                addClass($prev, config.slidePrevClass)
            }
            if (i === index + 1) {
                addClass($next, config.slideNextClass)
            }
        })
        this.index = index
        setTimeout(() => {
            this.scrolling = false
            this.emit('after-slide', index, this)
        }, this.config.speed + this.config.intermittent)
    }

    scrollPixel (px) {
        const ratio = px.toExponential().split('e')[1]
        const expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1
        const oldTransform = getTranslate(this.$wrapper, this.isHorizontal)

        if (this.config.resistance) {
            if (px > 0 && oldTransform - this.minTransform >= 0) {
                px -= (px * expand) ** this.config.resistanceRatio / expand
            } else if (px < 0 && oldTransform + this.maxTransform <= 0) {
                px += ((-px * expand) ** this.config.resistanceRatio) / expand
            }
            // if ((px > 0 && this.index === 0) || (px < 0 && this.index === this.maxIndex)) {
            //     px = px * Math.pow(this.config.resistanceRatio, 4)
            // }
        }

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

        $el.style.overflow = 'hidden'

        this.isHorizontal = isHorizontal
        this.$list = [].slice.call($el.getElementsByClassName(config.slideClass))
        this.minIndex = 0
        this.maxIndex = this.$list.length - (config.centeredSlides ? 1 : Math.ceil(config.slidesPerView))
        this.viewSize = isHorizontal ? $el.offsetWidth : $el.offsetHeight
        this.slideSize = (this.viewSize - (Math.ceil(config.slidesPerView - 1)) * config.spaceBetween) / config.slidesPerView
        this.boxSize = this.slideSize + config.spaceBetween
        this.baseTransform = config.centeredSlides ? (this.slideSize - this.viewSize) / 2 : 0
        this.minTransform = -this.baseTransform
        this.maxTransform = this.boxSize * this.$list.length - config.spaceBetween - this.viewSize - this.baseTransform
        this.$list.forEach(item => {
            item.style[isHorizontal ? 'width' : 'height'] = `${this.slideSize}px`
            item.style[isHorizontal ? 'margin-right' : 'margin-bottom'] = `${config.spaceBetween}px`
        })

        wrapperStyle.willChange = 'transform'
        wrapperStyle.transition = `transform ease ${config.speed}ms`
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
            removeAttr(item, 'style')
            removeClass(item, [slideActiveClass])
        })
        removeAttr($wrapper, 'style')
        removeAttr($el, 'style')
        this.detachListener()
        this.emit('after-destroy', this)
        this.$el = null
        this.$list = []
        this.$wrapper = null
        this.eventHub = {}
        this.config = Swiper.formatConfig()
    }
}
