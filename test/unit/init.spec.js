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
        await page.close()
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
            return (mySwiper instanceof Swiper) && (mySwiper.index === 0) && (mySwiper.isHorizontal === true)
        })

        expect(boxModel.height).toEqual(300)
        expect(isInheritor).toBeTruthy()
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
})
