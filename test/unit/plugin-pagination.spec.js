const puppeteer = require('puppeteer')
const pti = require('puppeteer-to-istanbul')
const helper = require('../helper')

describe('Plugin - Pagination', function () {
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
        await page.addStyleTag({
            content: `.t-ScrollBar {
                display: block;
                position: absolute;
                top: 50%;
                right: 2.2rem;
                width: 0.5rem;
                transform: translateY(-50%);
            }
            .t-ScrollBar__item {
                display: block;
                margin: 100% 0;
                width: 100%;
                padding-top: 100%;
                height: 0;
                box-shadow: 0 0 0 0.1rem #22216D inset;
                box-shadow: 0 0 0 0.1rem black inset;
                border-radius: 50% !important;
                border: none;
                background: #FFF;
                transition: background ease 0.2s;
                cursor: pointer;
            }
            .t-ScrollBar__item.is-active {
                background: #22216D;
                background: black;
            }`
        })
    })

    it('default setup', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginPagination from '/src/modules/pagination.js'

            const mySwiper = new Swiper('#swiper1', {
                speed: 0,
                pagination: {
                    el: '.t-ScrollBar',
                    bulletClass: 't-ScrollBar__item',
                    bulletActiveClass: 'is-active',
                    clickable: true
                },
                plugins: [
                    SwiperPluginPagination
                ]
            })

            window.Swiper = Swiper
            window.mySwiper = mySwiper
            `
        })
        const $bullets = await page.$$('.t-ScrollBar .t-ScrollBar__item')
        const className = await $bullets[0].getProperty('className')

        expect(await className.jsonValue()).toEqual('t-ScrollBar__item is-active')
    })

    it('update active pagination item', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginPagination from '/src/modules/pagination.js'

            const paginationSwiper1 = new Swiper('#swiper1', {
                speed: 0,
                pagination: {
                    el: '.t-ScrollBar',
                    bulletClass: 't-ScrollBar__item',
                    bulletActiveClass: 'is-active',
                    clickable: true
                },
                plugins: [
                    SwiperPluginPagination
                ]
            })
            window.paginationSwiper1 = paginationSwiper1
            window.Swiper = Swiper
            window.SwiperPluginPagination = SwiperPluginPagination
            `
        })

        await page.evaluate(function () {
            paginationSwiper1.scroll(paginationSwiper1.index + 1, true)
        })

        await helper.wait(async function () {
            const $bullets = await page.$$('.t-ScrollBar .t-ScrollBar__item')
            const className = await $bullets[1].getProperty('className')

            expect(await className.jsonValue()).toEqual('t-ScrollBar__item is-active')
        }, 100)
    })

    it('pagination clickable', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginPagination from '/src/modules/pagination.js'

            const paginationSwiper2 = new Swiper('#swiper1', {
                speed: 0,
                pagination: {
                    el: '.t-ScrollBar',
                    bulletClass: 't-ScrollBar__item',
                    bulletActiveClass: 'is-active',
                    clickable: true
                },
                plugins: [
                    SwiperPluginPagination
                ]
            })
            window.paginationSwiper2 = paginationSwiper2
            window.Swiper = Swiper
            window.SwiperPluginPagination = SwiperPluginPagination
            `
        })

        await page.evaluate(function () {
            const $item2 = paginationSwiper2.$el.querySelectorAll('.t-ScrollBar__item')[1]

            $item2.click()
        })

        await helper.wait(async function () {
            const $bullets = await page.$$('.t-ScrollBar .t-ScrollBar__item')
            const className = await $bullets[1].getProperty('className')

            expect(await className.jsonValue()).toEqual('t-ScrollBar__item is-active')
        }, 100)
    })

    it('pagination destroyed', async function () {
        await page.addScriptTag({
            type: 'module',
            content: `
            import Swiper from '/src/index.js'
            import SwiperPluginPagination from '/src/modules/pagination.js'

            const paginationSwiper3 = new Swiper('#swiper1', {
                speed: 0,
                pagination: {
                    el: '.t-ScrollBar',
                    bulletClass: 't-ScrollBar__item',
                    bulletActiveClass: 'is-active',
                    clickable: true
                },
                plugins: [
                    SwiperPluginPagination
                ]
            })

            window.Swiper = Swiper
            window.paginationSwiper3 = paginationSwiper3
            `
        })

        const swiper = await page.evaluate(function () {
            paginationSwiper3.destroy()
            return paginationSwiper3
        })

        expect(swiper.$pagination).toEqual(null)
        expect(swiper.$pageList).toEqual([])
    })
})
