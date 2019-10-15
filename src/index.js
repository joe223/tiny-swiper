import {
    addClassName,
    removeClassName
} from './lib'

/**
 * Swiper Class
 */
export default class Swiper {
    constructor (el, config) {
        config = Swiper.formatConfig(config)
        this.index = 0
        this.scrolling = false
        this.config = config
        if (typeof el === 'string') {
            el = document.body.querySelector(el)
        }
        this.$el = el
        this.$el.style.overflow = 'hidden'
        this.$wrapper = el.getElementsByClassName(config.wrapperClass)[0]
        this.$list = Array.from(el.getElementsByClassName(config.slideClass))
        this.formEls = ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON', 'VIDEO']
        this.update()
        this.initPagination()
        this.scroll(this.config.initialSlide)
        this.initWheel()
    }

    static formatConfig (config) {
        const defaultConfig = {
            direction: 'horizontal',
            touchRatio: 1,
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
            spaceBetween: 100,
            slidePrevClass: 'swiper-slide-prev',
            slideNextClass: 'swiper-slide-next',
            slideActiveClass: 'swiper-slide-active',
            slideClass: 'swiper-slide',
            wrapperClass: 'swiper-wrapper',
            touchStartPreventDefault: true,
            touchStartForcePreventDefault: false
        }
        if (config.pagination) {
            config.pagination = {
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

    get direction () {
        return this.config.direction === 'horizontal' ? 'screenX' : 'screenY'
    }

    get isHorizontal () {
        return this.direction === 'screenX'
    }

    get maxIndex () {
        return this.$list.length - 1
    }

    get minIndex () {
        return 0
    }

    getTransform (offset) {
        return this.isHorizontal ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`
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
        this.$wrapper.style.transform = this.getTransform(-offset)

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
        }, this.config.speed + this.config.spaceBetween)
    }

    scrollPixel (px) {
        px *= this.config.touchRatio

        if (this.config.resistance) {
            if (px > 0 && this.index === 0) {
                px = px ** this.config.resistanceRatio
            } else if (px < 0 && this.index === this.maxIndex) {
                px = -1 * (Math.abs(px) ** this.config.resistanceRatio)
            }
        }

        const oldTransform = -this.index * this.boxSize

        this.$wrapper.style.transform = this.getTransform(oldTransform + px)
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
            })
        }
    }

    initWheel () {
        const { config } = this
        let touchEnd = 0
        let touchStart = 0
        let touchStartTime = 0

        const handleTouchStart = e => {
            const shouldPreventDefault =
                (this.config.touchStartPreventDefault && this.formEls.indexOf(e.target.nodeName) === -1)
                || this.config.touchStartForcePreventDefault

            this.$wrapper.style.transition = 'none'

            touchStartTime = Date.now()
            touchEnd = e.touches[0][this.direction]
            touchStart = e.touches[0][this.direction]
            if (shouldPreventDefault && !this.config.passiveListeners) e.preventDefault()
        }
        const handleTouchMove = e => {
            e.preventDefault()
            e.stopPropagation()
            touchEnd = e.targetTouches[0][this.direction]

            const offset = touchEnd - touchStart

            this.scrollPixel(offset)
        }
        const handleTouchEnd = e => {
            const swipTime = Date.now() - touchStartTime
            const offset = (touchEnd - touchStart) * this.config.touchRatio

            this.$wrapper.style.transition = `transform ease-in-out ${config.speed}ms`

            // long swip
            if (swipTime > this.config.longSwipesMs) {
                if (Math.abs(offset) >= this.boxSize * this.config.longSwipesRatio) {
                    if (offset > 0) {
                        this.scroll(this.index - 1, true)
                    } else {
                        this.scroll(this.index + 1, true)
                    }
                } else {
                    this.scroll(this.index, true)
                }
            } else {
                // short swip
                if (offset > 0) {
                    this.scroll(this.index - 1, true)
                } else if (offset < 0) {
                    this.scroll(this.index + 1, true)
                }
            }
            touchEnd = 0
            touchStart = 0
        }

        this.$el.addEventListener('touchstart', handleTouchStart, {
            passive: this.config.passiveListeners,
            capture: false
        }, false)

        this.$el.addEventListener('touchend', handleTouchEnd)
        this.$el.addEventListener('touchmove', handleTouchMove)
        this.$el.addEventListener('touchcancel', handleTouchEnd)

        if (!config.mousewheel) return

        let wheeling = false
        let wheelDelta = 0
        let wheelingTimer = false

        this.$el.addEventListener('wheel', e => {
            const deltaY = e.deltaY

            if ((Math.abs(deltaY) - Math.abs(wheelDelta) > 0 || !wheeling)
                && Math.abs(e.deltaY) >= config.mousewheel.sensitivity) {
                this.scroll(e.deltaY > 0
                    ? this.index - 1 : this.index + 1)
            }
            wheelDelta = deltaY
            clearInterval(wheelingTimer)
            wheeling = true
            wheelingTimer = setTimeout(() => {
                wheeling = false
            }, 200)
            e.preventDefault()
            e.stopPropagation()
        })
    }

    updatePagination () {
        const { config } = this

        this.$pageList && this.$pageList.forEach(($page, index) => {
            if (index === this.index) {
                $page.className = `${config.pagination.bulletClass} ${config.pagination.bulletActiveClass}`
            } else {
                $page.className = `${config.pagination.bulletClass}`
            }
        })
    }

    update () {
        this.boxSize = this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight
        this.limit = this.boxSize / 2
        this.$list.forEach(item => {
            if (this.isHorizontal) {
                item.style.width = `${this.boxSize}px`
            } else {
                item.style.height = `${this.boxSize}px`
            }
        })
        this.$wrapper.style.transition = `transform ease-in-out ${this.config.speed}ms`
        if (this.isHorizontal) {
            this.$wrapper.style.width = `${this.boxSize * this.$list.length}px`
        } else {
            this.$wrapper.style.height = `${this.boxSize * this.$list.length}px`
        }
        this.$wrapper.style.display = 'flex'
        this.$wrapper.style['flex-direction'] = this.isHorizontal ? 'row' : 'column'

        const offset = this.index * this.boxSize

        this.$wrapper.style.transform = this.getTransform(-offset)
    }
}
