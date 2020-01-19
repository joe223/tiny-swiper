const puppeteer = require('puppeteer')
const pti = require('puppeteer-to-istanbul')

describe('Swipe Action', () => {
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

    it('swipe slides', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            const mySwiper = new Swiper('#swiper1', {
                speed: 0
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

        expect(swiperIndex).toEqual(1)
    })

    // TODO: https://github.com/GoogleChrome/puppeteer/issues/1976
})
