const puppeteer = require('puppeteer')
const pti = require('puppeteer-to-istanbul')
const helper = require('../helper')

describe('Plugin - KeyboardControl', function () {
    let page = null

    before(async function () {
        page = await browser.newPage()
        await page.coverage.startJSCoverage()
        await page.goto(`${global.entryHost}test/fixtures/keyboardControl.html`)
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
            import SwiperPluginKeyboardControl from '/src/modules/keyboardControl.js'

            const instance = new Swiper('#swiper1', {
                direction: 'horizontal',
                speed: 0,
                keyboard: true,
                initialSlide: 1,
                plugins: [
                    SwiperPluginKeyboardControl
                ]
            })
            window.Swiper = Swiper
            window.instance = instance
            `
        })

        await page.keyboard.down('ArrowLeft')

        let instance = await page.evaluate(function () {
            return instance
        })

        expect(instance.index).toBe(0)

        await page.keyboard.down('ArrowRight')

        instance = await page.evaluate(function () {
            return instance
        })

        expect(instance.index).toBe(1)
    })

    it('disabled', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginKeyboardControl from '/src/modules/keyboardControl.js'

            const instance = new Swiper('#swiper1', {
                direction: 'horizontal',
                speed: 0,
                keyboard: {
                    enabled: false,
                    onlyInViewport: true
                },
                initialSlide: 1,
                plugins: [
                    SwiperPluginKeyboardControl
                ]
            })
            window.Swiper = Swiper
            window.instance = instance
            `
        })

        await page.keyboard.down('ArrowLeft')

        let instance = await page.evaluate(function () {
            return instance
        })

        expect(instance.index).toBe(1)

        await page.keyboard.down('ArrowRight')

        instance = await page.evaluate(function () {
            return instance
        })

        expect(instance.index).toBe(1)
    })

    it('only in viewport', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginKeyboardControl from '/src/modules/keyboardControl.js'

            const instance = new Swiper('#swiper1', {
                direction: 'horizontal',
                speed: 0,
                keyboard: {
                    onlyInViewport: true
                },
                initialSlide: 1,
                plugins: [
                    SwiperPluginKeyboardControl
                ]
            })
            window.Swiper = Swiper
            window.instance = instance
            `
        })

        await page.evaluate(() => {
            window.scrollBy(0, 1)
        })

        await page.keyboard.down('ArrowRight')

        instance = await page.evaluate(function () {
            return instance
        })

        expect(instance.index).toBe(1)
    })
})
