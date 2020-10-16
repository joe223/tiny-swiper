module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: [
        './__test__/unit'
    ],
    collectCoverage: true,
    coverageDirectory: './coverage'
}
