import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import path from 'path'

const entries = [
    {
        input: 'index.js',
        name: 'Swiper',
    },
    {
        input: 'modules/pagination.js',
        name: 'SwiperPluginPagination'
    },
    {
        input: 'modules/lazyload.js',
        name: 'SwiperPluginLazyload'
    }
]
const plugins = [
    babel()
]
const isBuildProd = process.env.NODE_ENV === 'production'

if (isBuildProd) {
    plugins.push(uglify())
}

function genConfig (entries) {
    return entries.map(entry => {
        return {
            input: path.resolve('src', entry.input),
            plugins,
            output: {
                name: entry.name,
                dir: path.resolve('lib', path.dirname(entry.input)),
                format: 'umd',
                sourcemap: !isBuildProd,
                entryFileNames: isBuildProd ? '[name].min.js' : '[name].js'
            }
        }
    })
}

export default genConfig(entries)
