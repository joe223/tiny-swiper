const pti = require('puppeteer-to-istanbul')

describe('Initialization', function () {
    let page = null

    before(async function () {
        page = await browser.newPage()
        await page.coverage.startJSCoverage()
        await page.goto(global.entryPath)
    })

    after(async function () {
        const [jsCoverage] = await Promise.all([
            page.coverage.stopJSCoverage()
        ])

        pti.write([...jsCoverage])

        if (process.env.TEST_MODE !== 'local') {
            await page.close()
        }
    })

    beforeEach(async function () {
        await page.reload({
            timeout: 1000,
            waitUntil: 'load'
        })
    })

    it('default setup', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            const mySwiper = new Swiper('#swiper1')

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })
        const $slide = await page.$('.swiper-wrapper')
        const boxModel = await $slide.boxModel()
        const isInheritor = await page.evaluate(function () {
            return (mySwiper instanceof Swiper)
                && (mySwiper.index === 0)
                && (mySwiper.isHorizontal === true)
        })
        const swiper = await page.evaluate(function () {
            return mySwiper
        })

        expect(boxModel.height).toEqual(300)
        expect(isInheritor).toBeTruthy()
        expect(swiper.isHorizontal).toBeTruthy
        expect(swiper.slideSize).toEqual(swiper.viewSize)
        expect(swiper.boxSize).toEqual(swiper.slideSize + swiper.config.spaceBetween)
        expect(swiper.index).toEqual(0)
    })

    it('initialSlide parameter', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            const mySwiper = new Swiper('#swiper1', {
                initialSlide: 1
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })
        const initialSlideTransform = await page.evaluate(function () {
            const $wrapper = document.querySelector('.swiper-wrapper')

            return $wrapper.style.transform === `translate3d(-${mySwiper.boxSize}px, 0px, 0px)`
        })

        expect(initialSlideTransform).toBeTruthy()
    })

    it('spaceBetween', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            const mySwiper = new Swiper('#swiper1', {
                spaceBetween: 100
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })

        const swiper = await page.evaluate(function () {
            return mySwiper
        })
        const mather = {
            slideSize: swiper.viewSize
        }
    })

    it('excludeElements parameter', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            const mySwiper = new Swiper('#swiper1', {
                speed: 0,
                excludeElements: Array.from(document.body.querySelectorAll('.swiper-slide'))
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })
        await page.mouse.move(100, 0)
        await page.mouse.down()
        await page.mouse.move(0, 0)
        await page.mouse.up()

        const swiperIndex = await page.evaluate(function () {
            return mySwiper.index
        })

        expect(swiperIndex).toEqual(0)
    })

    it('plugins parameter', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'

            window.count = 0

            const mySwiper = new Swiper('#swiper1', {
                speed: 0,
                plugins: [() => window.count++]
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })

        const count = await page.evaluate(function () {
            return window.count
        })

        expect(count).toEqual(1)
    })

    it('use plugins', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'

            Swiper.use([() => window.count++])
            window.count = 0

            const mySwiper = new Swiper('#swiper1', {
                speed: 0
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })

        const count = await page.evaluate(function () {
            return window.count
        })

        expect(count).toEqual(1)
    })

    it('slidesPerView parameter', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import { getTranslate } from '/src/lib.js'
            import Swiper from '/src/index.js'

            const mySwiper = new Swiper('#swiper1', {
                speed: 0,
                slidesPerView: 2.4,
                initialSlide: 1
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            window.getTranslate = getTranslate
            `
        })
        const data = await page.evaluate(function () {
            return {
                instance: window.mySwiper,
                transform: parseInt(getTranslate(mySwiper.$wrapper, mySwiper.isHorizontal), 10)
            }
        })
        const { instance } = data
        const match = {
            minIndex: 0,
            maxIndex: instance.$list.length - Math.ceil(instance.config.slidesPerView),
            minTransform: 0,

            // eslint-disable-next-line
            maxTransform: instance.boxSize * instance.$list.length - instance.baseTransform - instance.config.spaceBetween - instance.viewSize,

            // eslint-disable-next-line
            slideSize: (instance.viewSize - (instance.config.spaceBetween * Math.ceil(instance.config.slidesPerView - 1))) / instance.config.slidesPerView
        }

        expect(data.transform).toEqual(parseInt(-instance.boxSize * instance.index, 10))

        Object.keys(match).forEach(prop => {
            match[prop] = parseInt(match[prop], 10)
            instance[prop] = parseInt(instance[prop], 10)
        })

        expect(data.instance).toMatchObject(match)
    })

    it('slidesPerView parameter - scroll to last slide', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import { getTranslate } from '/src/lib.js'
            import Swiper from '/src/index.js'

            const mySwiper = new Swiper('#swiper1', {
                speed: 0,
                slidesPerView: 2.4,
                initialSlide: 3
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            window.getTranslate = getTranslate
            `
        })
        const data = await page.evaluate(function () {
            return {
                instance: window.mySwiper,
                transform: parseInt(getTranslate(mySwiper.$wrapper, mySwiper.isHorizontal), 10)
            }
        })
        const { instance } = data
        const match = {

            // eslint-disable-next-line
            slideSize: (instance.viewSize - (instance.config.spaceBetween * Math.ceil(instance.config.slidesPerView - 1))) / instance.config.slidesPerView
        }

        expect(data.instance).toMatchObject(match)

        // eslint-disable-next-line
        expect(data.transform).toEqual(-parseInt(instance.slideSize * instance.$list.length - instance.viewSize - instance.config.spaceBetween, 10))
    })

    it('centeredSlides parameter', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import { getTranslate } from '/src/lib.js'
            import Swiper from '/src/index.js'

            const mySwiper = new Swiper('#swiper1', {
                speed: 0,
                slidesPerView: 1.5,
                initialSlide: 3,
                centeredSlides: true
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            window.getTranslate = getTranslate
            `
        })
        const data = await page.evaluate(function () {
            return {
                instance: window.mySwiper,
                transform: parseInt(getTranslate(mySwiper.$wrapper, mySwiper.isHorizontal), 10)
            }
        })
        const { instance } = data
        const match = {
            minIndex: 0,
            maxIndex: instance.$list.length - 1,
            baseTransform: -(instance.viewSize - instance.slideSize) / 2,
            minTransform: (instance.viewSize - instance.slideSize) / 2,

            // eslint-disable-next-line
            maxTransform: instance.boxSize * instance.$list.length - instance.baseTransform - instance.config.spaceBetween - instance.viewSize,

            // eslint-disable-next-line
            slideSize: (instance.viewSize - (instance.config.spaceBetween * Math.ceil(instance.config.slidesPerView - 1))) / instance.config.slidesPerView
        }

        expect(data.transform).toEqual(parseInt(-(instance.boxSize * instance.index - (instance.viewSize - instance.slideSize) / 2), 10))

        Object.keys(match).forEach(prop => {
            match[prop] = parseInt(match[prop], 10)
            instance[prop] = parseInt(instance[prop], 10)
        })

        expect(instance).toMatchObject(match)
    })
})
