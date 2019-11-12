const pti = require('puppeteer-to-istanbul')

describe('Destroy', function () {
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

    it('unlink slides', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            const mySwiper = new Swiper('#swiper1')

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })

        const swiper = await page.evaluate(function () {
            mySwiper.destroy()
            return mySwiper
        })

        expect(swiper.$list).toEqual([])
        expect(swiper.$el).toEqual(null)
        expect(swiper.$wrapper).toEqual(null)
    })
})
