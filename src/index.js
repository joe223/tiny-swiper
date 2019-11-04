import {
    addClassName,
    removeClassName,
    detectTouch,
    getTranslate
} from './lib.js'

const formEls = ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON', 'VIDEO']

/**
 * Swiper Class
 */
export default class Swiper {
    constructor (el, config) {
        config = Swiper.formatConfig(config || {})
        this.index = 0
        this.scrolling = false
        this.config = config
        this.supportTouch = detectTouch()
        if (typeof el === 'string') {
            el = document.body.querySelector(el)
        }
        this.$el = el
        this.$wrapper = el.querySelector(`.${config.wrapperClass}`)
        this.initListener()
        this.initTouchStatus()
        this.initWheelStatus()
        this.update()
        this.attachListener()
        this.initPagination()
        this.scroll(config.initialSlide)
    }

    initListener () {
        const {
            $wrapper,
            config,
            supportTouch
        } = this

        this.listeners = {
            handleTouchStart: e => {
                if (this.$pagination && this.$pagination.contains(e.target)) return

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

                if (!touchStatus.isTouchStart || touchStatus.isScrolling) return
                if (config.touchMoveStopPropagation) e.stopPropagation()

                const currentPosition = {
                    x: supportTouch ? e.touches[0].pageX : e.pageX,
                    y: supportTouch ? e.touches[0].pageY : e.pageY,
                }
                const diff = {
                    x: currentPosition.x - touchStatus.touchTracks[touchStatus.touchTracks.length - 1].x,
                    y: currentPosition.y - touchStatus.touchTracks[touchStatus.touchTracks.length - 1].y
                }

                touchStatus.touchTracks.push(currentPosition)

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
                        if (computedOffset > 0) {
                            this.scroll(index - 1, true)
                        } else {
                            this.scroll(index + 1, true)
                        }
                    } else {
                        this.scroll(index, true)
                    }
                } else {
                    // short swip
                    if (computedOffset > 0) {
                        this.scroll(index - 1, true)
                    } else if (computedOffset < 0) {
                        this.scroll(index + 1, true)
                    } else {
                        this.scroll(index, true)
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
                    wheelStatus.wheeling = false
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

    static formatConfig (config) {
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
            touchMoveStopPropagation: false
        }
        if (config.pagination) {
            config.pagination = {
                clickable: false,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
                ...config.pagination
            }
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

    get isHorizontal () {
        return this.config.direction === 'horizontal'
    }

    get maxIndex () {
        return this.$list.length - 1
    }

    get minIndex () {
        return 0
    }

    get boxSize () {
        return this.slideSize + this.config.spaceBetween
    }

    transform (offset) {
        this.$wrapper.style.transform = this.isHorizontal ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`
    }

    scroll (index = 0, force = false) {
        if (this.scrolling && !force) return

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
        setTimeout(() => {
            this.index = index
            this.updatePagination()
        }, this.config.speed)
        setTimeout(() => {
            this.scrolling = false
        }, this.config.speed + this.config.intermittent)
    }

    scrollPixel (px) {
        if (this.config.resistance) {
            if (px > 0 && this.index === 0) {
                px = px ** this.config.resistanceRatio
            } else if (px < 0 && this.index === this.maxIndex) {
                px = -1 * (Math.abs(px) ** this.config.resistanceRatio)
            }
        }

        const oldTransform = getTranslate(this.$wrapper, this.isHorizontal)

        this.transform(oldTransform + px)
    }

    initPagination () {
        const { config } = this

        if (!config.pagination) return

        const $pagination = typeof config.pagination.el === 'string'
            ? document.body.querySelector(config.pagination.el)
            : config.pagination.el

        $pagination.innerHTML = ''
        const $pageList = []
        const $group = document.createDocumentFragment()

        this.$pagination = $pagination
        this.$pageList = $pageList

        this.$list.forEach((item, index) => {
            const $page = document.createElement('div')

            if (index === this.index) {
                $page.className = `${config.pagination.bulletClass} ${config.pagination.bulletActiveClass}`
            } else {
                $page.className = `${config.pagination.bulletClass}`
            }
            $pageList.push($page)
            $group.appendChild($page)
        })

        $pagination.appendChild($group)

        if (config.pagination.clickable) {
            $pagination.addEventListener('click', e => {
                if (this.scrolling) return

                const index = $pageList.indexOf(e.target)

                if (index < 0) return
                this.scroll(index)
                e.stopPropagation()
            })
        }
    }

    destroyPagination () {
        const { config } = this

        if (!config.pagination) return
        this.$pagination.innerHTML = ''
        this.$pageList = []
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

    updatePagination () {
        const {
            bulletClass,
            bulletActiveClass
        } = this.config.pagination


        this.$pageList && this.$pageList.forEach(($page, index) => {
            if (index === this.index) {
                addClassName($page, [bulletClass, bulletActiveClass])
            } else {
                removeClassName($page, bulletActiveClass)
            }
        })
    }

    update () {
        const {
            $el,
            $wrapper,
            index,
            config,
            isHorizontal
        } = this
        const wrapperStyle = $wrapper.style

        this.$list = [].slice.call($el.getElementsByClassName(config.slideClass))
        this.slideSize = isHorizontal ? $el.offsetWidth : $el.offsetHeight
        this.$list.forEach(item => {
            item.style[isHorizontal ? 'width' : 'height'] = `${this.slideSize}px`
            item.style[isHorizontal ? 'margin-right' : 'margin-bottom'] = `${config.spaceBetween}px`
        })
        $el.style.overflow = 'hidden'
        wrapperStyle['will-change'] = 'transform'
        wrapperStyle.transition = `transform ease ${this.config.speed}ms`
        wrapperStyle[isHorizontal ? 'width' : 'height'] = `${this.boxSize * this.$list.length}px`
        wrapperStyle.display = 'flex'
        wrapperStyle['flex-direction'] = this.isHorizontal ? 'row' : 'column'
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

        this.$list.forEach(item => {
            item.removeAttribute('style')
            removeClassName(item, [slideActiveClass])
        })
        this.$list = []
        $wrapper.removeAttribute('style')
        $el.removeAttribute('style')
        this.detachListener()
        this.destroyPagination()
    }
}
// Try to keep it less than 400 lines.
