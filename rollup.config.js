import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

export default {
    input: 'src/index.js',
    plugins: [
        babel(),
        uglify()
    ],
    output: {
        name: 'Swiper',
        file: 'lib/index.js',
        format: 'umd'
    }
}
