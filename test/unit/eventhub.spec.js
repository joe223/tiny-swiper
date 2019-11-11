const pti = require('puppeteer-to-istanbul')

describe('EventHub', function () {
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

    it('register hooks', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'

            window.variable = {
                a: 0,
                b: 0
            }
            const mySwiper = new Swiper('#swiper1')
            mySwiper.on('hook-1', () => {
                variable.a++
            })
            mySwiper.on('hook-2', () => {
                variable.b++
            })
            mySwiper.emit('hook-1')
            mySwiper.emit('hook-1')
            mySwiper.emit('hook-2')

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })

        const variable = await page.evaluate(function () {
            return variable
        })

        expect(variable).toEqual({
            a: 2,
            b: 1
        })
    })

    it('cancel hooks', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'

            window.variable = {
                a: 0,
                b: 0
            }
            const mySwiper = new Swiper('#swiper1')
            const cb = () => {
                variable.a++
            }
            mySwiper.on('hook-1', cb)
            mySwiper.on('hook-2', () => {
                variable.b++
            })
            mySwiper.off('hook-1', cb)
            mySwiper.emit('hook-1')
            mySwiper.emit('hook-1')
            mySwiper.emit('hook-2')

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })

        const variable = await page.evaluate(function () {
            return variable
        })

        expect(variable).toEqual({
            a: 0,
            b: 1
        })
    })
})
