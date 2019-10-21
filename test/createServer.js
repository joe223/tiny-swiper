const http = require('http')
const path = require('path')
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')

module.exports = function createTestServer () {
    const serve = serveStatic(
        path.resolve(__dirname, '../'), {
        'index': [
            'index.html',
            'index.htm'
        ]
    })

    // Create server
    const server = http.createServer(function (req, res) {
      serve(req, res, finalhandler(req, res))
    })

    // Listen
    server.listen()

    console.log('Test server is running at:', server.address().port)
    return server
}

