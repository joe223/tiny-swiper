const puppeteer = require('puppeteer')
const pti = require('puppeteer-to-istanbul')
const helper = require('../helper')

describe('Plugin - Lazyload', function () {
    let page = null

    before(async function () {
        page = await browser.newPage()
        await page.coverage.startJSCoverage()
        await page.goto(`${global.entryHost}test/fixtures/lazyload.html`)
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
            import SwiperPluginLazyload from '/src/modules/lazyload.js'

            const lazyloadSwiper2 = new Swiper('#swiper1', {
                speed: 10000,
                lazyload: true,
                plugins: [
                    SwiperPluginLazyload
                ]
            })
            lazyloadSwiper2.scroll(1)
            window.lazyloadSwiper2 = lazyloadSwiper2
            window.Swiper = Swiper
            window.SwiperPluginLazyload = SwiperPluginLazyload
            `
        })

        await helper.wait(async function () {
            const $slide = await page.$$('.swiper-slide')
            const $loadedImg = await $slide[0].$$('img')
            const $unloadedImg = await $slide[1].$$('img')
            const $loadedImgDataSrc = await $loadedImg[0].getProperty('dataSrc')
            const $unloadedImgSrc = await $unloadedImg[0].getProperty('src')

            expect(await $loadedImgDataSrc.jsonValue()).toBeUndefined()
            expect(await $unloadedImgSrc.jsonValue()).toEqual('')
        }, 100)
    })

    it('lazyload destroyed', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginLazyload from '/src/modules/lazyload.js'

            const lazyloadSwiper3 = new Swiper('#swiper1', {
                speed: 0,
                lazyload: true,
                plugins: [
                    SwiperPluginLazyload
                ]
            })

            window.Swiper = Swiper
            window.lazyloadSwiper3 = lazyloadSwiper3
            `
        })

        const swiper = await page.evaluate(function () {
            lazyloadSwiper3.destroy()
            return lazyloadSwiper3
        })

        expect(swiper.lazyload).toBeUndefined()
    })

    it('lazyload loadOnTransitionStart: true', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginLazyload from '/src/modules/lazyload.js'

            const lazyloadSwiper2 = new Swiper('#swiper1', {
                speed: 10000,
                lazyload: {
                    loadOnTransitionStart: true
                },
                plugins: [
                    SwiperPluginLazyload
                ]
            })
            lazyloadSwiper2.scroll(1)
            window.lazyloadSwiper2 = lazyloadSwiper2
            window.Swiper = Swiper
            window.SwiperPluginLazyload = SwiperPluginLazyload
            `
        })

        await helper.wait(async function () {
            const $slide = await page.$$('.swiper-slide')
            const $img = await $slide[1].$$('img')
            const dataSrcAttr = await $img[0].getProperty('dataSrc')
            const srcAttr = await $img[0].getProperty('src')

            expect(await dataSrcAttr.jsonValue()).toBeUndefined()
            expect(await srcAttr.jsonValue()).toBeDefined()
        }, 100)
    })

    it('lazyload loadPrevNextAmount', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginLazyload from '/src/modules/lazyload.js'

            const lazyloadSwiper2 = new Swiper('#swiper1', {
                speed: 10000,
                lazyload: {
                    loadPrevNext: true,
                    loadOnTransitionStart: true.
                    loadPrevNextAmount: 2
                },
                plugins: [
                    SwiperPluginLazyload
                ]
            })
            window.lazyloadSwiper2 = lazyloadSwiper2
            window.Swiper = Swiper
            window.SwiperPluginLazyload = SwiperPluginLazyload
            `
        })

        await helper.wait(async function () {
            const $slide = await page.$$('.swiper-slide')
            const $loadedImg = await $slide[2].$$('img')
            const $unloadedImg = await $slide[3].$$('img')
            const $loadedImgDataSrc = await $loadedImg[0].getProperty('dataSrc')
            const $unloadedImgSrc = await $unloadedImg[0].getProperty('src')

            expect(await $loadedImgDataSrc.jsonValue()).toBeUndefined()
            expect(await $unloadedImgSrc.jsonValue()).toEqual('')
        }, 100)
    })
})
