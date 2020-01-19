module.exports = {
    wait: async function wait (cb, dely = 100) {
        return new Promise(function (resolve, reject) {
            setTimeout(async function () {
                try {
                    await cb()
                    resolve()
                } catch (err) {
                    reject(err)
                }
            }, dely)
        })
    }
}
