const path = require('path')
const expect = require('expect')
const puppeteer = require('puppeteer')
const createServer = require('./createServer')

const server = createServer()
const globalVariables = {
    browser: global.browser,
    expect: global.expect,
    entryPath: global.entryPath
}
const opts = {
    headless: true,
    timeout: 10000
}

before (async function () {
    global.expect = expect
    global.browser = await puppeteer.launch(opts)
    global.entryPath = `http://localhost:${server.address().port}/test/index.html`
})

after (function () {
    server.close()
    browser.close()
    global.browser = globalVariables.browser
    global.expect = globalVariables.expect
    global.entryPath = globalVariables.entryPath
})
