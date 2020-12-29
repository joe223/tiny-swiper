module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: [
        './__test__/unit',
        './__test__/smoke'
    ],
    collectCoverage: true,
    coverageDirectory: './coverage'
}
