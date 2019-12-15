// TODO: fix https://github.com/istanbuljs/puppeteer-to-istanbul/issues/20

const PuppeteerToIstanbul = require('puppeteer-to-istanbul/lib/puppeteer-to-istanbul')

module.exports = {
    write: puppeteerFormat => {
        const pti = PuppeteerToIstanbul(puppeteerFormat)
        pti.writeIstanbulFormat()
    }
}
