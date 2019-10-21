import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

const plugins = [
    babel()
]
const config = {
    input: 'src/index.js',
    plugins,
    output: {
        name: 'Swiper',
        file: 'lib/index.js',
        format: 'umd'
    }
}

if (process.env.NODE_ENV === 'production') {
    plugins.push(uglify())
    config.output.file = 'lib/index.min.js'
}

export default config
